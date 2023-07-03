import express from "express";
import cors from "cors";
import "dotenv/config.js"
import { userRouter, distritoRouter, calificacionRouter} from "./api/routes/index.js";
import ejsMate from "ejs-mate";
import { dirname, join } from "path";
import bodyParser from "body-parser";

//permite usar el --dirname para la plantilla
const __dirname = dirname(process.argv[1]);

const app = express();

// Configuración del motor de plantillas EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
//Permite la lectura del form 
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// Routes
app.use("/api", userRouter);  
app.use("/distrito", distritoRouter);
app.use("/calificacion", calificacionRouter);

const PORT = process.env.PORT || 5000;
const USER = process.env.USER_DB;

//init server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
