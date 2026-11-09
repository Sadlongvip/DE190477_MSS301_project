import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoute from '../component/auth/AdminRoute';
import ProtectedRoute from '../component/auth/ProtectedRoute';
import PageLoadingFallback from '../component/common/PageLoadingFallback';

// Nạp lười (Lazy Loading & Code Splitting) toàn bộ các trang để tối ưu CPU và bộ nhớ
const LandingPage = lazy(() => import('../page/LandingPage'));
const MenuPage = lazy(() => import('../page/MenuPage'));
const CartPage = lazy(() => import('../page/CartPage'));
const OrderPage = lazy(() => import('../page/OrderPage'));
const PaymentPage = lazy(() => import('../page/PaymentPage'));
const PaymentReturnPage = lazy(() => import('../page/PaymentReturnPage'));

// Phân hệ Nhân viên & Quản trị viên
const StaffPosPage = lazy(() => import('../page/staff/StaffPosPage'));
const AdminDashboardPage = lazy(() => import('../page/admin/AdminDashboardPage'));
const AdminReportPage = lazy(() => import('../page/admin/AdminReportPage'));
const AdminMenuPage = lazy(() => import('../page/admin/AdminMenuPage'));
const AdminOrderPage = lazy(() => import('../page/admin/AdminOrderPage'));
const AdminAccountPage = lazy(() => import('../page/admin/AdminAccountPage'));
const AdminChangePasswordPage = lazy(() => import('../page/admin/AdminChangePasswordPage'));

/**
 * AppRouter - Cấu hình định tuyến trang cho toàn bộ ứng dụng Shop_MilkTea
 * - / : Trang Chủ Khách Hàng (Landing Page)
 * - /menu : Trang Thực Đơn
 * - /cart : Trang Giỏ Hàng
 * - /orders : Lịch Sử Đơn Hàng Của Khách
 * - /staff/pos : Trang Gọi Món Tại Quầy cho Nhân viên (POS)
 * - /payment/:orderCode : Trang Quét Mã QR Thanh Toán
 * - /payment/vnpay-return : Trang Tiếp Nhận Kết Quả Thanh Toán VNPay
 * - /admin : Chuyển hướng tới /admin/dashboard
 * - /admin/dashboard : Báo Cáo & Thống Kê Tổng Quan (Admin Landing Page)
 * - /admin/menu : Quản Lý Thực Đơn & Kho Hàng
 * - /admin/orders : Quản Lý Đơn Hàng Toàn Hệ Thống & Saga Logs
 * - /admin/accounts : Quản Lý Tài Khoản (CRUD + Verification riêng)
 * - /admin/accounts/:id/change-password : Trang Đổi Mật Khẩu Riêng Biệt Cho Tài Khoản
 * - * : Mặc định chuyển hướng về Trang Chủ
 *
 * Toàn bộ trang sử dụng React.lazy() + <Suspense> để Code Splitting:
 * mỗi trang được nạp độc lập khi người dùng điều hướng, giảm kích thước
 * bundle JavaScript chính và thời gian tải đầu (First Load).
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoadingFallback />}>
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
          <Route path="/payment/vnpay-return" element={<PaymentReturnPage />} />
          <Route path="/payment/:orderCode" element={<PaymentPage />} />

          {/* Tuyến đường Bán hàng tại quầy cho Nhân viên & Admin */}
          <Route
            path="/staff/pos"
            element={
              <AdminRoute>
                <StaffPosPage />
              </AdminRoute>
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
            path="/admin/report"
            element={
              <AdminRoute>
                <AdminReportPage />
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
          <Route
            path="/admin/accounts/:id/change-password"
            element={
              <AdminRoute>
                <AdminChangePasswordPage />
              </AdminRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
