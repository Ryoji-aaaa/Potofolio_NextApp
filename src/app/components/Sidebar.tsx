import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Settings,
  ScanBarcode,
  CalendarDays,
  CalendarSearch,
  Menu,
  X,
  PanelTopOpen,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className="sidebar">
      <div className="menu-header">
        <h1>Menu</h1>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      <nav className={`menu ${isOpen ? "open" : ""}`}>
        <Link href="/mypage">
          <Home />
          ホーム
        </Link>
        <Link href="/mypage/payment-details">
          <PanelTopOpen />
          明細
        </Link>
        <Link href="/mypage/reservation">
          <CalendarDays />
          追加
        </Link>
        <Link href="/mypage/reservation/delete-reservation">
          <CalendarSearch />
          確認・削除
        </Link>
        <Link href="/mypage/barcode">
          <ScanBarcode />
          表示
        </Link>
        <Link href="/mypage/settings">
          <Settings />
          設定
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
