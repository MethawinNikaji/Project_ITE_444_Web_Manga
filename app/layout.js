import "bootstrap/dist/css/bootstrap.min.css";
import ConditionalNavbar from '@/components/ConditionalNavbar'; // เปลี่ยนมา import ตัวนี้แทน

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConditionalNavbar /> {/* ใช้ ConditionalNavbar แทน Navbar ตรงนี้ */}
        {children}
      </body>
    </html>
  );
}