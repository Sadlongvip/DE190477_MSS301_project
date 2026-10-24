import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../page/LandingPage';
import MenuPage from '../page/MenuPage';
import CartPage from '../page/CartPage';
import AdminMenuPage from '../page/admin/AdminMenuPage';
import AdminDashboardPage from '../page/admin/AdminDashboardPage';
import AdminOrderPage from '../page/admin/AdminOrderPage';
import AdminAccountPage from '../page/admin/AdminAccountPage';
import AdminRoute from '../component/auth/AdminRoute';
import ProtectedRoute from '../component/auth/ProtectedRoute';
import OrderPage from '../page/OrderPage';

/**
 * AppRouter - Cấu hình định tuyến trang cho toàn bộ ứng dụng Shop_MilkTea
 * - / : Trang Chủ Khách Hàng (Landing Page)
 * - /menu : Trang Thực Đơn
 * - /cart : Trang Giỏ Hàng
 * - /orders : Lịch Sử Đơn Hàng Của Khách
 * - /admin : Chuyển hướng tới /admin/dashboard
 * - /admin/dashboard : Báo Cáo & Thống Kê Tổng Quan (Admin Landing Page)
 * - /admin/menu : Quản Lý Thực Đơn & Kho Hàng
 * - /admin/orders : Quản Lý Đơn Hàng Toàn Hệ Thống & Saga Logs
 * - /admin/accounts : Quản Lý Tài Khoản (CRUD + Verification riêng)
 * - * : Mặc định chuyển hướng về Trang Chủ
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute title="Lịch Sử Đơn Hàng Của Bạn">
              <OrderPage />
            </ProtectedRoute>
          }
        />

        {/* Các tuyến đường dành riêng cho ADMIN (Bảo vệ bởi AdminRoute) */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <AdminRoute>
              <AdminMenuPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrderPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/accounts"
          element={
            <AdminRoute>
              <AdminAccountPage />
            </AdminRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
