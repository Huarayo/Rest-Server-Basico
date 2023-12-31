const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/categorias',
      productos: '/api/productos',
      usuarios: '/api/usuarios',
      uploads: '/api/uploads'
    }

    // Conectar a base de datos
    this.conectarDB();

    //middlewares
    this.middlewares();

    //Rutas de mi app
    this.routes();//llamar a mis rutas
  }

  async conectarDB() {
    await dbConnection()
  }

  middlewares() {

    //CORS
    this.app.use( cors() )

    //Lectura y parseo del body
    this.app.use( express.json() );
    
    this.app.use( express.static('public') ); //lo que me interesa publicar es public

    // Note that this option available for versions 1.0.0 and newer. 
    this.app.use( fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    }));

  }

  routes() {
    this.app.use( this.paths.auth, require('../routes/auth'));
    // this.app.use( this.paths.buscar, require('../routes/buscar'));
    // this.app.use( this.paths.categorias, require('../routes/categorias'));
    // this.app.use( this.paths.productos, require('../routes/productos'));
    this.app.use( this.paths.usuarios , require('../routes/usuarios'));
    this.app.use( this.paths.uploads , require('../routes/uploads'));
  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log("Servidor corriendo en el puerto: ",this.port)
    })
  }
}


module.exports = Server;