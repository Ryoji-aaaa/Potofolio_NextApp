import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const IndexPage = () => {
    const router = useRouter();
    // const { status } = useSession();

    // useEffect(() => {
    //     if (status === "authenticated") {
    //         router.push('/mypage');
    //     } else if (status === "unauthenticated") {
    //         router.push('/login');
    //     }
    // }, [status, router]);
    useEffect(() => {
    router.push('/login');
    });
    return null;
};

export default IndexPage;
