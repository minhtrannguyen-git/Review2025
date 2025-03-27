import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user.model.js";
import { Request, Response } from "express";
import { basicErrorHandling, generateJWT } from "../lib/utils.js";
import { IAuthenticatedRequest } from "../middlewares/auth.middleware.js";
import cloudinary from "../lib/cloudinary.config.js";

export async function signup(req: Request<{}, {}, IUser>, res: Response) {
  try {
    console.log(req.body);

    const { email, fullname, password, avatar } = req.body;

    const newUser = await User.signup(email, password, fullname, avatar);

    const token = await generateJWT(newUser._id, res);

    const { password: _, ...securedUser } = newUser.toObject();

    res.status(201).json({
      ...securedUser,
    });
  } catch (e) {
    basicErrorHandling(e, res);
  }
}
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email }).lean();
    if (!exists) throw new Error("Invalid credentials");

    const comparison = await bcrypt.compare(password, exists.password);
    if (!comparison) throw new Error("Invalid credentials");

    const token = await generateJWT(exists._id, res);

    const { password: _, ...securedUser } = exists;

    res.status(201).json({
      ...securedUser,
    });
  } catch (e) {
    basicErrorHandling(e, res);
  }
}

export async function updateProfile(req: IAuthenticatedRequest, res: Response) {
  try {
    const { avatar } = req.body;
    if (!avatar) throw new Error("Profile picture is not provided");

    const { secure_url: avatarURL } = await cloudinary.uploader.upload(avatar, {
      resource_type: "image",
      folder: "chat_app_profile_pictures", // Save in a specific folder
      allowed_formats: ["jpg", "png", "jpeg", "webp"], // Restrict formats
      transformation: [{ width: 300, height: 300, crop: "limit" }], // Resize image
    });

    const previousUser = await User.findById(req.userId);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        avatar: avatarURL,
      },
      { new: true }
    ).lean();
    if (!updatedUser) throw new Error("User does not exists");

    const { password: _, ...securedUser } = updatedUser;

    res.status(200).json({
      ...securedUser,
    });

    // Destroy previous avatar if exists
    if (previousUser?.avatar) {
      const publicId = previousUser.avatar.split("/").pop()?.split(".")[0];
      console.log("Public ID: ", publicId);
      if (publicId) {
        const successDestroy = await cloudinary.uploader.destroy(`chat_app_profile_pictures/${publicId}`);
        console.log("Destroy success: ", successDestroy);
      }
    }
  } catch (e) {
    basicErrorHandling(e, res);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Logout successfully!" });
  } catch (e) {
    basicErrorHandling(e, res);
  }
}

export async function checkAuth(req: IAuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const user = await User.findById(userId).select(["-password"]).lean();
    if (!user) throw new Error("User does not exist");

    res.status(200).json({ ...user });
  } catch (error) {
    basicErrorHandling(error, res);
  }
}
