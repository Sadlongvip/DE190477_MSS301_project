import React, { useState } from 'react';
import { Container, Row, Col, Accordion, Form, Button, Alert } from 'react-bootstrap';
import { FAQS } from '../../constant/landingData';

/**
 * FAQ & Newsletter Section
 * Tích hợp class faq-accordion và form nhận ưu đãi mượt mà
 */
export function FAQSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <section id="faq" className="py-5" style={{ background: '#ffffff' }}>
      <Container>
        <Row className="gy-5">
          {/* Cột trái: Accordion câu hỏi thường gặp */}
          <Col lg={7} className="animate-fade-left">
            <span className="section-badge-taro mb-2 d-inline-flex">
              ❓ THẮC MẮC PHỔ BIẾN
            </span>
            <h2 className="fw-bold text-dark display-6 mb-4">Câu Hỏi Thường Gặp</h2>

            <Accordion defaultActiveKey="0" className="faq-accordion shadow-sm rounded-4 overflow-hidden">
              {FAQS.map((faq, index) => (
                <Accordion.Item eventKey={String(index)} key={index} className="border-0">
                  <Accordion.Header className="fw-semibold">
                    <span className="fw-bold text-dark">{faq.question}</span>
                  </Accordion.Header>
                  <Accordion.Body className="text-muted small" style={{ lineHeight: 1.7 }}>
                    {faq.answer}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>

          {/* Cột phải: Newsletter Banner Nhận Voucher */}
          <Col lg={5} className="animate-fade-right">
            <div
              className="p-4 p-md-5 rounded-5 h-100 d-flex flex-column justify-content-center text-white position-relative overflow-hidden shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #854d0e 0%, #b45309 60%, #d97706 100%)',
              }}
            >
              <div className="position-relative" style={{ zIndex: 1 }}>
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center bg-white text-warning mb-3 shadow-sm"
                  style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}
                >
                  <i className="bi bi-gift-fill"></i>
                </div>
                <h3 className="fw-bold mb-2">Nhận Mã Giảm 30K</h3>
                <p className="text-light opacity-90 small mb-4">
                  Đăng ký email để nhận ngay voucher 30.000đ cho đơn hàng tiếp theo cùng các tin khuyến mãi độc quyền hàng tuần!
                </p>

                {subscribed ? (
                  <Alert variant="success" className="py-2 px-3 small rounded-pill border-0 mb-0 shadow-sm">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Đã đăng ký thành công! Kiểm tra hộp thư của bạn nhé.
                  </Alert>
                ) : (
                  <Form onSubmit={handleSubscribe}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="email"
                        placeholder="Nhập email của bạn..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="py-2.5 px-3.5 rounded-pill border-0 shadow-sm"
                        style={{ fontSize: '0.9rem' }}
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="warning"
                      className="w-100 rounded-pill py-2.5 fw-bold text-dark shadow-sm"
                    >
                      Nhận Mã Ngay
                    </Button>
                  </Form>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default FAQSection;
