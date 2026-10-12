"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerAction(prevState, formData) {
  const username = formData.get("username")?.trim();
  const email = formData.get("email")?.trim().toLowerCase();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm_password");

  if (!username || !email || !password || !confirmPassword) {
    return { error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" };
  }

  if (username.length < 3) {
    return { error: "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร" };
  }

  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" };
  }

  if (password !== confirmPassword) {
    return { error: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน" };
  }

  try {
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return { error: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" };
      }
      if (existingUser.email === email) {
        return { error: "อีเมลนี้ถูกใช้งานแล้ว" };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "MEMBER",
      },
    });

    const token = signToken(newUser);
    await setAuthCookie(token);

    redirect("/");
  } catch (error) {
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Register error:", error);
    return { error: "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง" };
  }
}

