import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className="d-flex flex-column min-vh-100 bg-light">
        <main className="flex-grow-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
