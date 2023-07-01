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

    static post(item) {
        return connection.execute('INSERT INTO alumno set ?)', [item]);
    }
    
    static update(id, item) {
        return connection.execute('UPDATE alumno set ? WHERE codigo = ?', [item, id]);
    }
    
    static delete(id) {
        return connection.execute('DELETE FROM alumno WHERE codigo = ?', [id]);
    }
};
