import { connect } from 'mongoose';

/**
  * Conexión a la base de datos
  */
connect('mongodb://127.0.0.1:27017/library-api').then(() => {
  console.log('Connection to MongoDB server established');
}).catch(() => {
  console.log('Unable to connect to MongoDB server');
});