const TableName = {
    USER: "alumno",
    USERFINAL: "USUARIOS",
    DISTRITOS: "DISTRITOS",
    TRAMITES: "TRAMITES",
    PASEOS: "PASEOS",
    PASEADORES: "PASEADORES",
    CALIFICACIONES: "CALIFICACIONES",
    PET: "MASCOTAS"
};

const TableCodFields = {
    [TableName.USER]: 'usuCod',
    [TableName.USERFINAL]: 'usuCod',
    [TableName.DISTRITOS]: 'disCod',
    [TableName.PASEADORES]: 'pasCod',
    [TableName.CALIFICACIONES]: 'calCod',
    [TableName.PASEOS]: 'pasNum',
    [TableName.TRAMITES]: 'traCod',
    [TableName.PET]: 'masCod'
};

const TableNameFields = {
    [TableName.USERFINAL]: 'usu_cod',
    [TableName.PASEADORES]: 'pas_cod',
};
const TableCorFields = {
    [TableName.USERFINAL]: 'usu_cor',
    [TableName.PASEADORES]: 'pas_cor',
};
const TableConFields = {
    [TableName.USERFINAL]: 'usu_con',
    [TableName.PASEADORES]: 'pas_con',
};


export {TableName, TableCodFields, TableNameFields, TableCorFields, TableConFields };