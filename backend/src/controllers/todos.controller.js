import { Todo } from "../models/todo.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createTodo = asyncHandler(async (req, res) => {
  const { name, text } = req.body;
  if (name === "" || text === "") {
    throw new ApiError(406, "Name and text required");
  }

  const existedTodo = await Todo.findOne({ name });
  if (existedTodo) {
    throw new ApiError(400, "Todo name already exists");
  }

  const todo = await Todo.create({
    name: name,
    text: text,
    owner: req.user?._id,
  });

  if (!todo) {
    throw new ApiError(500, "Could not create todo");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { todo }, "Todo created successfully"));
});

const updateTodo = asyncHandler(async (req, res) => {
  const name = req.params;
  const { text } = req.body;
  if (!name || !text) {
    throw new ApiError(406, "Text required");
  }

  const todo = await Todo.findOneAndUpdate(
    name,
    {
      $set: {
        text: text,
      },
    },
    { new: true }
  );

  //   console.log("Todo : ",todo)
  if (!todo) {
    throw new ApiError(400, "Todo not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { todo }, "Todo updated successfully"));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const name = req.params;

  if (!name) {
    throw new ApiError(406, "Todo name required to delete");
  }

  const todo = await Todo.deleteOne(name);

  if (!todo) {
    throw new ApiError(500, "Error while deleting todo");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Todo deleted successfully"));
});

const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ owner: req.user?._id }).sort({
    createdAt: -1,
  });

  if (!todos) {
    throw new ApiError(400, "No todos find for the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { todos }, "Todos fetched successfully"));
});

const markTodoAsComplete = asyncHandler(async (req, res) => {
  const name = req.params;
  if (!name) {
    throw new ApiError(400, "Todo name not found");
  }

  const todo = await Todo.findOneAndUpdate(
    name,
    {
      $set: {
        isCompleted: true,
      },
    },
    { new: true }
  );
  if (!todo) {
    throw new ApiError(500, "Error in server");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { todo }, "Todo marked completed successfully"));
});

const deletePreviousDayTodos = asyncHandler(async (req, res) => {
  const now = new Date();
  const cutOff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  const previousTodos = await Todo.find({ createdAt: { $lt: cutOff } });
  if (!previousTodos) {
    return null;
  }
  await Todo.deleteMany({
    _id: { $in: previousTodos.map((todo) => todo._id) },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Previous day todos deleted successfully"));
});

export {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodos,
  markTodoAsComplete,
  deletePreviousDayTodos,
};
