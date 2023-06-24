import bcrypt from "bcrypt";
export const saludar = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(`El name es ${name}`);
    const { id, password: passwordBody } = req.body;
    console.log(`El id es ${id}`);
    console.log(`El password es ${passwordBody}`);
    const password = await bcrypt.hash(name, 10);
    // res.status(200).send(`funciona. password ${password}`);

    bcrypt.compare(passwordBody, password, (err, result) => {
      if (result) {
        console.log("result es true");
        // res.status(200).send("Acceso concedido");
        res
          .status(200)
          .json({ userName: "Pedro", edad: 20, id: 22, role: "admin" });
      } else {
        console.log("result es false");
        res.status(200).send("Acceso denegado");
      }
    });

    // res.status(200).json({ userName: "Pedro", edad: 20, id: 22 });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
export const saludar2 = async (req, res) => {};
export const saludar3 = async (req, res) => {};
export const saludar4 = async (req, res) => {};
export const saludar5 = async (req, res) => {};
