import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button, Badge, Dropdown } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

/**
 * Header Navigation Bar - Thanh điều hướng phong cách Glassmorphism
 */
export function Header({ cartCount, onOpenCart, onOpenAuth }) {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <Navbar expand="lg" sticky="top" className="glass-nav py-2 py-md-3">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand href="#home" className="d-flex align-items-center gap-2 text-decoration-none">
          <div
            className="d-flex align-items-center justify-content-center text-white rounded-circle shadow-sm"
            style={{
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, #854d0e 0%, #d97706 100%)',
              fontSize: '1.25rem',
            }}
          >
            <i className="bi bi-cup-hot-fill"></i>
          </div>
          <div>
            <span className="fw-bold fs-4 text-dark d-block lh-1" style={{ letterSpacing: '-0.5px' }}>
              Shop <span style={{ color: '#d97706' }}>MilkTea</span>
            </span>
            <small className="text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              TRÀ SỮA ĐẬM VỊ CHUẨN GU
            </small>
          </div>
        </Navbar.Brand>

        {/* Toggle button on Mobile */}
        <Navbar.Toggle aria-controls="main-navbar-nav" className="border-0 shadow-none">
          <i className="bi bi-list fs-2 text-dark"></i>
        </Navbar.Toggle>

        <Navbar.Collapse id="main-navbar-nav">
          {/* Navigation Links */}
          <Nav className="mx-auto my-2 my-lg-0 gap-lg-3 fw-semibold">
            <Nav.Link href="#home" className="text-dark px-3 py-2 rounded-pill hover-link">
              Trang Chủ
            </Nav.Link>
            <Nav.Link href="#menu" className="text-dark px-3 py-2 rounded-pill hover-link">
              Thực Đơn
            </Nav.Link>
            <Nav.Link href="#promo" className="text-dark px-3 py-2 rounded-pill hover-link">
              Ưu Đãi
            </Nav.Link>
            <Nav.Link href="#about" className="text-dark px-3 py-2 rounded-pill hover-link">
              Về Chúng Tôi
            </Nav.Link>
            <Nav.Link href="#reviews" className="text-dark px-3 py-2 rounded-pill hover-link">
              Đánh Giá
            </Nav.Link>
            <Nav.Link href="#faq" className="text-dark px-3 py-2 rounded-pill hover-link">
              Hỏi Đáp
            </Nav.Link>
          </Nav>

          {/* Action Buttons: Cart & Auth */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {/* Nút Giỏ Hàng */}
            <Button
              variant="light"
              onClick={onOpenCart}
              className="position-relative border shadow-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2"
              style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
              title="Xem giỏ hàng"
            >
              <i className="bi bi-bag-heart-fill text-danger fs-5"></i>
              <span className="fw-bold d-none d-sm-inline text-dark">Giỏ Hàng</span>
              {cartCount > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle shadow-sm px-2 py-1"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Tài Khoản / Đăng Nhập */}
            {isAuthenticated && user ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-user"
                  className="rounded-pill d-flex align-items-center gap-2 py-2 px-3 border shadow-sm"
                  style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d', color: '#92400e' }}
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span className="fw-bold">{user.username || 'Thành viên'}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border-0 rounded-4 mt-2 p-2">
                  <div className="px-3 py-2 border-bottom mb-2">
                    <p className="fw-bold mb-0 text-dark">{user.username}</p>
                    <small className="text-muted">{user.email || 'Khách hàng thân thiết'}</small>
                  </div>
                  <Dropdown.Item href="#orders" className="rounded-3 py-2">
                    <i className="bi bi-receipt me-2 text-primary"></i> Đơn hàng của tôi
                  </Dropdown.Item>
                  <Dropdown.Item href="#favorites" className="rounded-3 py-2">
                    <i className="bi bi-heart me-2 text-danger"></i> Món yêu thích
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout} className="rounded-3 py-2 text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                onClick={onOpenAuth}
                className="btn-tea-primary d-flex align-items-center gap-2"
              >
                <i className="bi bi-person-fill"></i>
                <span>Đăng Nhập</span>
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
