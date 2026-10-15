import React, { useContext } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

/**
 * TopHeader Layout Component - Thanh thông tin tiện ích và tài khoản phía trên cùng
 */
export function TopHeader({ onOpenAuth }) {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div
      className="top-header text-white py-1 px-2 border-bottom"
      style={{
        background: 'linear-gradient(90deg, #382314 0%, #5c351b 50%, #854d0e 100%)',
        fontSize: '0.82rem',
        zIndex: 1030,
      }}
    >
      <Container className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        {/* Thông tin hỗ trợ & Khuyến mãi */}
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <span className="d-flex align-items-center gap-1 opacity-90">
            <i className="bi bi-telephone-fill text-warning"></i>
            <span>Hotline: <strong>1900 1234</strong></span>
          </span>
          <span className="d-none d-md-inline text-white-50">|</span>
          <span className="d-none d-md-flex align-items-center gap-1 opacity-90">
            <i className="bi bi-clock-fill text-warning"></i>
            <span>Mở cửa: 08:00 - 22:30</span>
          </span>
          <span className="d-none d-lg-inline text-white-50">|</span>
          <span className="d-none d-lg-flex align-items-center gap-1 text-warning fw-semibold">
            <i className="bi bi-truck"></i>
            <span>Freeship đơn từ 99k toàn quốc!</span>
          </span>
        </div>

        {/* Khu vực Tài khoản / Đăng nhập & Tạo tài khoản */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          {isAuthenticated && user ? (
            <div className="d-flex align-items-center gap-2">
              <span className="opacity-90">
                Xin chào, <strong className="text-warning">{user.username}</strong>
              </span>
              {user.role && (
                <Badge bg="warning" text="dark" className="fw-semibold px-2">
                  {user.role}
                </Badge>
              )}
              <Button
                variant="link"
                size="sm"
                onClick={logout}
                className="text-white-50 text-decoration-none p-0 ms-2 hover-white small"
                title="Đăng xuất khỏi hệ thống"
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Đăng xuất
              </Button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              {/* Nút Đăng nhập */}
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="btn btn-sm text-white px-2 py-0 border-0 bg-transparent fw-semibold hover-opacity d-flex align-items-center gap-1"
                style={{ fontSize: '0.82rem' }}
              >
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Đăng nhập</span>
              </button>

              <span className="text-white-50">/</span>

              {/* Nút Tạo tài khoản (Create Account) */}
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth('register')}
                className="btn btn-sm btn-warning text-dark px-2 py-0 rounded-pill fw-bold d-flex align-items-center gap-1 shadow-sm"
                style={{ fontSize: '0.78rem' }}
                title="Tạo tài khoản mới"
              >
                <i className="bi bi-person-plus-fill"></i>
                <span>Tạo tài khoản</span>
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default TopHeader;
