'use client';

import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './login.css';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';
import Link from 'next/link';
import Swal from 'sweetalert2'; // 1. นำเข้า SweetAlert2

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      setIsLoading(true);

      const result = await loginAction({ email, password });
      setIsLoading(false);

      // 2. ใช้ SweetAlert2 สำหรับแจ้งเตือนเข้าสู่ระบบ
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          showConfirmButton: false,
          timer: 1500 // ให้แสดง 1.5 วินาทีแล้วเปลี่ยนหน้าอัตโนมัติ
        }).then(() => {
          router.push('/admin/mangas'); 
          router.refresh();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'ล้มเหลว',
          text: result.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">ล็อกอิน</h2>

        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>อีเมล</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
              disabled={isLoading}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>รหัสผ่าน</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              disabled={isLoading}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="login-button mb-4" disabled={isLoading}>
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>

          <div className="text-center mt-2">
            <span className="text-muted small">Don't have an account? </span>
            <Link href="/register" className="small fw-bold text-primary text-decoration-none">
              Sign up
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}