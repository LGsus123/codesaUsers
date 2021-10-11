CREATE TABLE IF NOT EXISTS Rol( 
    id_rol INTEGER PRIMARY KEY, 
    nombre VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS Usuario( 
    id_usuario INTEGER PRIMARY KEY, 
    id_rol INTEGER NOT NULL,
    nombre VARCHAR(200) NOT NULL, 
    activo VARCHAR(200) NOT NULL, 
    FOREIGN KEY(id_rol) REFERENCES Rol(id_rol)
);

