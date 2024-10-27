// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin", // セッションがない場合にリダイレクトするページ
  },
});

export const config = {
  matcher: ["/", "/mypage", "/add", "/profile", "/update/:path*"], // ミドルウェアを適用するパス
};
