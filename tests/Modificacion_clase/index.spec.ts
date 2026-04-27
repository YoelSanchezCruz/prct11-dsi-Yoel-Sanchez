import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/Modificacion_clase/index.js';
import { Book } from '../../src/Modificacion_clase/models/book.js';
import { connect, connection } from 'mongoose';

// Nos conectamos y limpiamos antes de cada test
beforeEach(() => {
  const connectPromise = connection.readyState === 0 
    ? connect('mongodb://127.0.0.1:27017/library-app-test') 
    : Promise.resolve(); // Si ya está conectado, devolvemos una promesa resuelta

  // retornamos la promesa de borrar para que Vitest espere a que la base de datos esté limpia
  return connectPromise.then(() => {
    return Book.deleteMany(); 
  });
});

const testBook = {
  title: 'El señor de los Anillos',
  author: 'Tolkien',
  genre: 'Fantasy',
  year: 2006,
  isbn: '9788466631181',
  pages: 688,
  available: true
};

describe('Book API REST Tests', () => {

  it('Debe crear un nuevo libro correctamente', () => {
    return request(app)
      .post('/books')
      .send(testBook)
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject(testBook);
      });
  })

  it('Debe fallar al crear con un ISBN duplicado', () => {
    const book = new Book(testBook);
    
    return book.save().then(() => {
      // Intentamos crear otro igual
      return request(app)
        .post('/books')
        .send(testBook)
        .expect(400);
    });
  })

  it('Debe fallar al crear con campos obligatorios ausentes', () => {
    const fakeBook = {
      title: 'El señor de los Anillos',
      genre: 'Fantasy',
      year: 2006,
      isbn: '1111111111111',
      pages: 688,
      available: true
    };

    return request(app)
      .post('/books')
      .send(fakeBook)
      .expect(400);
  })
  
  it('Debe obtener todos los libros correctamente', () => {
    const book = new Book(testBook);
    
    return book.save().then(() => {
      return request(app)
        .get('/books')
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject([testBook]);
        });
    });
  })

  it('Debe obtener todos los libros correctamente según el filtro', () => {
    const book = new Book(testBook);
    
    return book.save().then(() => {
      return request(app)
        .get('/books?genre=Fantasy')
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject([testBook]);
        });
    });
  })

  it('Debe obtener el libro por su ID', () => {
    const book = new Book(testBook);
    
    return book.save().then(() => {
      const id = book._id;
      return request(app)
        .get(`/books/${id}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(testBook);
        });
    });
  })

  it('Debe fallar al intentar obtener un libro con un ID inexistente', () => {
    const book = new Book(testBook);
    
    return book.save().then(() => {
      const id = '69ef34c54d46a8d127742888'; // ID falso
      return request(app)
        .get(`/books/${id}`)
        .expect(404);
    });
  })

  it('Debe actualizar correctamente un libro', () => {
    const book = new Book(testBook);
    
    const modifiedBook = {
      title: 'El señor de los Platillos',
      author: 'Tolkien',
      genre: 'Fantasy',
      year: 2006,
      isbn: '9788466631181',
      pages: 688,
      available: true
    };

    const campos = {
      title: 'El señor de los Platillos'
    }

    return book.save().then(() => {
      const id = book._id;
      return request(app)
        .patch(`/books/${id}`)
        .send(campos)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject(modifiedBook);
        });
    });
  })

  it('Debe fallar al intentar actualizar un libro con ID inexistente', () => {
    const book = new Book(testBook);

    const campos = {
      title: 'El señor de los Platillos'
    }

    return book.save().then(() => {
      const id = '69ef34c54d46a8d127742888'; // ID falso
      return request(app)
        .patch(`/books/${id}`)
        .send(campos)
        .expect(404);
    });
  })

});
