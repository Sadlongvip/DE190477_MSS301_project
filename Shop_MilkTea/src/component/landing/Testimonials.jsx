import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { TESTIMONIALS } from '../../constant/landingData';

/**
 * Testimonials Section - Đánh giá từ khách hàng
 * Áp dụng testimonial-card với quote watermark và badge phong cách hồng đào
 */
export function Testimonials() {
  return (
    <section id="reviews" className="py-5" style={{ background: '#faf7f2' }}>
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <span className="section-badge-peach mb-2 d-inline-flex">
            ⭐ LẮNG NGHE KHÁCH HÀNG
          </span>
          <h2 className="fw-bold text-dark display-6 mb-2">
            Tín Đồ Trà Sữa Nói Gì Về Quán?
          </h2>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Hàng ngàn lời khen ngợi mỗi ngày là động lực để chúng tôi không ngừng hoàn thiện từng ly trà.
          </p>
        </div>

        {/* Reviews Cards */}
        <Row className="g-4">
          {TESTIMONIALS.map((review, idx) => (
            <Col md={4} key={review.id}>
              <Card className={`glass-card testimonial-card border-0 h-100 p-4 d-flex flex-column justify-content-between animate-fade-up delay-${(idx + 1) * 100}`}>
                <div>
                  {/* Star Rating */}
                  <div className="d-flex align-items-center gap-1 text-warning mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill small"></i>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-dark fst-italic mb-4" style={{ fontSize: '0.95rem' }}>
                    "{review.comment}"
                  </p>
                </div>

                {/* Reviewer info */}
                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="rounded-circle object-fit-cover shadow-sm"
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{review.name}</h6>
                    <small className="text-muted d-block">{review.role}</small>
                    <small className="text-warning fw-semibold" style={{ fontSize: '0.75rem' }}>
                      Món mê: {review.favoriteItem}
                    </small>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Testimonials;
