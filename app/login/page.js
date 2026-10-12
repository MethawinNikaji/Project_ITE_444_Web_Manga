"use client";

import { useFormState } from "react-dom";
import { loginAction } from "./actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import NavbarClient from "@/components/NavbarClient";

function LoginForm() {
  const [state, formAction] = useFormState(loginAction, null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const reason = searchParams.get("reason") || "";

  return (
    <div className="container py-5" style={{ maxWidth: "460px" }}>
      {reason === "nsfw" && (
        <div className="alert alert-warning mb-4 shadow-sm border-0">
          <h6 className="alert-heading fw-bold mb-1">🔒 เนื้อหาหมวดหมู่ NSFW</h6>
          <p className="mb-0 small">
            กรุณาเข้าสู่ระบบด้วยบัญชี Member เพื่อเข้าชมมังงะในหมวดหมู่นี้
          </p>
        </div>
      )}

      {reason === "admin" && (
        <div className="alert alert-danger mb-4 shadow-sm border-0">
          <h6 className="alert-heading fw-bold mb-1">⛔ สิทธิ์การเข้าถึง</h6>
          <p className="mb-0 small">
            พื้นที่นี้เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น กรุณาเข้าสู่ระบบ
          </p>
        </div>
      )}

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <span className="fs-1">📖</span>
            <h3 className="fw-bold mt-2 mb-1">เข้าสู่ระบบ</h3>
            <p className="text-muted small">
              สำหรับผู้ดูแลระบบ (Admin) และสมาชิก (Member)
            </p>
          </div>

          {state?.error && (
            <div className="alert alert-danger py-2 small mb-3">
              {state.error}
            </div>
          )}

          <form action={formAction}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div className="mb-3">
              <label className="form-label fw-semibold small">
                ชื่อผู้ใช้ หรือ อีเมล
              </label>
              <input
                type="text"
                name="identifier"
                className="form-control"
                placeholder="เช่น admin หรือ username"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small">รหัสผ่าน</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="กรอกรหัสผ่าน"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="mt-4 text-center border-top pt-3">
            <p className="small text-muted mb-0">
              ยังไม่มีบัญชีสมาชิกใช่หรือไม่?{" "}
              <Link href="/register" className="fw-bold text-decoration-none">
                สมัครสมาชิกที่นี่
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
  );
}

export default function LoginPage() {
  return (
    <>
      <NavbarClient />
      <Suspense
        fallback={
          <div className="container py-5 text-center text-muted">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
            กำลังโหลดแบบฟอร์ม...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </>
  );
}
