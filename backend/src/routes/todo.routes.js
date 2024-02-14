import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTodo,
  deletePreviousDayTodos,
  deleteTodo,
  getTodos,
  markTodoAsComplete,
  updateTodo,
} from "../controllers/todos.controller.js";

const router = Router();

router.route("/createTodo").post(verifyJWT, createTodo);
router.route("/updateTodo/:name").patch(verifyJWT, updateTodo);
router.route("/deleteTodo/:name").post(verifyJWT, deleteTodo);
router.route("/All-todos").get(verifyJWT, getTodos);
router.route("/mark-completed/:name").patch(verifyJWT, markTodoAsComplete);
router.route("/deletePreviousDayTodo").post(verifyJWT,deletePreviousDayTodos);

export default router;
