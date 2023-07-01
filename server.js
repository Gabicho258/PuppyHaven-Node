import express from "express";
import cors from "cors";
import "dotenv/config.js"
import { userRouter} from "./api/routes/index.js";
import { connection } from "./database.js"; 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.get("/", (req, res) => {
});
app.use("/api", userRouter);

const PORT = process.env.PORT || 5000;
const USER = process.env.USER_DB;

console.log(connection ? "hola1":"no")// Init server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
