import express from "express";
// import cors from "cors";
import connectDB from "./db/index.js";
import { config } from "./config/config.js";
import {app} from "./app.js"

// const app = express();

app.use(express.json());
// app.use(cors());

/* app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
})); */

app.get("/", (req, res) => {
  res.send("Server is ready!");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};
startServer();





