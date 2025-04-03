import { Note } from '../models/Note';  
import type { INote } from '../models/Note';

// The noteData parameter should use the INote interface
export const createNote = async (noteData: INote) => {
  const newNote = new Note(noteData);
  await newNote.save();
  return newNote;
};

export const getNotes = async (): Promise<INote[]> => {
  return await Note.find({});
};

export const updateNote = async (noteId: string, updatedData: Partial<INote>): Promise<INote | null> => {
  return await Note.findByIdAndUpdate(noteId, updatedData, { new: true });
};

export const deleteNote = async (noteId: string): Promise<INote | null> => {
  return await Note.findByIdAndDelete(noteId);
};
