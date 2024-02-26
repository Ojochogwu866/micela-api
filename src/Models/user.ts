import mongoose, { Document } from "mongoose";

interface User extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    authentication: {
        password: string;
        salt?: string;
        sessionToken?: string;
    };
    chiMoneyToken?: string;
    githubUsername?: string;
}

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    },
    chiMoneyToken: { type: String },
    githubUsername: { type: String },
});

export const UserModel = mongoose.model<User>('User', UserSchema);
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Partial<User>) => new UserModel(values).save().then((user) => user.toObject() as User);


