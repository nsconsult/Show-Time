import * as mongoose from 'mongoose';
export declare const ConcertSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: Date;
    name: string;
    picture: string;
    genre: string;
    location: string;
    description: string;
    price: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: Date;
    name: string;
    picture: string;
    genre: string;
    location: string;
    description: string;
    price: number;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    date: Date;
    name: string;
    picture: string;
    genre: string;
    location: string;
    description: string;
    price: number;
}> & {
    _id: mongoose.Types.ObjectId;
}>;
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
