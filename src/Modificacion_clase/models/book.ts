import { Document, Schema, model } from 'mongoose';

// Interfaz que representa los campos de un libro
interface BookDocumentInterface extends Document {
  title: string,
  author: string,
  genre: "Fiction" | "Non-Fiction" | "Science" | "History" | "Fantasy" | "Biography",
  year: number,
  isbn: string,
  pages: number,
  available: boolean,
  rating?: number
}

// Schema que indica a la base de datos las caraterísticas de sus componentes
const BookSchema = new Schema<BookDocumentInterface>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
    enum: ["Fiction", "Non-Fiction", "Science", "History", "Fantasy", "Biography"],
  },
  year: {
    type: Number,
    required: true,
    min: 1000,
    max: new Date().getFullYear(),
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^\d{13}$/)) {
        throw new Error('El ISBN debe tener exactamente 13 dígitos');
      }
    }
  },
  pages: {
    type: Number,
    required: true,
    min: 1,
  },
  available: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  }
});

export const Book = model<BookDocumentInterface>('Book', BookSchema);