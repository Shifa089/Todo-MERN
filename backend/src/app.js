import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  express.json({
    limit: "20kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  })
);

app.use(express.static("public"));

//Routes
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

import todoRouter from "./routes/todo.routes.js";

app.use("/api/v1/todos", todoRouter);
//test
// app.get("/login", (req,res) => {
//   res.send("Hello testing done");
// });

app.use(function (err, req, res, next) {
  if (err instanceof ApiError) {
    // If it's an instance of ApiError, send JSON response with the error details
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  } else {
    // For other types of errors, send a generic error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [err.message],
    });
  }
});

export { app };
