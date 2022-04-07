const { Client } = require('pg');
require('dotenv').config();
const chalk = require('chalk');
const emoji = require('node-emoji');

//Definiendo detalles cosmeticos del terminal
const eCode = chalk.bgRed.bold.white;
const cRedB = chalk.redBright;
const skull = emoji.get('skull_and_crossbones');
const check2 = emoji.get('ballot_box_with_check');
const check = emoji.get('white_check_mark');
const star = emoji.get('sparkles');

//Variable de Entorno
const config = {
  user: process.env.BD_USER,
  host: process.env.BD_HOST,
  database: process.env.BD_NAME,
  password: process.env.BD_PWD,
  port: process.env.BD_PORT,
};

const argv = process.argv.slice(2);
const query = argv[0];
const nombre = argv[1];
const rut = argv[2];
const curso = argv[3];
const nivel = argv[4];
const eRut = argv[1]; //Cuanto es consultado o eliminar solo por rut(cambia la posicion) y se guardo en variable eRut

const client = new Client(config);
client.connect(async (error_conexion, client) => {
  if (error_conexion) {
    return console.error(
      cRedB(skull + '   Hubo un error de conexion ' + skull + '  Codigo:'),
      eCode(error_conexion.code)
    );
  }
  // *********************************
  //   ***** FUNCIONES CRUD  *******
  // *********************************

  //CREATE -> C
  //Funcion AGREGAR NUEVO ESTUDIANTE
  //Como agregar un registro nuevo desde el terminal
  //EJEMPLO:// node query.js nuevo "Luis" "13.000.000-1" "JavaScript" 7
  let queryCreate = async (nombre, rut, curso, nivel) => {
    try {
      const query = `INSERT INTO estudiantes(nombre, rut, curso, nivel) VALUES ('${nombre}','${rut}','${curso}','${nivel}')RETURNING *; `;

      const res = await client.query(query);
      console.log(
        check2 + `  Estudiante ${star}${nombre}${star} agregado con exito`
      );
      console.log(check + ' Registro Agregado: ', res.rows[0]);
      console.log(check + ' Cantidad de registros afectados: ', res.rowCount);
    } catch (error) {
      console.log(
        cRedB(skull + '   Error en agregar registro ' + skull + '  Codigo:'),
        eCode(error.code)
      );
    }

    client.end();
  };

  // READ-> R
  // Funcion LEER / CONSULTAR un registro por rut /Formato Array
  // Como consulta un registro por rut desde el terminal
  // EJEMPLO:// node query.js consultaRut "13.000.000-1"

  let queryReadRut = async (eRut) => {
    try {
      const query = `SELECT * FROM estudiantes WHERE rut ='${eRut}'`;

      const res = await client.query(query);

      if (res.rowCount !== 0) {
        console.log(
          check2 + `  Registro(s) consultado(s) por rut ${star}${eRut}${star}`
        );
        console.log(check + ' Registro:', res.rows);
      } else {
        console.log(cRedB(skull + 'Rut invalido'));
      }
    } catch (error) {
      console.log(
        cRedB(
          skull + '   Error en la consulta de registro ' + skull + '  Codigo:'
        ),
        eCode(error.code)
      );
    }
    client.end();
  };
  //
  // /READ-> R
  // /CONSULTA TODOS REGISTROS //Formato Array
  // EJEMPLO:// node query.js consultaFull
  let queryReadFull = async () => {
    try {
      const query = 'SELECT * FROM estudiantes';
      const res = await client.query(query);
      console.log(check2 + '  RegistroS Consultados:', res.rows);
      console.log(check + ' Cantidad de registros consultados: ', res.rowCount);
    } catch (error) {
      console.log(
        cRedB(
          skull + '   Error en la consulta de registro ' + skull + '  Codigo:'
        ),
        eCode(error.code)
      );
    }
    client.end();
  };
  //
  // //UPDATE> U
  // //Funcion ACTUALIZAD / MODIFICAR  un registro poer RUT
  // //                                nombre     rut        curso nivel
  // //EJEMPLO:// node query.js editar "Betty" "8.065.555-k" "Java" 9
  let queryUpdate = async (nombre, rut, curso, nivel) => {
    try {
      const query = `UPDATE estudiantes SET nombre='${nombre}', curso='${curso}', nivel='${nivel}' WHERE rut='${rut}' RETURNING *; `;

      const res = await client.query(query);

      if (res.rowCount !== 0) {
        console.log(
          check2 +
            `  El registro del estudiante con rut: ${star}${rut}${star} , fue actualizado.`
        );
        console.log(check + ' Registros Actualizados: ', res.rowCount);

        console.log(check + ` Resultado registro actualizado`, res.rows);
      } else {
        console.log(cRedB(skull + '  Rut invalido DEL IF ' + skull));
      }
    } catch (error) {
      console.log(cRedB(skull + '  Rut invalido DEL CATCH' + skull));
    }

    client.end();
  };

  // //DELETE-> D
  // //Funcion Borrar un registro por rut
  // //EJEMPLO:// node query.js eliminar "13.000.000-1"

  let queryDeleteRut = async (eRut) => {
    try {
      const query = `  DELETE FROM estudiantes WHERE rut='${eRut}' RETURNING *; `;
      const res = await client.query(query);

      if (res.rowCount !== 0) {
        console.log(
          check2 +
            `  Registro  con el rut: ${star}${eRut}${star}, fuel eliminado`
        );
      } else {
        console.log(cRedB(skull + '  Rut invalido'));
      }
    } catch (error) {
      console.log(cRedB(skull + '  Rut invalido'));
    }

    client.end();
  };

  // ++++++++++++++++++++
  // ++ Seleccion CRUD ++
  // ++++++++++++++++++++

  query == 'nuevo'
    ? queryCreate(nombre, rut, curso, nivel)
    : query == 'consultaRut'
    ? queryReadRut(eRut)
    : query == 'consultaFull'
    ? queryReadFull()
    : query == 'editar'
    ? queryUpdate(nombre, rut, curso, nivel)
    : query == 'eliminar'
    ? queryDeleteRut(eRut)
    : (console.log(
        cRedB(
          skull + '  Debe escribir una funcion existente en la app ' + skull
        )
      ),
      process.exit());

  //FIN POOL CONNECT
});
