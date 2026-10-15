import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../page/LandingPage';
import MenuPage from '../page/MenuPage';

/**
 * AppRouter - Cấu hình định tuyến trang cho toàn bộ ứng dụng Shop_MilkTea
 * - / : Trang Chủ (Landing Page)
 * - /menu : Trang Thực Đơn (Menu Page 30-70)
 * - * : Mặc định chuyển hướng về Trang Chủ
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
