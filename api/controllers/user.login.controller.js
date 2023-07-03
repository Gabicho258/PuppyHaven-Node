import bcrypt from "bcrypt";
import { userModel } from "../models/index.js"

export const register = async (req, res) => {
  try {
    if(req.session.loggedin == true){
      console.log("Hola Usuario");
      res.redirect("/");
    } else{
      console.log("Hola Visitante");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
}

export const login = async (req, res) => {
  try {
    if(req.session.loggedin == true){
      console.log("Hola Usuario");
      res.redirect("/");
    } else{
      console.log("Hola Visitante");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
export const auth = async (req, res) => {
  try {
    const { email, password: passwordBody } = req.body;
    userModel.verifylogin(email,passwordBody,req,res);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }  

};
export const storyUser = async (req, res) => {
  try {
    const user = req.body;
    const { name, email, password: passwordBody } = req.body;
    const password = await bcrypt.hash(passwordBody, 10);
    user.password = password;
    userModel.verifyregister(user, name, email, req,res);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }  
};
export const logout = async (req,res) => {
  try {
    if(req.session.loggedin == true){
      
      req.session.destroy();
      res.redirect("/");

    } else{
      res.redirect("/api/users/login");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

