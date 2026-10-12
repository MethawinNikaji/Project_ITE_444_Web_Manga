"use client";

import Link from "next/link";
import { logoutAction } from "@/app/login/actions";

export default function NavbarClient({ user }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-2">
      <div className="container">
        {/* โลโก้ / ชื่อเว็บ */}
        <Link className="navbar-brand fw-bold text-white d-flex align-items-center gap-2" href="/">
          <span className="fs-4">📖</span> MangaApp
        </Link>

        {/* ปุ่ม Toggle สำหรับมือถือ */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbarNav"
          aria-controls="mainNavbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbarNav">
          {/* ลิงก์เมนูฝั่งซ้าย */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link text-white-50" href="/">
                หน้าแรก
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-danger fw-semibold d-flex align-items-center gap-1" href="/nsfw">
                <span className="badge bg-danger">NSFW</span> โซนพิเศษ (Member)
              </Link>
            </li>
            {user?.role === "ADMIN" && (
              <li className="nav-item">
                <Link className="nav-link text-info fw-semibold" href="/admin">
                  ⚙️ แผงควบคุม (Admin)
                </Link>
              </li>
            )}
          </ul>

          {/* ลิงก์เมนูฝั่งขวา: ล็อกอิน / สมาชิก */}
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="badge bg-secondary py-2 px-3 small">
                  👤 {user.username} ({user.role})
                </span>
                <form action={logoutAction} className="d-inline mb-0">
                  <button type="submit" className="btn btn-outline-danger btn-sm">
                    ออกจากระบบ
                  </button>
                </form>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link href="/login" className="btn btn-outline-light btn-sm">
                  เข้าสู่ระบบ
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm fw-semibold">
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

