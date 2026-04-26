import { Document, connect, model, Schema } from 'mongoose';

connect('mongodb://127.0.0.1:27017/notes-app').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

interface NoteDocumentInterface extends Document {
  title: string,
  body: string,
  color: 'blue' | 'green' | 'red' | 'yellow' | 'magenta'
}

const NoteSchema = new Schema<NoteDocumentInterface>({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  color: {
    type: String,
  },
});

const Note = model<NoteDocumentInterface>('Note', NoteSchema);

const note = new Note({
  title: 'Red note',
  body: 'This is a red note',
  color: 'red',
});

note.save().then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error);
});