import type { Model, Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: string;
  isEmailVerified: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  paginate(filter: any, options: any): Promise<any>;
}
