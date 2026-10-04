'use client';

import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerAction } from './actions'; 
import '../login/login.css'; 
import Swal from 'sweetalert2'; // 1. นำเข้า SweetAlert2

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'กรุณากรอกอีเมล';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    
    if (!password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
    else if (password.length < 6) newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    
    if (!confirmPassword) newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);

    const result = await registerAction({ email, password });
    
    setIsLoading(false);

    // 2. ใช้ SweetAlert2 จัดการแจ้งเตือน
    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'สมัครสมาชิกเรียบร้อยแล้ว',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        router.push('/login'); 
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ผิดพลาด',
        text: result.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Register</h2>
        
        <Form onSubmit={handleSubmit} className="login-form">
          {/* ... โค้ดส่วน Form.Group (Email, Password, Confirm Password) เหมือนเดิมทุกประการ ... */}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
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
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              disabled={isLoading}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!!errors.confirmPassword}
              disabled={isLoading}
            />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="login-button mb-3" disabled={isLoading}>
            {isLoading ? 'กำลังสมัครสมาชิก...' : 'Sign Up'}
          </Button>

          <div className="text-center mt-3">
            <span className="text-muted small">มีบัญชีอยู่แล้ว? </span>
            <Link href="/login" className="small fw-bold text-primary text-decoration-none">
              เข้าสู่ระบบที่นี่
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}