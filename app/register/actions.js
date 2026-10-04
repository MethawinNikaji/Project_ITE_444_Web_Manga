'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs'; // อย่าลืม npm install bcryptjs

export async function registerAction({ email, password }) {
  try {
    // 1. ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือยัง
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: 'อีเมลนี้มีในระบบแล้ว กรุณาใช้อีเมลอื่น' };
    }

    // 2. เข้ารหัสผ่านเพื่อความปลอดภัย (Hash Password)
    const hashedPassword = await bcrypt.hash(password, 10);
    // ดึงชื่อจากอีเมล (เช่น user@gmail.com จะได้ชื่อ "user")
    const defaultName = email.split('@')[0];

    // 3. บันทึกข้อมูลผู้ใช้ใหม่ลงฐานข้อมูล (ปรับชื่อตารางและฟิลด์ให้ตรงกับ schema.prisma ของคุณ)
    await prisma.users.create({
      data: {
        name: defaultName,
        email: email,
        password: hashedPassword,
        // role: 'user', // หากมีระบบ role สามารถเพิ่มค่าเริ่มต้นได้
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง' };
  }
}