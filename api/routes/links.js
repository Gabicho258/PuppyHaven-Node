import express from "express";
import { connection } from "../../database.js";
const router = express.Router();

router.get('/add', (req, res) =>{
    res.render('prueba');
});

router.post('/add', async (req, res) => {
    const { codigo, nombre, estado} = req.body;
    const newLink = {
        codigo,
        nombre,
        estado
    };
    await connection.query('INSERT INTO alumno set ?', [newLink]);
    res.send('recibido');
});

export default router;