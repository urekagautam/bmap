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
import organizationRouter from "./routes/organization.routes.js"
import vacancyRouter from "./routes/vacancy.routes.js"

//routes declaration

//USER
app.use("/users/api/v1/", userRouter) 
app.use((err, req, res, next) => {
  console.error("Error middleware hit:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

//ORGANIZATION
app.use("/org/api/v1/", organizationRouter) 

//VACANCY
app.use("/api/v1/", vacancyRouter) 

export {app} 