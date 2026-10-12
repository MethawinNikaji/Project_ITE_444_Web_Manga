import Navbar from "@/components/Navbar";
import BootstrapClient from "@/components/BootstrapClient";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NsfwMangaPage({ searchParams }) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q?.trim() || "";
  const status = resolvedSearchParams?.status || "all";

  // หากยังไม่ได้เข้าสู่ระบบ แสดงหน้าจอสงวนสิทธิ์สำหรับ Member
  if (!user) {
    return (
      <>
        <Navbar />
        <BootstrapClient />

        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 text-center">
              <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
                <div className="display-1 mb-3">🔒</div>
                <h2 className="fw-bold text-danger mb-2">โซนพิเศษ NSFW</h2>
                <span className="badge bg-danger fs-6 mb-3 px-3 py-2">
                  สำหรับสมาชิก Member เท่านั้น
                </span>
                <p className="text-secondary mb-4">
                  เนื้อหาในส่วนนี้ถูกจัดอยู่ในหมวดหมู่ <strong>NSFW</strong> ผู้เข้าชมจำเป็นต้องเข้าสู่ระบบด้วยบัญชี Member เพื่อยืนยันสิทธิ์ในการเข้าชม
                </p>

                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                  <Link
                    href="/login?reason=nsfw&callbackUrl=/nsfw"
                    className="btn btn-danger btn-lg px-4 fw-semibold"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-outline-secondary btn-lg px-4"
                  >
                    สมัครสมาชิก Member
                  </Link>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <Link href="/" className="small text-muted text-decoration-none">
                    ← กลับสู่หน้าหลักมังงะทั่วไป
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // หากเข้าสู่ระบบแล้ว (Member หรือ Admin)
  const where = {
    is_nsfw: true,
  };

  if (q) {
    where.AND = [
      {
        OR: [
          { title: { contains: q } },
          { author: { contains: q } },
        ],
      },
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  const mangas = await prisma.mangas.findMany({
    where,
    orderBy: { id: "desc" },
    include: {
      _count: {
        select: { chapters: true },
      },
    },
  });

  return (
    <>
      <Navbar />
      <BootstrapClient />

      <div className="container mt-4 mb-5">
        {/* แบนเนอร์หัวข้อโซน NSFW */}
        <div className="bg-dark text-white p-4 rounded-3 shadow-sm mb-4 border border-danger">
          <div className="row align-items-center gy-3">
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-danger fs-6">NSFW ZONE</span>
                <span className="text-white-50 small">สิทธิ์สมาชิก: {user.username} ({user.role})</span>
              </div>
              <h1 className="h3 fw-bold mb-1 text-white">🔥 โซนพิเศษมังงะ NSFW</h1>
              <p className="text-white-50 mb-0 small">
                รวมมังงะแนว NSFW เอกสิทธิ์สำหรับสมาชิกโดยเฉพาะ
              </p>
            </div>

            <div className="col-lg-6">
              <form method="GET" action="/nsfw" className="row g-2">
                <div className="col-sm-7">
                  <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    className="form-control"
                    placeholder="🔍 ค้นหามังงะ NSFW..."
                  />
                </div>

                <div className="col-sm-3">
                  <select name="status" defaultValue={status} className="form-select">
                    <option value="all">ทุกสถานะ</option>
                    <option value="ongoing">ยังไม่จบ</option>
                    <option value="completed">จบแล้ว</option>
                  </select>
                </div>

                <div className="col-sm-2 d-grid">
                  <button type="submit" className="btn btn-danger fw-bold">
                    ค้นหา
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
            <span className="small text-white-50 me-1">สถานะ:</span>
            <Link
              href={q ? `/nsfw?q=${encodeURIComponent(q)}&status=all` : `/nsfw?status=all`}
              className={`btn btn-sm ${status === "all" ? "btn-light text-dark fw-bold" : "btn-outline-light"}`}
            >
              ทั้งหมด
            </Link>
            <Link
              href={q ? `/nsfw?q=${encodeURIComponent(q)}&status=ongoing` : `/nsfw?status=ongoing`}
              className={`btn btn-sm ${status === "ongoing" ? "btn-warning text-dark fw-bold" : "btn-outline-warning"}`}
            >
              🟡 กำลังดำเนินเรื่อง
            </Link>
            <Link
              href={q ? `/nsfw?q=${encodeURIComponent(q)}&status=completed` : `/nsfw?status=completed`}
              className={`btn btn-sm ${status === "completed" ? "btn-success fw-bold" : "btn-outline-success"}`}
            >
              🟢 จบแล้ว
            </Link>

            {(q || status !== "all") && (
              <Link href="/nsfw" className="btn btn-sm btn-link text-warning ms-auto">
                ✕ ล้างตัวกรอง
              </Link>
            )}
          </div>
        </div>

        {/* ผลการค้นหา */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0">
            {q ? `ผลการค้นหา NSFW สำหรับ "${q}"` : "รายการมังงะ NSFW ทั้งหมด"}
          </h2>
          <span className="badge bg-danger">
            พบ {mangas.length} เรื่อง
          </span>
        </div>

        {/* กริดมังงะ */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {mangas.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="p-4 bg-white rounded shadow-sm text-muted">
                <p className="fs-5 mb-2">ไม่พบรายการมังงะในหมวดหมู่ NSFW</p>
                <Link href="/nsfw" className="btn btn-outline-danger btn-sm">
                  ดูมังงะ NSFW ทั้งหมด
                </Link>
              </div>
            </div>
          ) : (
            mangas.map((manga) => (
              <div className="col" key={manga.id}>
                <div className="card h-100 shadow-sm border-0 border-top border-danger border-3">
                  <div className="position-relative">
                    <img
                      src={manga.cover_url || "https://via.placeholder.com/300x400?text=No+Cover"}
                      className="card-img-top"
                      alt={manga.title}
                      style={{ height: "300px", objectFit: "cover" }}
                    />
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                      NSFW
                    </span>
                    <span
                      className={`badge position-absolute top-0 end-0 m-2 ${
                        manga.status === "completed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {manga.status === "completed" ? "จบแล้ว" : "ยังไม่จบ"}
                    </span>
                    <span className="badge bg-dark position-absolute bottom-0 start-0 m-2 opacity-75">
                      📖 {manga._count.chapters} ตอน
                    </span>
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate fw-bold mb-1" title={manga.title}>
                      {manga.title}
                    </h5>

                    <p className="card-text text-muted small mb-2 text-truncate">
                      ผู้แต่ง: {manga.author || "ไม่ระบุ"}
                    </p>

                    <p
                      className="card-text small text-secondary mb-3 flex-grow-1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {manga.description || "ไม่มีเรื่องย่อ"}
                    </p>

                    <Link
                      href={`/manga/${manga.id}`}
                      className="btn btn-outline-danger w-100 fw-bold"
                    >
                      อ่านมังงะ NSFW
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

