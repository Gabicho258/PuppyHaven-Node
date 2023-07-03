import express from "express";
import cors from "cors";
import session from "express-session";
import { userRouter } from "./api/routes/index.js";
import { walkerRouter } from "./api/routes/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
// Routes

app.get("/", (req, res) => {
  try {
    if(req.session.loggedin == true){
      res.send("Bienvenido a Puppy Heaven Usuario Iniciado");
    } else{
      console.log("Sin inicio de sesión");
      res.send("Bienvenido a Puppy Heaven");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
});

app.use("/api", userRouter);
app.use("/api", walkerRouter);


const PORT = process.env.PORT || 5000;
const USER = process.env.USER;

// Init server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});