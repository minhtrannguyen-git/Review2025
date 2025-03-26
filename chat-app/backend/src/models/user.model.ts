import bcrypt from "bcryptjs";
import mongoose, { Model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  avatar?: string;
}

export interface IUserModel extends Model<IUser> {
  signup: (
    email: string,
    password: string,
    fullname: string,
    avatar?: string
  ) => Promise<IUser>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.statics.signup = async function (
  email: string,
  password: string,
  fullname: string,
  avatar?: string
) {
  if (!email || !password || !fullname) {
    throw new Error("All fields are required");
  }
  if (password.length < 8)
    throw new Error("Password must have at least 8 character");
  const exists = await this.findOne({ email });
  if (exists) throw new Error("User already exists!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await this.create({
    email,
    password: hashedPassword,
    fullname,
    avatar,
  });
  return newUser;
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;
