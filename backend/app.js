import express from "express"
import cookieParser from "cookie-parser"

const app = express();
app.use(express.json());
app.use(cookieParser());


//routes import
import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/users", userRouter) //http://localhost:5000/api/v1/users/register

export {app}