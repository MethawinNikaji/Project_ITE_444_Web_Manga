import prisma from "@/lib/prisma";
import NavbarAdmin from "@/components/NavbarAdmin";
import BootstrapClient from "@/components/BootstrapClient";
import dynamicImport from "next/dynamic";

const DashboardCharts = dynamicImport(() => import("@/components/DashboardCharts"), {
  ssr: false,
  loading: () => (
    <div className="card shadow-sm border-0 p-5 text-center text-muted">
      <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
      กำลังโหลดกราฟสถิติ...
    </div>
  ),
});
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  // ตรวจสอบสิทธิ์ Admin
  if (!user || user.role !== "ADMIN") {
    redirect("/login?reason=admin&callbackUrl=/admin");
  }

  // 1. ดึงข้อมูลสถิติตัวเลขรวม
  const [totalMangas, totalChapters, totalMembers, totalNsfw, ongoingCount, completedCount] =
    await Promise.all([
      prisma.mangas.count(),
      prisma.chapters.count(),
      prisma.users.count({ where: { role: "MEMBER" } }),
      prisma.mangas.count({ where: { is_nsfw: true } }),
      prisma.mangas.count({ where: { status: "ongoing" } }),
      prisma.mangas.count({ where: { status: "completed" } }),
    ]);

  const generalCount = totalMangas - totalNsfw;

  // 2. ดึง 5 อันดับมังงะที่มีตอนมากที่สุด
  const topMangasQuery = await prisma.mangas.findMany({
    take: 5,
    include: {
      _count: { select: { chapters: true } },
    },
    orderBy: {
      chapters: { _count: "desc" },
    },
  });

  const topMangas = topMangasQuery.map((m) => ({
    title: m.title.length > 15 ? m.title.slice(0, 15) + "..." : m.title,
    count: m._count.chapters,
  }));

  // 3. ดึงสถิติตอนล่าสุด 7 ตอนพร้อมจำนวนหน้า
  const recentChapters = await prisma.chapters.findMany({
    take: 7,
    orderBy: { id: "desc" },
    include: {
      manga: { select: { title: true } },
      _count: { select: { pages: true } },
    },
  });

  const timelineData = {
    labels: recentChapters
      .reverse()
      .map((c) => `${c.manga.title.slice(0, 10)} ตอน ${c.chapter_number}`),
    counts: recentChapters.map((c) => c._count.pages),
  };

  return (
    <>
      <NavbarAdmin user={user} />
      <BootstrapClient />

      <div className="container py-4">
        {/* Header แดชบอร์ด */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h1 className="h3 fw-bold mb-1">📊 แผงควบคุมระบบ (Admin Dashboard)</h1>
            <p className="text-muted small mb-0">
              ยินดีต้อนรับคุณ <span className="fw-bold text-dark">{user.username}</span> | ข้อมูลสถิติและภาพรวมทั้งหมดของระบบ
            </p>
          </div>

          <div className="d-flex gap-2">
            <Link href="/admin/mangas" className="btn btn-outline-primary btn-sm fw-bold">
              📚 จัดการมังงะ
            </Link>
            <Link href="/admin/mangas/create" className="btn btn-primary btn-sm fw-bold">
              + เพิ่มมังงะใหม่
            </Link>
          </div>
        </div>

        {/* การ์ดสรุปตัวเลข 4 ใบ */}
        <div className="row g-3 mb-4">
          {/* การ์ด 1: มังงะทั้งหมด */}
          <div className="col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 border-start border-primary border-4 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small text-uppercase fw-bold">มังงะทั้งหมด</span>
                  <h3 className="fw-bold mt-1 mb-0">{totalMangas}</h3>
                  <small className="text-muted">เรื่องในระบบ</small>
                </div>
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle fs-4">
                  📚
                </div>
              </div>
            </div>
          </div>

          {/* การ์ด 2: ตอนทั้งหมด */}
          <div className="col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 border-start border-success border-4 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small text-uppercase fw-bold">ตอนทั้งหมด</span>
                  <h3 className="fw-bold mt-1 mb-0">{totalChapters}</h3>
                  <small className="text-muted">ตอนที่อัปโหลด</small>
                </div>
                <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle fs-4">
                  📄
                </div>
              </div>
            </div>
          </div>

          {/* การ์ด 3: สมาชิกทั้งหมด */}
          <div className="col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 border-start border-info border-4 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small text-uppercase fw-bold">สมาชิก Member</span>
                  <h3 className="fw-bold mt-1 mb-0">{totalMembers}</h3>
                  <small className="text-muted">ผู้ใช้งานที่ลงทะเบียน</small>
                </div>
                <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle fs-4">
                  👥
                </div>
              </div>
            </div>
          </div>

          {/* การ์ด 4: มังงะ NSFW */}
          <div className="col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 border-start border-danger border-4 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small text-uppercase fw-bold">มังงะ NSFW</span>
                  <h3 className="fw-bold mt-1 mb-0">{totalNsfw}</h3>
                  <small className="text-muted">สำหรับ Member เท่านั้น</small>
                </div>
                <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle fs-4">
                  🔞
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 กราฟสถิติหลัก */}
        <div className="mb-4">
          <DashboardCharts
            topMangas={topMangas}
            statusData={{ ongoing: ongoingCount, completed: completedCount }}
            categoryData={{ general: generalCount, nsfw: totalNsfw }}
            timelineData={timelineData}
          />
        </div>
      </div>
    </>
  );
}

