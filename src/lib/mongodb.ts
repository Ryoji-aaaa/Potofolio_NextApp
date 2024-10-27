import mongoose from "mongoose";
// import UserSchema from "./SchemaModels";

const uri = process.env.DB_API_KEY || "";
if (!process.env.DB_API_KEY) {
  throw new Error("Please add your Mongo URI to .env.local");
}

export async function connectDB() {
  try{
    await mongoose.connect(uri);
  }catch(err){
    console.log("Error while connectiong.",err);
  }
}

export default connectDB;
