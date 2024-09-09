import * as mongoose from 'mongoose';
export declare const UserSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    createdAt: Date;
    updatedAt: Date;
    username: string;
    password: string;
    email: string;
    role: "user" | "admin";
    tickets: string[];
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    createdAt: Date;
    updatedAt: Date;
    username: string;
    password: string;
    email: string;
    role: "user" | "admin";
    tickets: string[];
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    createdAt: Date;
    updatedAt: Date;
    username: string;
    password: string;
    email: string;
    role: "user" | "admin";
    tickets: string[];
}> & {
    _id: mongoose.Types.ObjectId;
}>;
export interface User extends mongoose.Document {
    role: any;
    _id: string;
    username: string;
    password: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}
