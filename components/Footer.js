import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white-50 mt-auto pt-5 pb-4 border-top border-secondary">
      <div className="container">
        <div className="row gy-4">
          {/* ข้อมูลเว็บไซต์ */}
          <div className="col-lg-5 col-md-6">
            <h5 className="text-white fw-bold d-flex align-items-center gap-2">
              <span>📖</span> MangaApp
            </h5>
            <p className="small mb-3 pe-lg-4">
              แพลตฟอร์มอ่านมังงะออนไลน์คุณภาพ อัปเดตตอนใหม่สม่ำเสมอ รวมผลงานมังงะหลากหลายแนวเพื่อคอนิยายและการ์ตูนทุกคน
            </p>
            <div className="alert alert-dark border-secondary py-2 px-3 small mb-0 text-white-50">
              <span className="text-warning fw-semibold">ข้อควรทราบ:</span> คอนเทนต์ในหมวดหมู่ <span className="badge bg-danger">NSFW</span> สงวนสิทธิ์สำหรับสมาชิก Member ที่เข้าสู่ระบบแล้วเท่านั้น
            </div>
          </div>

          {/* เมนูนำทางด่วน */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-semibold mb-3">เมนูนำทาง</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <Link href="/" className="text-white-50 text-decoration-none">
                  หน้าแรก (มังงะทั่วไป)
                </Link>
              </li>
              <li>
                <Link href="/nsfw" className="text-danger text-decoration-none fw-semibold">
                  โซนพิเศษ NSFW (Member)
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white-50 text-decoration-none">
                  เข้าสู่ระบบ
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-white-50 text-decoration-none">
                  สมัครสมาชิก Member
                </Link>
              </li>
            </ul>
          </div>

          {/* สิทธิการใช้งาน & ข้อตกลง */}
          <div className="col-lg-4 col-md-12">
            <h6 className="text-white fw-semibold mb-3">นโยบายและการดูแลระบบ</h6>
            <p className="small mb-2">
              สำหรับผู้ดูแลระบบ สามารถเข้าถึงแดชบอร์ดสรุปสถิติเพื่อจัดการมังงะและตอนต่างๆ ได้ที่แผงควบคุม
            </p>
            <Link href="/admin" className="btn btn-outline-secondary btn-sm mb-3">
              ⚙️ แผงควบคุมแอดมิน
            </Link>
            <p className="small text-muted mb-0">
              เนื้อหา รูปภาพ และข้อมูลมังงะเป็นลิขสิทธิ์ของผู้แต่งและสำนักพิมพ์ต้นสังกัด
            </p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small">
          <p className="mb-0 text-muted">
            &copy; {new Date().getFullYear()} MangaApp. All rights reserved.
          </p>
          <div className="d-flex gap-3 text-muted">
            <span>นโยบายความเป็นส่วนตัว</span>
            <span>•</span>
            <span>ข้อกำหนดการใช้งาน</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

