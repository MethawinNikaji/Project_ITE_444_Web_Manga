"use client";

import { useFormState } from "react-dom";
import { registerAction } from "./actions";
import Link from "next/link";
import NavbarClient from "@/components/NavbarClient";

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, null);

  return (
    <>
      <NavbarClient />

      <div className="container py-5" style={{ maxWidth: "480px" }}>
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <span className="fs-1">✨</span>
              <h3 className="fw-bold mt-2 mb-1">สมัครสมาชิก Member</h3>
              <p className="text-muted small">
                สมัครสมาชิกเพื่อเข้าถึงมังงะทุกเรื่อง รวมถึงหมวดหมู่ NSFW พิเศษ
              </p>
            </div>

            {state?.error && (
              <div className="alert alert-danger py-2 small mb-3">
                {state.error}
              </div>
            )}

            <form action={formAction}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  ชื่อผู้ใช้ (Username) *
                </label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="เช่น reader01"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  อีเมล (Email) *
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="example@mail.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  รหัสผ่าน (Password) *
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">
                  ยืนยันรหัสผ่าน (Confirm Password) *
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control"
                  placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                  required
                />
              </div>

              <button type="submit" className="btn btn-success w-100 fw-bold py-2">
                ลงทะเบียนสมัครสมาชิก
              </button>
            </form>

            <div className="mt-4 text-center border-top pt-3">
              <p className="small text-muted mb-0">
                มีบัญชีอยู่แล้วใช่หรือไม่?{" "}
                <Link href="/login" className="fw-bold text-decoration-none">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-3">
          <Link href="/" className="small text-muted text-decoration-none">
            ← กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </>
  );
}
