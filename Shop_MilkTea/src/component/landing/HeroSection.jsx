import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

/**
 * Hero Section - Banner chính ấn tượng cho Shop_MilkTea
 * Tích hợp hệ thống màu accent (Caramel, Hồng đào, Matcha) & hiệu ứng animation mượt mà
 */
export function HeroSection({ onOpenCart: _onOpenCart }) {
  return (
    <section id="home" className="position-relative py-5 overflow-hidden" style={{ background: 'linear-gradient(180deg, #fffbeb 0%, #faf7f2 100%)' }}>
      {/* Decorative blurred background animated lights (Caramel, Hồng đào, Matcha) */}
      <div
        className="position-absolute rounded-circle hero-blob-caramel"
        style={{
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0) 70%)',
          top: '-10%',
          right: '-5%',
          zIndex: 0,
        }}
      />
      <div
        className="position-absolute rounded-circle hero-blob-peach"
        style={{
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(251, 113, 133, 0.22) 0%, rgba(251, 113, 133, 0) 70%)',
          bottom: '-5%',
          left: '-6%',
          zIndex: 0,
        }}
      />
      <div
        className="position-absolute rounded-circle hero-blob-matcha"
        style={{
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.18) 0%, rgba(34, 197, 94, 0) 70%)',
          top: '40%',
          right: '25%',
          zIndex: 0,
        }}
      />

      <Container className="position-relative" style={{ zIndex: 1 }}>
        <Row className="align-items-center gy-5">
          {/* Cột trái: Văn bản & Kêu gọi hành động */}
          <Col lg={6} className="text-center text-lg-start animate-fade-left">
            <div className="mb-3">
              <span className="section-badge-tea">
                <i className="bi bi-stars"></i> Trà Sữa Đậm Vị Chuẩn Gu
              </span>
            </div>

            <h1
              className="display-4 fw-bolder mb-3 text-dark"
              style={{ lineHeight: 1.15, letterSpacing: '-1.5px' }}
            >
              Hương Vị Trà Nguyên Bản{' '}
              <span className="text-gradient-tea d-inline-block">
                Ngọt Ngào Từng Khoảnh Khắc
              </span>
            </h1>

            <p className="lead text-muted mb-4 fs-6" style={{ maxWidth: '520px' }}>
              Trà sữa được nấu mới từ 100% búp trà thượng hạng Mộc Châu hòa quyện cùng sữa tươi thanh trùng và trân châu đường đen dẻo bùi chuẩn vị.
            </p>

            {/* Các nút bấm hành động */}
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-3 mb-5">
              <Button
                href="#menu"
                className="btn-tea-primary px-4 py-3 fs-6 d-flex align-items-center gap-2"
              >
                <i className="bi bi-cup-straw fs-5"></i>
                <span>Xem Thực Đơn Ngay</span>
              </Button>
              <Button
                href="#why-us"
                variant="outline-secondary"
                className="btn-tea-secondary px-4 py-3 fs-6 d-flex align-items-center gap-2"
              >
                <i className="bi bi-stars fs-5"></i>
                <span>Vì Sao Chọn Chúng Tôi</span>
              </Button>
            </div>

            {/* Thống kê nổi bật trong thẻ card tương tác */}
            <Row className="pt-3 border-top g-3 text-center text-lg-start">
              <Col xs={4}>
                <div className="hero-stat-item">
                  <h4 className="fw-bold mb-0 text-dark">50K+</h4>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>Khách hài lòng</small>
                </div>
              </Col>
              <Col xs={4}>
                <div className="hero-stat-item">
                  <h4 className="fw-bold mb-0 text-dark">30+</h4>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>Vị trà độc quyền</small>
                </div>
              </Col>
              <Col xs={4}>
                <div className="hero-stat-item">
                  <h4 className="fw-bold mb-0 text-warning d-flex align-items-center justify-content-center justify-content-lg-start gap-1">
                    4.9 <i className="bi bi-star-fill fs-6"></i>
                  </h4>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>10K+ Đánh giá</small>
                </div>
              </Col>
            </Row>
          </Col>

          {/* Cột phải: Hình ảnh minh họa & Floating Cards */}
          <Col lg={6} className="text-center position-relative animate-fade-right">
            <div className="position-relative d-inline-block">
              {/* Hình ảnh chính với hiệu ứng bo góc và đổ bóng mượt */}
              <div
                className="rounded-5 overflow-hidden shadow-lg mx-auto floating-hero-img position-relative"
                style={{
                  maxWidth: '460px',
                  height: '480px',
                  border: '8px solid #ffffff',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800&auto=format&fit=crop&q=80"
                  alt="Trà sữa trân châu hoàng kim"
                  fetchPriority="high"
                  decoding="async"
                  className="w-100 h-100 object-fit-cover"
                />
              </div>

              {/* Floating Badge 1: Đánh giá cao */}
              <div
                className="glass-card position-absolute p-3 d-flex align-items-center gap-3 shadow-lg hero-floating-badge"
                style={{
                  bottom: '25px',
                  left: '-20px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  minWidth: '200px',
                }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                >
                  <i className="bi bi-star-fill fs-5"></i>
                </div>
                <div className="text-start">
                  <div className="fw-bold text-dark small">Top 1 Trà Sữa</div>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>Được yêu thích 2026</small>
                </div>
              </div>

              {/* Floating Badge 2: Giao nhanh */}
              <div
                className="glass-card position-absolute p-3 d-flex align-items-center gap-3 shadow-lg hero-floating-badge-alt"
                style={{
                  top: '40px',
                  right: '-15px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)' }}
                >
                  <i className="bi bi-lightning-charge-fill fs-5"></i>
                </div>
                <div className="text-start">
                  <div className="fw-bold text-dark small">Giao Trong 30 Phút</div>
                  <small className="text-success fw-semibold" style={{ fontSize: '0.75rem' }}>Đá riêng mát lạnh</small>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HeroSection;
