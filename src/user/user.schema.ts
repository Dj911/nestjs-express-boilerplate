import { Document, model, Schema } from 'mongoose';

import { DB, Role } from '@helpers/constant';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  password: string;
  username: string;
  roles: [Role];
}

export const UserSchema: Schema<IUser> = new Schema(
  {
    name: String,
    username: String,
    password: String,
    roles: [
      {
        type: String,
        enum: [Role],
        default: Role.USER,
      },
    ],
  },
  {
    timestamps: true,
  },
);

UserSchema.plugin(mongoosePaginate);

export const UserTest = model<IUser>(DB.USER, UserSchema);
