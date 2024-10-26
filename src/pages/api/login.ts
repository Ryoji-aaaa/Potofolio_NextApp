import jwt from "jsonwebtoken";
import connectDB from "@/utils/ConnectDB";
import { UserModel } from "@/utils/SchemaModels";
import { NextApiRequest, NextApiResponse } from "next";

const Login = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //フロントエンド側からのデータを受け取る
    const { email, password } = req.body;

    //MongoDBに接続してユーザーを探す
    await connectDB();
    const saveUser = await UserModel.findOne({ email: email });

    if (saveUser) {
      if (password === saveUser.password) {
        //jsonwebtokenでトークンを発行する
        const token = jwt.sign(
          {
            username: saveUser.username,
            email: email,
          },
          process.env.NEXT_PUBLIC_SECRET_KEY!,
          { expiresIn: "2m" }
        );

        return res.status(200).json({ message: "ログイン成功", token: token });
      } else {
        return res.status(400).json({ message: "パスワードが間違っています" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "ユーザーが存在しません。登録してください" });
    }
  } catch (error) {
    return res.status(400).json({ message: "ログイン失敗" });
  }
};

export default Login;
