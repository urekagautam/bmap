import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));

//routes import
import userRouter from "./routes/user.routes.js"

//routes declaration

app.use("/users", userRouter) //http://localhost:5000/api/v1/users/register
app.use((err, req, res, next) => {
  console.error("Error middleware hit:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export {app}