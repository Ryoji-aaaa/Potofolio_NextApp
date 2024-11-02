import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username is unique"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is unique"],
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

// モデルを作成し、エクスポートします
const UserModel = models.User || model('User', userSchema);
export default UserModel;
