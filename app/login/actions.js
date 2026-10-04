'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs'; // อย่าลืม npm install bcryptjs

// 1. ฟังก์ชันตรวจสอบการเข้าสู่ระบบ
export async function loginAction({ email, password }) {
  try {
    // ค้นหาผู้ใช้จากฐานข้อมูล (ปรับชื่อตาราง users ให้ตรงกับ schema.prisma ของคุณ)
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    }

    // บันทึกสถานะล็อกอินลงใน Cookie
    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role || 'user',
    }), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // อายุ 1 วัน
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง' };
  }
}

// 2. ฟังก์ชันออกจากระบบ (Logout)
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('user_session');
}