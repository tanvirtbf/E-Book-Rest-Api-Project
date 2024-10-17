import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();

app.use(express.json()) // jate json body accepted hoy..

// Routes
app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use('/api/users', userRouter)

// Global error handler
app.use(globalErrorHandler);

export default app;
