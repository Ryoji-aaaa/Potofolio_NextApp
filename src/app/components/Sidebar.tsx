import Link from "next/link";
import { Home, Settings, ScanBarcode, CalendarDays, CalendarSearch } from "lucide-react";



const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Menu
        </h1>
      </div>
      <nav className="mt-4">
        <Link
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          href="/mypage"
        >
          <Home className="mr-3 h-5 w-5" />
          ホーム
        </Link>
        <Link
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          href="/mypage/reservation"
        >
          <CalendarDays className="mr-3 h-5 w-5" />
          追加
        </Link>
        <Link
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          href="/mypage/reservation/delete-reservation"
        >
          <CalendarSearch className="mr-3 h-5 w-5" />
          確認・削除
        </Link>
        <Link
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          href="/mypage/barcode"
        >
          <ScanBarcode className="mr-3 h-5 w-5" />
          表示
        </Link>
        <Link
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          href="/mypage/settings"
        >
          <Settings className="mr-3 h-5 w-5" />
          設定
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;