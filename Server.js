/*
	Fichero que hará la función del servidor.
	Este fichero se encargara de crear una conexion a la base de datos 
	donde almacenaremos la información.
	Ademas de crear un servidor y todas las funciones necesarias para que nuestra
	API sea RESTful.
	
	Ejecución:
		node app.js
	Esto nos dejara operativo el servidor en la direccion "localhost:3004/" o 
	"127.0.0.1:3004/", tal y como se indica mas abajo.
*/

// libreria para crear servidor es similar a express para la creación de API
var restify = require('restify');
// libreria para hacer uso de mysql, aunque es muy habitual usar la de mongoose
var mysql = require('mysql');
// creamos una coneccion a la base de datos con 
// los datos de la base de datos que hemos creado
// nombre, host, usuario, y contraseña
connection = mysql.createConnection({
               host : 'localhost',
               user : 'root',
               password : '11junio90',
               database: 'PruebasDB'
         });
// creamos las opciones para crear el servidor
// ip direccion del servidor
var ip_addr = '127.0.0.1';
// puerto 
var port    =  '3004';
// creamos el servidor
var server = restify.createServer({
    name : "usuarios"
});
// Cargamos depencias para el servidor para
// soporte CORS, query.. si no incluimos esto 
// tendremos problemas aunque es posible solucionarlos 
// con el uso de JSON.parse por ejemplo:
//   var jbody = JSON.parse(request.body);

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
// hacemos que el servidor escuche
server.listen(port ,ip_addr, function(){
    console.log('%s activo en %s ', server.name , server.url);
});
// Creamos las direcciones para las peticiones a la API
// (incluyo todos los metodos para que sea una api rest)
// incluimos un patch para realizar las peticiones 
// y un conjunto de peticiones get post y delete
server.get('/', restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));
var PATH = '/usuarios';
server.get({path : PATH , version : '0.0.1'} , findAllUsers);
server.get({path : PATH +'/:userId' , version : '0.0.1'} , findUser);
server.get({path : PATH +'/:ID/:Nombre/:Correo/:Apellidos', version: '0.0.1'} , postNewUser);
server.del({path : PATH +'/:userId' , version: '0.0.1'} , deleteUser);


/*
 Funcion que se encarga de devolver todos los usuarios de nuestra base de datos.
 
 Esta funcion incluye una llamada a nuestra base de datos desde nuestra conexion 
 a esta.
*/
function findAllUsers(req, res, next){
    connection.query('SELECT * FROM Usuarios', function (error, results){
      if(error) throw error;
      res.send(200, results);
      return next();
  });
}

/*
 Funcion que se encarga de devolver un usuario de nuestra base de datos
 por medio de su id.
 Al igual que la anterior funcion esta realiza una consulta a nuestra base de
 por los parametros requeridos para la busqueda de un usuario, o sea su id.
*/
function findUser(req, res, next){

	
    connection.query('SELECT * FROM Usuarios WHERE ID='+req.params.userId, function(error, results){
        if(error) throw error;
            
    	  res.send(200, results);
        return next();
    });
}
/*
Esta funcion se encarga de incluir un nuevo usuario en nuestra BD.
para esto crearemos un usuario con todos los campos que requiere la BD.
Haremos una llamada mada sql a nuestra base de datos para incluir 
al nuevo usuario.
*/
function postNewUser(req , res , next){
    var user = {};
    console.log(req.params);
    user.ID = req.params.ID;
    user.Nombre = req.params.Nombre;
    user.Apellidos = req.params.Apellidos;
    user.Correo = req.params.Correo;
    connection.query("INSERT INTO Usuarios (ID, Nombre, Correo,Apellidos)"+" VALUES ('"+
		  +user.ID+"','"	        
        +user.Nombre+"','"
        +user.Apellidos+"','"
        +user.Correo+ "')"
        , function (error, success){
            if(error) throw error;
            console.log(success);
            res.send(200, success.insertId);
        }
    );
}
/*
Esta funcion se encarga de borrar un usuario de la base de datos.
Como en todas las anteriores funciones se realiza una llamada a la base de datos 
esta vez para borrar un usuario de esta, a partir de su id.
*/
function deleteUser(req , res , next){
    connection.query('DELETE FROM Usuarios WHERE ID = '+req.params.userId, function (error, success){
        if(error) throw error;
        res.send(200, 'Eliminado con exito');
    }); 
}
