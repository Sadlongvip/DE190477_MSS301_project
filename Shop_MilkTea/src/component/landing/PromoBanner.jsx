import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { PROMOTIONS } from '../../constant/landingData';

/**
 * Promo Banner Section - Khu vực Voucher & Khuyến mãi đặc biệt
 * Tích hợp hệ thống màu gradient voucher & tương tác sao chép mã tiện lợi
 */
export function PromoBanner({ onOpenCart: _onOpenCart }) {
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode('');
    }, 2000);
  };

  return (
    <section id="promo" className="py-5" style={{ background: '#fefce8' }}>
      <Container>
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="section-badge-tea mb-2 d-inline-flex">
            🎁 ƯU ĐÃI NỔI BẬT HÔM NAY
          </span>
          <h2 className="fw-bold text-dark display-6 mb-2">
            Mã Giảm Giá & Combo Tiết Kiệm
          </h2>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Thu thập voucher để tận hưởng những ly trà sữa thơm ngon với mức giá ưu đãi nhất.
          </p>
        </div>

        {/* Voucher Cards Grid */}
        <Row className="g-4">
          {PROMOTIONS.map((promo, idx) => {
            const isCopied = copiedCode === promo.code;
            return (
              <Col md={4} key={promo.id}>
                <Card className={`border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative bg-white animate-fade-up delay-${(idx + 1) * 100}`}>
                  {/* Top colored strip with custom accent gradient */}
                  <div
                    style={{
                      height: '6px',
                      background: promo.stripGradient || 'linear-gradient(90deg, #f59e0b 0%, #854d0e 100%)',
                    }}
                  />
                  <Card.Body className="p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <Badge bg={promo.badgeVariant || 'danger'} className="px-2.5 py-1 rounded-pill small fw-semibold">
                          {promo.badge}
                        </Badge>
                        <small className="text-muted">{promo.expiry}</small>
                      </div>

                      <h4 className="fw-bold text-dark mb-1">{promo.discount}</h4>
                      <p className="text-muted small mb-4">{promo.condition}</p>
                    </div>

                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border border-dashed">
                      <div className="voucher-code-box">
                        {promo.code}
                      </div>
                      <Button
                        variant={isCopied ? 'success' : 'warning'}
                        size="sm"
                        onClick={() => handleCopy(promo.code)}
                        className="rounded-pill px-3 py-1.5 fw-bold text-dark d-flex align-items-center gap-1 shadow-sm"
                      >
                        {isCopied ? (
                          <>
                            <i className="bi bi-check-lg"></i>
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-clipboard"></i>
                            <span>Sao chép</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}

export default PromoBanner;
