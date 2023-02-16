import { Document, model, Schema } from 'mongoose';

import { DB, Role } from "src/helpers/constant";

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    password: string;
    username: string;
    roles: Role
}

export const UserSchema: Schema<IUser> = new Schema({
    name: String,
    username: String,
    password: String,
    roles: {
        type: String,
        enum: [Role.ADMIN,Role.USER],
        default: Role.USER
    }
},{
    timestamps: true
})

export const UserTest = model<IUser>(DB.USER, UserSchema);