// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin", // セッションがない場合にリダイレクトするページ
  },
  callbacks: {
    authorized: ({ token }) => {
      // 管理者専用ページへのアクセスを制限
      if (token && token.admin===true) {
        return true;
      }
      return false;
    },
  },
});

export const config = {
  matcher: ["/:path*", "/mypage/:path*", "/adminpage/:path*"], // ミドルウェアを適用するパス
};
