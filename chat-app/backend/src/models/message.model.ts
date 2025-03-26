import mongoose, { Document, Model } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  text: string;
  image: string;
}

export interface IMessageModel extends Model<IMessage> {}

const MessageSchema = new mongoose.Schema<IMessage, IMessageModel>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage, IMessageModel>("Message", MessageSchema);

export default Message;
