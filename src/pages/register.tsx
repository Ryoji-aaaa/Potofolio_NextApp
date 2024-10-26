import React, { useState } from "react";
import { useRouter } from "next/router";

const Registar = () => {
 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");
 
 //登録後にログイン画面に移動
 const router = useRouter();

 //フォームデータをapi側にリクエストを送る
 const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      })
    });
	
    //api側のレスポンスを受け取る
    const data = await res.json();
    if (data.created) {
      router.push("/login");
    } else {
      setError(data.message);
    }
  };
  
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  }

 return (
    <>
     <form onSubmit={submitHandler} >
          <label htmlFor="username">ユーザー名</label>
          <input onChange={changeHandler} value={username} type="text" name="username" id="username" />
          <label htmlFor="email">メールアドレス</label>
          <input onChange={changeHandler} value={email} type="email" name="email" id="email" />
          <label htmlFor="password">パスワード</label>
          <input onChange={changeHandler} value={password} type="password" name="password" id="password" />
          {error && <div>{error}</div>}
          <button type="submit">
            ログイン
          </button>
        </form>
    </>
  )
}

export default Registar