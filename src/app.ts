import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();

app.use(express.json()) // jate json body accepted hoy..
app.use(express.urlencoded({extended:false}))

// Routes
app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to elib apis" });
});

app.use('/api/users', userRouter)
app.use('/api/books', bookRouter)

// Global error handler
app.use(globalErrorHandler);

export default app;
