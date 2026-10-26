import React, { useState, useContext, useMemo, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  InputGroup,
  Modal,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import { InventoryContext } from '../../context/InventoryContext';
import { AuthContext } from '../../context/AuthContext';
import ProductDetailModal from '../../component/landing/ProductDetailModal';
import orderService from '../../service/orderService';
import { formatPrice } from '../../util/formatPrice';

const DEFAULT_TEA_IMAGE = 'https://images.unsplash.com/photo-1558857563-b37cfb8cb468?auto=format&fit=crop&w=600&q=80';

/**
 * Trang Gọi Món Tại Quầy (Point of Sale - POS)
 * Dành cho Nhân viên (STAFF) và Quản trị viên (ADMIN) tiếp nhận khách tại quán,
 * tạo đơn nhanh, thu tiền mặt hoặc quét VNPay, và in hóa đơn bán lẻ.
 */
export function StaffPosPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    categories,
    milkTeas,
    loading: loadingMenu,
  } = useContext(InventoryContext);

  // State bộ lọc thực đơn tại quầy
  const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  // State Modal tùy chỉnh ly trà sữa
  const [customizingProduct, setCustomizingProduct] = useState(null);

  // State Giỏ hàng POS (danh sách các ly đang gọi cho khách)
  const [posCart, setPosCart] = useState([]);

  // State thông tin đơn tại quầy
  const [customerName, setCustomerName] = useState('Khách tại quầy');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderType, setOrderType] = useState('DINE_IN'); // 'DINE_IN' hoặc 'TAKE_AWAY'
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' = Tiền mặt, 'VNPAY' = Quét QR VNPay
  const [orderNote, setOrderNote] = useState('');

  // State tính tiền mặt thối lại
  const [cashGiven, setCashGiven] = useState('');

  // State xử lý tạo đơn & Hóa đơn in ấn
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Lọc danh sách trà sữa theo Category và Keyword tìm kiếm
  const filteredMilkTeas = useMemo(() => {
    let list = milkTeas || [];
    if (selectedCategoryId !== 'ALL') {
      list = list.filter((item) => String(item.categoryId) === String(selectedCategoryId));
    }
    if (searchKeyword.trim()) {
      const q = searchKeyword.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(q))
      );
    }
    return list;
  }, [milkTeas, selectedCategoryId, searchKeyword]);

  // Thêm món từ Modal tùy chỉnh vào giỏ POS
  const handleAddToCartFromModal = (customizedItem) => {
    const cartItemId = `${customizedItem.id}_${customizedItem.size}_${customizedItem.sugar}_${customizedItem.ice}_${(customizedItem.toppings || []).sort().join('-')}`;
    
    setPosCart((prevCart) => {
      const existingIndex = prevCart.findIndex((it) => it.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        const current = nextCart[existingIndex];
        const newQty = current.quantity + customizedItem.quantity;
        nextCart[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: current.unitPrice * newQty,
        };
        return nextCart;
      }
      return [
        ...prevCart,
        {
          ...customizedItem,
          cartItemId,
        },
      ];
    });

    setCustomizingProduct(null);
  };

  // Cập nhật số lượng trong giỏ POS
  const handleUpdateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setPosCart((prevCart) =>
      prevCart.map((it) =>
        it.cartItemId === cartItemId
          ? { ...it, quantity: newQty, totalPrice: it.unitPrice * newQty }
          : it
      )
    );
  };

  // Xóa món khỏi giỏ POS
  const handleRemoveItem = (cartItemId) => {
    setPosCart((prevCart) => prevCart.filter((it) => it.cartItemId !== cartItemId));
  };

  // Reset giỏ POS về đơn mới
  const handleClearCart = () => {
    setPosCart([]);
    setCustomerName('Khách tại quầy');
    setPhoneNumber('');
    setOrderType('DINE_IN');
    setPaymentMethod('COD');
    setOrderNote('');
    setCashGiven('');
    setErrorMessage('');
  };

  // Tính tổng số lượng và tổng tiền giỏ POS
  const totalQuantity = useMemo(
    () => posCart.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0),
    [posCart]
  );
  const totalAmount = useMemo(
    () => posCart.reduce((sum, it) => sum + (Number(it.totalPrice) || 0), 0),
    [posCart]
  );

  // Tính tiền thừa thối lại
  const changeAmount = useMemo(() => {
    const given = Number(cashGiven) || 0;
    if (given <= 0 || paymentMethod !== 'COD') return 0;
    return Math.max(0, given - totalAmount);
  }, [cashGiven, totalAmount, paymentMethod]);

  // Xử lý chốt đơn tại quầy
  const handleCheckoutAtCounter = async () => {
    if (posCart.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 món trà sữa vào đơn.');
      return;
    }

    setSubmittingOrder(true);
    setErrorMessage('');

    try {
      const shippingAddress =
        orderType === 'TAKE_AWAY'
          ? 'Tại quầy - Khách mang về (Take-away)'
          : 'Tại quầy - Dùng tại quán (Dine-in)';

      const payload = {
        customerName: customerName.trim() || 'Khách tại quầy',
        phoneNumber: phoneNumber.trim() || '0900000000',
        shippingAddress,
        note: orderNote.trim(),
        shippingFee: 0, // Đặt tại quầy không tính tiền ship
        discountAmount: 0,
        paymentMethod,
        items: posCart.map((it) => ({
          milkTeaId: it.milkTeaId || it.id,
          milkTeaName: it.name || it.milkTeaName,
          size: it.size || 'M',
          sugar: it.sugar || '70%',
          ice: it.ice || '100%',
          toppings: Array.isArray(it.toppings) ? it.toppings.join(', ') : it.toppings || '',
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          image: it.image,
          note: it.note || '',
        })),
      };

      const createdOrder = await orderService.createOrder(payload);

      setCompletedOrder({
        ...createdOrder,
        orderType,
        cashGiven: Number(cashGiven) || totalAmount,
        changeAmount,
        items: [...posCart],
        cashier: user?.fullName || user?.username || 'Thu ngân quầy',
      });

      // Mở modal phiếu thanh toán hóa đơn
      setShowReceiptModal(true);
      // Xóa giỏ hàng để sẵn sàng phục vụ khách tiếp theo
      handleClearCart();
    } catch (err) {
      setErrorMessage(err.message || 'Lỗi khi tạo đơn hàng tại quầy, vui lòng thử lại.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  // In hóa đơn trực tiếp bằng trình duyệt
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <AdminLayout pageTitle="Gọi Món Tại Quầy (POS)">
      <div className="pos-page-wrapper py-2">
        <Container fluid className="px-2 px-md-3">
          {errorMessage && (
            <Alert variant="danger" dismissible onClose={() => setErrorMessage('')} className="rounded-3 py-2 small mb-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {errorMessage}
            </Alert>
          )}

          <Row className="g-3">
            {/* ================= CỘT TRÁI: DANH SÁCH MÓN & MENU (65%) ================= */}
            <Col lg={7} xl={8}>
              <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
                {/* 1. Header & Tìm kiếm */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="p-2 rounded-3 bg-warning bg-opacity-25 text-warning fs-5">
                      <i className="bi bi-cup-straw"></i>
                    </span>
                    <div>
                      <h5 className="fw-bold text-dark mb-0">Thực Đơn Quán</h5>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Nhấp vào món để chọn Size, Đường, Đá & Topping
                      </small>
                    </div>
                  </div>

                  {/* Thanh tìm kiếm */}
                  <div style={{ maxWidth: '300px', width: '100%' }}>
                    <InputGroup size="sm" className="rounded-pill overflow-hidden border">
                      <InputGroup.Text className="bg-white border-0 ps-3">
                        <i className="bi bi-search text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Tìm món nhanh..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="border-0 shadow-none ps-1"
                      />
                      {searchKeyword && (
                        <Button
                          variant="link"
                          onClick={() => setSearchKeyword('')}
                          className="text-muted text-decoration-none border-0 pe-3"
                        >
                          <i className="bi bi-x"></i>
                        </Button>
                      )}
                    </InputGroup>
                  </div>
                </div>

                {/* 2. Danh mục món dạng Pills */}
                <div className="d-flex gap-2 overflow-x-auto pb-2 mb-3" style={{ whiteSpace: 'nowrap' }}>
                  <Button
                    size="sm"
                    variant={selectedCategoryId === 'ALL' ? 'warning' : 'outline-secondary'}
                    className={`rounded-pill px-3 py-1 fw-bold ${selectedCategoryId === 'ALL' ? 'text-dark shadow-sm' : ''}`}
                    onClick={() => setSelectedCategoryId('ALL')}
                  >
                    Tất Cả ({milkTeas?.length || 0})
                  </Button>
                  {categories?.map((cat) => (
                    <Button
                      key={cat.id}
                      size="sm"
                      variant={String(selectedCategoryId) === String(cat.id) ? 'warning' : 'outline-secondary'}
                      className={`rounded-pill px-3 py-1 fw-bold ${String(selectedCategoryId) === String(cat.id) ? 'text-dark shadow-sm' : ''}`}
                      onClick={() => setSelectedCategoryId(cat.id)}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>

                {/* 3. Lưới sản phẩm */}
                {loadingMenu ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="warning" />
                    <p className="text-muted small mt-2">Đang tải thực đơn...</p>
                  </div>
                ) : filteredMilkTeas.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-cup fs-1 d-block mb-2 text-secondary"></i>
                    <span>Không tìm thấy món trà sữa nào phù hợp.</span>
                  </div>
                ) : (
                  <div
                    className="overflow-y-auto pe-1"
                    style={{ maxHeight: 'calc(100vh - 240px)', minHeight: '400px' }}
                  >
                    <Row className="g-2.5">
                      {filteredMilkTeas.map((tea) => (
                        <Col key={tea.id} xs={6} sm={4} md={4} xl={3}>
                          <div
                            onClick={() => tea.isAvailable !== false && setCustomizingProduct(tea)}
                            className={`p-2.5 rounded-4 border h-100 d-flex flex-column justify-content-between transition-all ${
                              tea.isAvailable === false
                                ? 'opacity-50 bg-light cursor-not-allowed'
                                : 'bg-white hover-shadow cursor-pointer'
                            }`}
                            style={{
                              transition: 'all 0.2s ease',
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            <div className="position-relative mb-2 rounded-3 overflow-hidden" style={{ height: '110px' }}>
                              <img
                                src={tea.image || DEFAULT_TEA_IMAGE}
                                alt={tea.name}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = DEFAULT_TEA_IMAGE;
                                }}
                                className="w-100 h-100 object-fit-cover"
                              />
                              {tea.isAvailable === false && (
                                <Badge bg="secondary" className="position-absolute top-0 start-0 m-1.5 rounded-pill">
                                  Hết hàng
                                </Badge>
                              )}
                            </div>

                            <div>
                              <div
                                className="fw-bold text-dark text-truncate small mb-1"
                                title={tea.name}
                              >
                                {tea.name}
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-black text-warning small">
                                  {formatPrice(tea.price)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="warning"
                                  className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                                  style={{ width: '28px', height: '28px' }}
                                  disabled={tea.isAvailable === false}
                                >
                                  <i className="bi bi-plus text-dark fw-bold fs-5"></i>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </Card>
            </Col>

            {/* ================= CỘT PHẢI: GIỎ HÀNG POS & CHỐT ĐƠN (35%) ================= */}
            <Col lg={5} xl={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-white d-flex flex-column">
                {/* Header giỏ POS */}
                <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-receipt-cutoff text-warning fs-5"></i>
                    <h5 className="fw-bold mb-0 text-dark">Hóa Đơn Tại Quầy</h5>
                  </div>
                  {posCart.length > 0 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleClearCart}
                      className="rounded-pill px-2.5 py-0.5 border-0 small"
                      title="Xóa giỏ đơn này"
                    >
                      <i className="bi bi-trash me-1"></i>Hủy đơn
                    </Button>
                  )}
                </div>

                {/* Danh sách các ly đã chọn */}
                <div
                  className="flex-grow-1 overflow-y-auto mb-3 pe-1"
                  style={{ maxHeight: '280px', minHeight: '180px' }}
                >
                  {posCart.length === 0 ? (
                    <div className="text-center py-5 text-muted my-auto">
                      <i className="bi bi-cart-x fs-2 d-block mb-1 text-secondary"></i>
                      <span className="small">Chưa có món nào được chọn.</span>
                      <p className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                        Nhấp vào trà sữa ở cột bên trái để thêm vào đơn.
                      </p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {posCart.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="p-2 rounded-3 bg-light border d-flex gap-2 align-items-center position-relative"
                        >
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <span className="fw-bold text-dark small text-truncate" style={{ maxWidth: '170px' }}>
                                {item.name}
                              </span>
                              <span className="fw-bold text-danger small">
                                {formatPrice(item.totalPrice)}
                              </span>
                            </div>

                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                              <span className="badge bg-warning bg-opacity-25 text-dark me-1">
                                {item.size}
                              </span>
                              <span>Đường: {item.sugar} • Đá: {item.ice}</span>
                            </div>

                            {item.toppings && item.toppings.length > 0 && (
                              <div className="text-muted text-truncate" style={{ fontSize: '0.7rem' }}>
                                + {Array.isArray(item.toppings) ? item.toppings.join(', ') : item.toppings}
                              </div>
                            )}

                            {/* Tăng giảm số lượng */}
                            <div className="d-flex align-items-center gap-1.5 mt-1.5">
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{ width: '22px', height: '22px', fontSize: '0.75rem' }}
                                onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="small fw-bold px-1.5">{item.quantity}</span>
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{ width: '22px', height: '22px', fontSize: '0.75rem' }}
                                onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              >
                                +
                              </button>
                              <button
                                className="btn btn-sm btn-link text-danger p-0 ms-auto text-decoration-none"
                                onClick={() => handleRemoveItem(item.cartItemId)}
                                title="Xóa món này"
                              >
                                <i className="bi bi-x-circle"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form thông tin khách & Thanh toán */}
                <div className="border-top pt-2 mt-auto small">
                  {/* Loại đơn: Dùng tại quán / Mang về */}
                  <div className="d-flex gap-2 mb-2">
                    <Button
                      size="sm"
                      variant={orderType === 'DINE_IN' ? 'warning' : 'outline-secondary'}
                      className={`flex-grow-1 rounded-pill py-1 fw-bold ${orderType === 'DINE_IN' ? 'text-dark shadow-sm' : ''}`}
                      onClick={() => setOrderType('DINE_IN')}
                    >
                      <i className="bi bi-cup-hot me-1"></i>Dùng tại quán
                    </Button>
                    <Button
                      size="sm"
                      variant={orderType === 'TAKE_AWAY' ? 'warning' : 'outline-secondary'}
                      className={`flex-grow-1 rounded-pill py-1 fw-bold ${orderType === 'TAKE_AWAY' ? 'text-dark shadow-sm' : ''}`}
                      onClick={() => setOrderType('TAKE_AWAY')}
                    >
                      <i className="bi bi-bag-check me-1"></i>Mang về
                    </Button>
                  </div>

                  {/* Tên khách & SĐT */}
                  <Row className="g-1.5 mb-2">
                    <Col xs={7}>
                      <Form.Control
                        size="sm"
                        placeholder="Tên khách hàng"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="rounded-3"
                      />
                    </Col>
                    <Col xs={5}>
                      <Form.Control
                        size="sm"
                        placeholder="Số ĐT (tùy chọn)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="rounded-3"
                      />
                    </Col>
                  </Row>

                  {/* Phương thức thanh toán */}
                  <div className="d-flex gap-2 mb-2">
                    <Button
                      size="sm"
                      variant={paymentMethod === 'COD' ? 'dark' : 'outline-secondary'}
                      className="flex-grow-1 rounded-3 py-1 fw-semibold"
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <i className="bi bi-cash-stack me-1"></i>Tiền Mặt
                    </Button>
                    <Button
                      size="sm"
                      variant={paymentMethod === 'VNPAY' ? 'primary' : 'outline-secondary'}
                      className="flex-grow-1 rounded-3 py-1 fw-semibold"
                      onClick={() => setPaymentMethod('VNPAY')}
                    >
                      <i className="bi bi-qr-code me-1"></i>Quét VNPay
                    </Button>
                  </div>

                  {/* Nhập tiền khách đưa nếu thanh toán tiền mặt */}
                  {paymentMethod === 'COD' && (
                    <div className="bg-light p-2 rounded-3 border mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Tiền khách đưa:</span>
                        <Form.Control
                          size="sm"
                          type="number"
                          placeholder={String(totalAmount)}
                          value={cashGiven}
                          onChange={(e) => setCashGiven(e.target.value)}
                          className="rounded-3 text-end py-0 px-2 fw-bold"
                          style={{ width: '130px', height: '28px' }}
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.75rem' }}>
                        <span className="text-muted">Tiền thối lại:</span>
                        <strong className="text-success">{formatPrice(changeAmount)}</strong>
                      </div>
                    </div>
                  )}

                  {/* Tổng kết chi phí đơn */}
                  <div className="d-flex justify-content-between text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                    <span>Tổng số lượng:</span>
                    <strong className="text-dark">{totalQuantity} món</strong>
                  </div>
                  <div className="d-flex justify-content-between text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                    <span>Phí dịch vụ / Ship:</span>
                    <strong className="text-success">0 đ (Tại quầy)</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top mb-3">
                    <span className="fw-bold text-dark fs-6">Thành Tiền:</span>
                    <span className="fw-black text-danger fs-4">{formatPrice(totalAmount)}</span>
                  </div>

                  {/* Nút Chốt đơn */}
                  <Button
                    variant="warning"
                    size="lg"
                    className="w-100 rounded-pill py-2.5 fw-bold text-dark shadow-sm d-flex align-items-center justify-content-center gap-2"
                    disabled={posCart.length === 0 || submittingOrder}
                    onClick={handleCheckoutAtCounter}
                  >
                    {submittingOrder ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        <span>Đang tạo đơn...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-printer-fill fs-5"></i>
                        <span>THANH TOÁN & IN HÓA ĐƠN</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal Tùy chỉnh topping khi chọn món */}
      <ProductDetailModal
        show={Boolean(customizingProduct)}
        product={customizingProduct}
        onHide={() => setCustomizingProduct(null)}
        onAddToCart={handleAddToCartFromModal}
      />

      {/* Modal Hóa đơn bán lẻ tại quầy (Receipt) */}
      <Modal
        show={showReceiptModal}
        onHide={() => setShowReceiptModal(false)}
        centered
        className="receipt-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-5 text-dark d-flex align-items-center gap-2">
            <i className="bi bi-receipt text-warning"></i>
            <span>Hóa Đơn Bán Lẻ (Quầy)</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" id="printable-receipt">
          {completedOrder && (
            <div className="p-3 bg-light rounded-4 border font-monospace text-dark" style={{ fontSize: '0.85rem' }}>
              {/* Tiêu đề tiệm */}
              <div className="text-center pb-2 border-bottom border-dark border-dashed mb-3">
                <h5 className="fw-bold mb-0 text-dark">SHOP MILK TEA</h5>
                <small className="text-muted d-block">Trà Sữa Đậm Vị Chuẩn Gu</small>
                <small className="text-muted d-block">Hotline: 1900 6868</small>
              </div>

              {/* Thông tin đơn */}
              <div className="d-flex justify-content-between mb-1">
                <span>Mã đơn:</span>
                <strong>#{completedOrder.orderCode}</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Thời gian:</span>
                <span>{new Date().toLocaleString('vi-VN')}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Thu ngân:</span>
                <span>{completedOrder.cashier}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Khách hàng:</span>
                <span>{completedOrder.customerName}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Loại đơn:</span>
                <span className="badge bg-warning text-dark">
                  {completedOrder.orderType === 'TAKE_AWAY' ? 'Mang về' : 'Dùng tại quán'}
                </span>
              </div>

              {/* Bảng danh sách món */}
              <div className="border-top border-bottom border-dark border-dashed py-2 mb-2">
                <div className="d-flex justify-content-between fw-bold pb-1 text-muted" style={{ fontSize: '0.78rem' }}>
                  <span>Tên món</span>
                  <span>SL x Giá = Tiền</span>
                </div>
                {completedOrder.items?.map((it, idx) => (
                  <div key={idx} className="mb-1.5">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">{it.name} ({it.size})</span>
                      <span>{formatPrice(it.totalPrice)}</span>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {it.quantity} x {formatPrice(it.unitPrice)}
                      {it.toppings && it.toppings.length > 0 && ` | +${Array.isArray(it.toppings) ? it.toppings.join(', ') : it.toppings}`}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tổng kết tiền */}
              <div className="d-flex justify-content-between mb-1">
                <span>Tạm tính tiền món:</span>
                <span>{formatPrice(completedOrder.subtotal || completedOrder.totalAmount)}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Phí dịch vụ / Ship:</span>
                <span className="text-success">0 đ</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-6 py-1 border-top border-dark border-dashed mt-2">
                <span>TỔNG CỘNG:</span>
                <span className="text-danger">{formatPrice(completedOrder.totalAmount)}</span>
              </div>

              {completedOrder.paymentMethod === 'COD' ? (
                <>
                  <div className="d-flex justify-content-between text-muted mt-1">
                    <span>Tiền khách đưa:</span>
                    <span>{formatPrice(completedOrder.cashGiven)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-muted">
                    <span>Tiền thối lại:</span>
                    <strong className="text-success">{formatPrice(completedOrder.changeAmount)}</strong>
                  </div>
                </>
              ) : (
                <div className="d-flex justify-content-between text-muted mt-1">
                  <span>Hình thức:</span>
                  <span className="badge bg-primary">VNPay QR / Chuyển khoản</span>
                </div>
              )}

              <div className="text-center pt-3 border-top border-dark border-dashed mt-3">
                <p className="mb-0 fw-semibold">Cảm ơn Quý khách & Hẹn gặp lại!</p>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Wi-Fi: ShopMilkTea | Pass: 88888888</small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" className="rounded-pill px-3" onClick={() => setShowReceiptModal(false)}>
            Đóng
          </Button>
          <Button variant="warning" className="rounded-pill px-4 fw-bold text-dark d-flex align-items-center gap-1.5" onClick={handlePrintReceipt}>
            <i className="bi bi-printer"></i>
            <span>In Phiếu (Ctrl+P)</span>
          </Button>
          {completedOrder?.paymentMethod === 'VNPAY' && completedOrder?.orderCode && (
            <Button
              variant="primary"
              className="rounded-pill px-3 fw-bold"
              onClick={() => navigate(`/payment/${completedOrder.orderCode}`)}
            >
              <i className="bi bi-qr-code me-1"></i>Xem Mã QR VNPay
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Style chuyên biệt cho máy in bill nhiệt POS (Print Receipt) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 320px !important;
            margin: 0 auto !important;
            padding: 10px !important;
            background: #ffffff !important;
            border: none !important;
            font-size: 11pt !important;
          }
          .modal-backdrop, .modal-header, .modal-footer {
            display: none !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}

export default StaffPosPage;

