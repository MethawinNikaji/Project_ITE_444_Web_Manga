"use client";

import Link from "next/link";
import { logoutAction } from "@/app/login/actions";

export default function NavbarAdmin({ user }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* โลโก้แผงควบคุมฝั่ง Admin */}
        <Link className="navbar-brand fw-bold text-danger" href="/admin">
          📚 MangaAdmin
        </Link>

        {/* ปุ่ม Toggle สำหรับจอมือถือ */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarNav"
          aria-controls="adminNavbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* เมนูนำทาง */}
        <div className="collapse navbar-collapse" id="adminNavbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" href="/admin">
                แดชบอร์ด
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/admin/mangas">
                จัดการมังงะ
              </Link>
            </li>
          </ul>

          {/* ฝั่งขวา: สถานะแอดมิน / ปุ่มหน้าเว็บหลัก / ปุ่มออกจากระบบ */}
          <div className="d-flex align-items-center gap-2">
            {user && (
              <span className="badge bg-secondary me-1 py-2 px-2 small">
                👤 {user.username} (ADMIN)
              </span>
            )}
            <Link className="btn btn-outline-light btn-sm" href="/">
              🌐 ไปหน้าเว็บหลัก
            </Link>
            <form action={logoutAction} className="d-inline">
              <button type="submit" className="btn btn-danger btn-sm">
                ออกจากระบบ
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}