import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

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

//USER
app.use("/users/api/v1/", userRouter) //http://localhost:5000/users/api/v1/auth/signup
app.use((err, req, res, next) => {
  console.error("Error middleware hit:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

//ORGANIZATION
import orgProfileRouter from "./routes/organization.routes.js"
app.use("/org/api/v1",orgProfileRouter) //http://localhost:5000/org/api/v1/profile


export {app} 