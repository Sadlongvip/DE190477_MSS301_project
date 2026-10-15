import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Badge, Row, Col } from 'react-bootstrap';
import { TOPPINGS } from '../../constant/landingData';

/**
 * Modal Tùy chỉnh chi tiết đồ uống (Đường, Đá, Size, Topping)
 */
export function ProductDetailModal({ show, product, onHide, onAddToCart }) {
  const [size, setSize] = useState('M'); // 'M' (+0) | 'L' (+6000)
  const [sugar, setSugar] = useState('70%');
  const [ice, setIce] = useState('Bình thường (100%)');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSize('M');
      setSugar('70%');
      setIce('Bình thường (100%)');
      setSelectedToppings([]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Tính toán giá tổng
  const sizeExtra = size === 'L' ? 6000 : 0;
  const toppingsTotal = selectedToppings.reduce((sum, topId) => {
    const item = TOPPINGS.find((t) => t.id === topId);
    return sum + (item ? item.price : 0);
  }, 0);
  const unitPrice = product.price + sizeExtra + toppingsTotal;
  const totalPrice = unitPrice * quantity;

  const handleToppingToggle = (topId) => {
    if (selectedToppings.includes(topId)) {
      setSelectedToppings(selectedToppings.filter((id) => id !== topId));
    } else {
      setSelectedToppings([...selectedToppings, topId]);
    }
  };

  const handleConfirm = () => {
    const customizedItem = {
      ...product,
      cartItemId: `${product.id}-${size}-${sugar}-${ice}-${selectedToppings.sort().join('_')}`,
      size,
      sugar,
      ice,
      toppings: selectedToppings.map((id) => TOPPINGS.find((t) => t.id === id)?.name).filter(Boolean),
      unitPrice,
      quantity,
      totalPrice,
    };

    onAddToCart(customizedItem);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="rounded-4">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-5">Tùy Chọn Đồ Uống</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Row className="g-4">
          {/* Cột trái: Hình ảnh & Thông tin sản phẩm */}
          <Col md={5}>
            <div className="rounded-4 overflow-hidden shadow-sm mb-3 position-relative" style={{ height: '260px' }}>
              <img
                src={product.image}
                alt={product.name}
                className="w-100 h-100 object-fit-cover"
              />
              <span className={`badge-custom-tag bg-${product.tagColor || 'primary'}`}>
                {product.tag}
              </span>
            </div>
            <h5 className="fw-bold mb-1">{product.name}</h5>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-warning fw-bold small">
                <i className="bi bi-star-fill me-1"></i>
                {product.rating}
              </span>
              <span className="text-muted small">({product.reviewsCount} lượt thích)</span>
              {product.calories && (
                <Badge bg="light" text="dark" className="border ms-auto">
                  🔥 {product.calories}
                </Badge>
              )}
            </div>
            <p className="text-muted small mb-0">{product.description}</p>
          </Col>

          {/* Cột phải: Lựa chọn Tùy biến */}
          <Col md={7}>
            {/* Chọn Size */}
            <div className="mb-3">
              <Form.Label className="fw-bold small text-dark d-block">
                1. Kích cỡ ly (Size):
              </Form.Label>
              <div className="d-flex gap-2">
                {[
                  { key: 'M', label: 'Size M (Tiêu chuẩn)', extra: '+0đ' },
                  { key: 'L', label: 'Size L (Cỡ lớn)', extra: '+6.000đ' },
                ].map((s) => (
                  <Button
                    key={s.key}
                    variant={size === s.key ? 'warning' : 'outline-secondary'}
                    size="sm"
                    className={`flex-fill rounded-3 text-start p-2 ${
                      size === s.key ? 'fw-bold border-warning' : 'border'
                    }`}
                    onClick={() => setSize(s.key)}
                  >
                    <div>{s.label}</div>
                    <small className="opacity-75">{s.extra}</small>
                  </Button>
                ))}
              </div>
            </div>

            {/* Chọn Mức Đường */}
            <div className="mb-3">
              <Form.Label className="fw-bold small text-dark d-block">
                2. Lượng đường:
              </Form.Label>
              <div className="d-flex flex-wrap gap-1">
                {['0% Không đường', '30% Ít ngọt', '50% Vừa phải', '70% Chuẩn vị', '100% Đậm đà'].map((lvl) => (
                  <Button
                    key={lvl}
                    variant={sugar === lvl ? 'warning' : 'light'}
                    size="sm"
                    className="rounded-pill px-3 py-1 small border"
                    onClick={() => setSugar(lvl)}
                  >
                    {lvl}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chọn Mức Đá */}
            <div className="mb-3">
              <Form.Label className="fw-bold small text-dark d-block">
                3. Lượng đá:
              </Form.Label>
              <div className="d-flex flex-wrap gap-1">
                {['Đá riêng', '30% Đá', '50% Đá', 'Bình thường (100%)', 'Uống Nóng'].map((lvl) => (
                  <Button
                    key={lvl}
                    variant={ice === lvl ? 'warning' : 'light'}
                    size="sm"
                    className="rounded-pill px-3 py-1 small border"
                    onClick={() => setIce(lvl)}
                  >
                    {lvl}
                  </Button>
                ))}
              </div>
            </div>

            {/* Thêm Topping */}
            <div className="mb-3">
              <Form.Label className="fw-bold small text-dark d-block">
                4. Topping kèm thêm:
              </Form.Label>
              <div className="d-flex flex-column gap-1">
                {TOPPINGS.map((top) => {
                  const isChecked = selectedToppings.includes(top.id);
                  return (
                    <div
                      key={top.id}
                      onClick={() => handleToppingToggle(top.id)}
                      className={`d-flex align-items-center justify-content-between p-2 rounded-3 border cursor-pointer ${
                        isChecked ? 'bg-warning-subtle border-warning' : 'bg-light'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <Form.Check
                        type="checkbox"
                        id={`topping-${top.id}`}
                        label={top.name}
                        checked={isChecked}
                        onChange={() => {}}
                        className="small fw-semibold pointer-events-none"
                      />
                      <span className="small text-danger fw-bold">+{top.price.toLocaleString('vi-VN')}đ</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Số lượng */}
            <div className="d-flex align-items-center justify-content-between pt-2 border-top">
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-circle"
                  style={{ width: '32px', height: '32px' }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="fw-bold px-2">{quantity}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-circle"
                  style={{ width: '32px', height: '32px' }}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>

              <div className="text-end">
                <small className="text-muted d-block">Tổng cộng</small>
                <span className="fw-bold fs-5 text-danger">
                  {totalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onHide} className="rounded-pill px-4">
          Hủy bỏ
        </Button>
        <Button onClick={handleConfirm} className="btn-tea-primary px-4">
          <i className="bi bi-cart-plus-fill me-2"></i>
          Thêm Vào Giỏ ({totalPrice.toLocaleString('vi-VN')}đ)
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductDetailModal;
