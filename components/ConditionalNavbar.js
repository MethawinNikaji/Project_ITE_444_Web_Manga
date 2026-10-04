'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; // นำเข้า Navbar ตัวเดิมของคุณ

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // ตรวจสอบว่าถ้า URL เริ่มต้นด้วย /admin จะซ่อน Navbar หลัก
  if (pathname && pathname.startsWith('/admin')) {
    return null; 
  }

  // ถ้าเป็นหน้าอื่นๆ ให้แสดง Navbar หลักตามปกติ
  return <Navbar />;
}