import { Hono } from 'hono';
import { Note } from '../models/Note';

const notes = new Hono();

notes.get('/', async (c) => {
  const allNotes = await Note.find();
  return c.json(allNotes);
});

notes.post('/', async (c) => {
  const body = await c.req.json();
  const newNote = new Note(body);
  await newNote.save();
  return c.json(newNote, 201);
});

export default notes;
