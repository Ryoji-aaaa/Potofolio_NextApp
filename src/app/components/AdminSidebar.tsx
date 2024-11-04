import React, { useState } from "react";
import Link from "next/link";
import { Home, ClipboardCheck, Salad, Settings, User, Menu, X } from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className="sidebar">
      <div className="menu-header">
        <h1>AdminMenu</h1>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      <nav className={`menu ${isOpen ? "open" : ""}`}>
        <Link href="/adminpage">
          <Home />
          ホーム
        </Link>
        <Link href="/adminpage/check-reservation">
          <ClipboardCheck />
          予約照会
        </Link>
        <Link href="/adminpage/change-price">
          <Salad />
          金額変更
        </Link>
        <Link href="/adminpage/user-manager">
          <User />
          一覧
        </Link>
        <Link href="#">
          <Settings />
          設定
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;