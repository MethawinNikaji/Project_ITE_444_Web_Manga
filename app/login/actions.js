"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie, clearAuthCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState, formData) {
  const identifier = formData.get("identifier")?.trim();
  const password = formData.get("password");
  const callbackUrl = formData.get("callbackUrl") || "";

  if (!identifier || !password) {
    return { error: "กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน" };
  }

  try {
    const user = await prisma.users.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      return { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    const token = signToken(user);
    await setAuthCookie(token);

    if (callbackUrl && !callbackUrl.startsWith("//") && callbackUrl.startsWith("/")) {
      redirect(callbackUrl);
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/");
    }
  } catch (error) {
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Login error:", error);
    return { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่" };
  }
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/login");
}

