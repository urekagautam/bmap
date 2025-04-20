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
import vacancyRouter from "./routes/vacancy.routes.js"
import organizationRouter from "./routes/organization.routes.js"

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

//VACANCY
app.use("/api/v1", vacancyRouter) //http://localhost:5000/vacancies/api/v1/createVacancy, getAllVacancies

//ORGANIZATION
app.use("/organization/api/v1", organizationRouter) //http://localhost:5000/organization/api/v1/auth/signup

export {app} 