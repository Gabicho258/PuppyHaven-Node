import connection from "../../database.js";

export default  class alumnos{
    constructor(id, name, status){
        this.id = id;
        this.item = name;
        this.status = status;
    }

    static fetchAll(){
        return connection.execute('SELECT * FROM alumno')
    }

    static post(id, item, status) {
        return connection.execute('INSERT INTO alumno set codigo=?, nombre=?, estado=?' , [id, item, status]);
    }
    
    static update(id, item, status) {
        return connection.execute('UPDATE alumno set nombre=?, estado=? WHERE codigo = ?', [item, status, id]);
    }
    
    static delete(id) {
        return connection.execute('DELETE FROM alumno WHERE codigo=?', [id]);
    }
};
