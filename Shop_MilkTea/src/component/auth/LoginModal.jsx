import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Nav } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

/**
 * Modal Đăng Nhập & Đăng Ký Tài Khoản
 */
export function LoginModal({ show, onHide }) {
  const { login, register, loading, error, clearError } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  // State cho Form Login
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  // State cho Form Register
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    phone: '',
  });

  const [formFeedback, setFormFeedback] = useState({ success: '', error: '' });

  // Reset form khi đóng mở modal
  useEffect(() => {
    if (show) {
      clearError();
      setFormFeedback({ success: '', error: '' });
    }
  }, [show, clearError]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormFeedback({ success: '', error: '' });

    if (!loginForm.username || !loginForm.password) {
      setFormFeedback({ success: '', error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!' });
      return;
    }

    const res = await login({
      username: loginForm.username,
      password: loginForm.password,
    });

    if (res.success) {
      setFormFeedback({ success: 'Đăng nhập thành công! Chào mừng bạn quay trở lại.', error: '' });
      setTimeout(() => {
        onHide();
      }, 1000);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormFeedback({ success: '', error: '' });

    if (!registerForm.username || !registerForm.password || !registerForm.email) {
      setFormFeedback({ success: '', error: 'Vui lòng điền các trường bắt buộc (Username, Password, Email)!' });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setFormFeedback({ success: '', error: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    const res = await register({
      username: registerForm.username,
      password: registerForm.password,
      email: registerForm.email,
      fullName: registerForm.fullName,
      phone: registerForm.phone,
    });

    if (res.success) {
      setFormFeedback({
        success: 'Đăng ký tài khoản thành công! Vui lòng chuyển sang tab Đăng Nhập.',
        error: '',
      });
      setActiveTab('login');
      setLoginForm((prev) => ({ ...prev, username: registerForm.username }));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="rounded-4">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <i className="bi bi-cup-straw text-warning fs-4"></i>
          <span>Chào mừng đến với MilkTea Haven</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2 px-4 pb-4">
        {/* Tab Toggle */}
        <Nav variant="pills" className="nav-justified bg-light p-1 rounded-pill mb-4 border">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'login'}
              onClick={() => {
                setActiveTab('login');
                clearError();
                setFormFeedback({ success: '', error: '' });
              }}
              className={`rounded-pill fw-bold py-2 ${
                activeTab === 'login' ? 'bg-white text-dark shadow-sm' : 'text-muted'
              }`}
            >
              Đăng Nhập
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'register'}
              onClick={() => {
                setActiveTab('register');
                clearError();
                setFormFeedback({ success: '', error: '' });
              }}
              className={`rounded-pill fw-bold py-2 ${
                activeTab === 'register' ? 'bg-white text-dark shadow-sm' : 'text-muted'
              }`}
            >
              Đăng Ký Mới
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Thông báo lỗi / thành công */}
        {(error || formFeedback.error) && (
          <Alert variant="danger" className="py-2 px-3 rounded-3 small mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {formFeedback.error || error}
          </Alert>
        )}
        {formFeedback.success && (
          <Alert variant="success" className="py-2 px-3 rounded-3 small mb-3">
            <i className="bi bi-check-circle-fill me-2"></i>
            {formFeedback.success}
          </Alert>
        )}

        {/* Tab Đăng Nhập */}
        {activeTab === 'login' ? (
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="loginUsername">
              <Form.Label className="small fw-semibold text-secondary">Tên đăng nhập</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-person text-muted"></i>
                </span>
                <Form.Control
                  type="text"
                  placeholder="Nhập username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="border-start-0 ps-0"
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4" controlId="loginPassword">
              <Form.Label className="small fw-semibold text-secondary">Mật khẩu</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="border-start-0 ps-0"
                  required
                />
              </div>
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              className="w-100 btn-tea-primary py-2 d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" /> Đang xác thực...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i> Đăng Nhập Ngay
                </>
              )}
            </Button>
          </Form>
        ) : (
          /* Tab Đăng Ký */
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-2" controlId="regUsername">
              <Form.Label className="small fw-semibold text-secondary">Tên đăng nhập *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ví dụ: linh_tra_sua"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="regEmail">
              <Form.Label className="small fw-semibold text-secondary">Email *</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="regFullName">
              <Form.Label className="small fw-semibold text-secondary">Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nguyễn Văn A"
                value={registerForm.fullName}
                onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
              />
            </Form.Group>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <Form.Label className="small fw-semibold text-secondary">Mật khẩu *</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="col-6">
                <Form.Label className="small fw-semibold text-secondary">Nhập lại *</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-100 btn-tea-primary py-2 d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" /> Đang tạo tài khoản...
                </>
              ) : (
                <>
                  <i className="bi bi-person-check-fill"></i> Hoàn Tất Đăng Ký
                </>
              )}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
