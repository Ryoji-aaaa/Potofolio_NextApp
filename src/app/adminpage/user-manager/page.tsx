"use client";
import { useEffect, useState } from 'react';

interface User {
  username: string;
  email: string;
}

function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/auth/users');
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("ユーザーの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  return (
    <div>
      <h1>利用者登録情報</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManager;