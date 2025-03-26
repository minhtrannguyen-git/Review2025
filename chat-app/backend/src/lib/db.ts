import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to mongodb");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }else{
        console.log("Unexpected Error: "+ error)
    }
  }
}
