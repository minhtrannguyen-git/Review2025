import { Response } from "express";
import { IAuthenticatedRequest } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";
import { basicErrorHandling } from "../lib/utils.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.config.js";
import { getUserSocket, io } from "../lib/socket.js";
import mongoose, { isValidObjectId } from "mongoose";
import { create } from "domain";

// Note: get users to display on side bar
export async function getUserForSidebar(
  req: IAuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;

    // Note: omit email and password out
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select([
      "-password",
    ]);

    res.status(200).json({
      users: filteredUsers,
    });
  } catch (e) {
    basicErrorHandling(e, res);
  }
}

// Note: get all message between 2 users
export async function getMessages(req: IAuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const allMessages = await Message.find({
      $or: [
        { senderId: userId, receiverId: id },
        { senderId: id, receiverId: userId },
      ],
    });
    res.status(200).json({ allMessages });
  } catch (error) {
    basicErrorHandling(error, res);
  }
}

export async function sendMessage(req: IAuthenticatedRequest, res: Response) {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;

    if (!text && !image) {
      throw new Error("Message must have content!");
    }

    let imageURL;
    if (image) {
      const { secure_url } = await cloudinary.uploader.upload(image, {
        resource_type: "image",
        folder: "chat_app_chat_imgs", // Save in a specific folder
        allowed_formats: ["jpg", "png", "jpeg", "webp"], // Restrict formats
        transformation: [{ width: 300, height: 300, crop: "limit" }], // Resize image
      });
      imageURL = secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image,
    });

    const socketId = getUserSocket(receiverId);
    if (socketId) {
      io.to(socketId).emit("receive-message", newMessage.toObject());
    }

    res.status(200).json({
      newMessage,
    });
  } catch (error) {
    basicErrorHandling(error, res);
  }
}

/**
 *
 * @param req Authenticated request object consisting of the receiverId in path /:id, and can receive query params limit and topMessageId (query above this Id)
 * @param res Response object from express
 */
export async function getMessagesByCursor(
  req: IAuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.userId;
    const { receiverId } = req.params;
    const { limit, topMessageId } = req.query;
    const filterQuery: { _id?: { $lt: mongoose.Types.ObjectId } } = {};
    if (topMessageId && isValidObjectId(topMessageId)) {
      filterQuery._id = {
        $lt: new mongoose.Types.ObjectId(topMessageId as string),
      };
    }

    const allMessages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
      ...filterQuery,
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 10);
    res.status(200).json({ allMessages });
  } catch (error) {
    basicErrorHandling(error, res);
  }
}
