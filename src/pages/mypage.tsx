import React from 'react';
import authCheck from '@/utils/AuthCheck';

const About: React.FC = () => {
    const user = authCheck();

    return (
        <>
            <h1>Myページ</h1>
            <p>このページはログインしているユーザー専用</p>
            <hr />
            {user && (
                <>
                    <p>{user.username}</p>
                    <p>{user.email}</p>
                </>
            )}
        </>
    );
};

export default About;