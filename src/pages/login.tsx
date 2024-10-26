import React, { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    //ログイン後にトップページへ移動させる
    const router = useRouter();
	
　　//フォームデータをapi側にリクエストを送る
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
	
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            })
        });
	
	//api側のレスポンスを受け取る
        const data = await res.json();
        if(data.token) {
            alert("ログイン成功")
            localStorage.setItem("token", data.token);
            router.push("/");
        }else{
            setError(data.message);
        }
    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
 
        switch (name) {          
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
          <form onSubmit={submitHandler}>
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
    );
};

export default Login;