import * as mongoose from 'mongoose';

export const ConcertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    picture: { type: String, required: true },

    date: { type: Date, required: true },

    genre: { type: String, required: true },

    location: { type: String, required: true },

    description: { type: String, required: true },

    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);
export interface Concert extends mongoose.Document {
  _id: string;
  name: string;
  date: Date;
  picture: string;
  genre: string;
  location: string;
  description: string;
  price: number;
}
export type ConcertDocument = Concert & Document;
