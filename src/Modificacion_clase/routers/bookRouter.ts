import express from 'express';
import { Book } from '../models/book.js';

export const bookRouter = express.Router();

/**
  * Petición para añadir un libro a la base de datos
  * @params '/books' - Ruta
  * @returns Una promesa que se resuelve con el libro añadido o se rechaza con un error
  */
bookRouter.post('/books', (req, res) => {
  const book = new Book(req.body);

  Book.findOne({ isbn: book.isbn }).then((existe) => {
    if (existe) {
      return res.status(400).send({ 
        error: "El libro ya existe en la base de datos" 
      });
    } 
   
    // Si no existe devuelve null
    book.save().then((book) => {
      res.status(201).send(book);
    }).catch((error) => {
      res.status(400).send(error);
    });

  }).catch((error) => {
    res.status(500).send(error);
  });
});


/**
  * Petición para obtener un libro concreto según su ID
  * @params '/books/:id' - Ruta indicando el ID del libro
  * @returns Una promesa que se resuelve con el libro solicitado o se rechaza con un error
  */
bookRouter.get('/books/:id', (req, res) => {
  Book.findById(req.params.id).then((book) => {
    if (!book) {
      res.status(404).send({
        error: "Libro no encontrado"
      });
    } else {
      res.status(200).send(book);
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});


/**
  * Petición para obtener todos los libros almacenados, permitiendo filtrar por genre y/o author
  * @params '/books' - Ruta
  * @returns Una promesa que se resuelve con los libros solicitados o se rechaza con un error
  */
bookRouter.get('/books', (req, res) => {
  let filter = {};
    if (req.query.genre && req.query.author) {
      filter = {genre: req.query.genre, author: req.query.author};
    } else if(req.query.genre && !req.query.author) {
      filter = {genre: req.query.genre};
    } else if (!req.query.genre && req.query.author) {
      filter = {author: req.query.author};
    } else {
      filter = {};
    }

  Book.find(filter).then((books) => {
    if (books.length === 0) {
      res.status(404).send({
        error: "Libros no encontrados"
      });
    } else {
      res.send(books);
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});


/**
  * Petición para modificar un libro a la base de datos
  * @params '/books/:id' - Ruta indicando el ID del libro
  * @returns Una promesa que se resuelve con el libro modificado o se rechaza con un error
  */
bookRouter.patch('/books/:id', (req, res) => {
  Book.findById(req.params.id).then((book) => {
    if (!book) {
      res.status(404).send({
        error: "Libro no encontrado"
      });
    } else {
      const allowedUpdates = ['title', 'author', 'genre', 'year', 'pages', 'available', 'rating'];
      const actualUpdates = Object.keys(req.body);
      const isValidUpdate =
        actualUpdates.every((update) => allowedUpdates.includes(update));
      
      if (!isValidUpdate) {
        res.status(400).send({
          error: 'La actualización no está permitida',
        });
      } else {
        return Book.findByIdAndUpdate(
          req.params.id,
          req.body,
        {
          new: true,
          runValidators: true,
        }).then((book) => {
          if (!book) {
            res.status(404).send();
          } else {
            res.send(book);
          }
        });
      }
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});


/**
  * Petición para eliminar un libro a la base de datos
  * @params '/books' - Ruta indicando el ID del libro
  * @returns Una promesa que se resuelve con el libro eliminado o se rechaza con un error
  */
bookRouter.delete('/books/:id', (req, res) => {
  Book.findById(req.params.id).then((book) => {
    if (!book) {
      res.status(404).send();
    } else {
      return Book.findByIdAndDelete(req.params.id).then((book) => {
        res.send(book);
      });
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});
