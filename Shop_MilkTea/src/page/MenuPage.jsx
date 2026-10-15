import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { MainLayout } from '../layout';
import { InventoryContext } from '../context/InventoryContext';
import CartDrawer from '../component/cart/CartDrawer';
import LoginModal from '../component/auth/LoginModal';
import ProductDetailModal from '../component/landing/ProductDetailModal';

// Ảnh fallback chất lượng cao nếu ảnh từ backend không load được
const DEFAULT_TEA_IMAGE = 'https://images.unsplash.com/photo-1558857563-b37cfb8cb468?auto=format&fit=crop&w=600&q=80';

/**
 * Trang Thực Đơn (Menu Page)
 * - Thanh tìm kiếm ở trên cùng
 * - Bố cục chia 30% (Sidebar danh mục) - 70% (Lưới sản phẩm Trà Sữa)
 * - Chỉ giao tiếp API thông qua InventoryContext
 */
export function MenuPage() {
  const {
    categories,
    milkTeas,
    toppings,
    selectedCategoryId,
    loading,
    error,
    filterByCategory,
    searchProducts,
  } = useContext(InventoryContext);

  // State giỏ hàng (đồng bộ với LocalStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('milktea_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // Lưu giỏ hàng vào LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('milktea_cart', JSON.stringify(cartItems));
    } catch {
      // Ignored
    }
  }, [cartItems]);

  // Xử lý tìm kiếm với độ trễ nhẹ (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchProducts]);

  // Thêm vào giỏ hàng
  const handleAddToCart = (item) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.cartItemId === item.cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += item.quantity;
        updated[existingIndex].totalPrice =
          updated[existingIndex].unitPrice * updated[existingIndex].quantity;
        return updated;
      }
      return [...prevItems, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId, newQty) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.cartItemId !== cartItemId));
  };

  // Tổng số lượng món trong giỏ hàng
  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Tên danh mục hiện tại đang chọn
  const currentCategoryName = useMemo(() => {
    if (!selectedCategoryId) return 'Tất Cả Sản Phẩm';
    const found = categories.find((c) => c.id === selectedCategoryId);
    return found ? found.name : 'Danh Mục';
  }, [selectedCategoryId, categories]);

  // Định dạng tiền tệ VND
  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <MainLayout
      cartCount={totalCartCount}
      onOpenCart={() => setIsCartOpen(true)}
      onOpenAuth={(tab) => {
        setAuthTab(tab);
        setIsAuthOpen(true);
      }}
    >
      <div className="menu-page-wrapper py-4" style={{ backgroundColor: '#fafaf9', minHeight: '85vh' }}>
        <Container fluid="xl" className="px-3 px-xl-4">
          {/* 1. Header Banner & Tiêu đề trang */}
          <div className="text-center mb-4">
            <span
              className="badge rounded-pill px-3 py-1.5 fw-bold text-uppercase mb-2"
              style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.75rem', letterSpacing: '0.05em' }}
            >
              <i className="bi bi-cup-straw me-1"></i> Thực Đơn Đặc Sắc
            </span>
            <h1 className="fw-black text-dark mb-1" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>
              Khám Phá Hương Vị Trà Sữa Đậm Gu
            </h1>
            <p className="text-muted small mx-auto" style={{ maxWidth: '600px' }}>
              Lựa chọn trà sữa yêu thích từ những nguyên liệu tươi ngon nhất, kết hợp cùng các loại topping giòn dai béo ngậy.
            </p>
          </div>

          {/* 2. Thanh tìm kiếm (Search Bar) */}
          <div className="search-bar-container mx-auto mb-4" style={{ maxWidth: '680px' }}>
            <div className="input-group shadow-sm rounded-pill overflow-hidden border bg-white p-1">
              <span className="input-group-text bg-transparent border-0 ps-3">
                <i className="bi bi-search text-warning fs-5"></i>
              </span>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm trà sữa theo tên (ví dụ: Trân châu, Oolong, Đào, Matcha...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="border-0 shadow-none px-2 py-2"
                style={{ fontSize: '0.95rem' }}
              />
              {searchInput && (
                <Button
                  variant="link"
                  onClick={() => setSearchInput('')}
                  className="text-muted text-decoration-none pe-3 py-0 d-flex align-items-center"
                  title="Xóa từ khóa"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </Button>
              )}
            </div>
          </div>

          {/* 3. Phân chia bố cục 30% - 70% */}
          <Row className="g-4">
            {/* ================= CỘT TRÁI: SIDEBAR CATEGORY (30%) ================= */}
            <Col xs={12} lg={4} xl={3} className="menu-sidebar-col">
              <div
                className="category-sidebar bg-white rounded-4 p-3 border shadow-sm sticky-top"
                style={{ top: '80px', zIndex: 10 }}
              >
                <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom">
                  <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                    <i className="bi bi-grid-fill text-warning"></i>
                    <span>Danh Mục Trà Sữa</span>
                  </h6>
                  <span className="badge bg-light text-secondary rounded-pill border">
                    {categories.length} loại
                  </span>
                </div>

                {/* Danh sách lọc Category */}
                <div className="d-flex flex-column gap-1.5 category-filter-list">
                  {/* Nút: Tất cả sản phẩm */}
                  <button
                    type="button"
                    onClick={() => filterByCategory(null)}
                    className={`btn text-start d-flex align-items-center justify-content-between py-2 px-3 rounded-3 transition-all ${
                      selectedCategoryId === null
                        ? 'btn-warning text-dark fw-bold shadow-sm'
                        : 'btn-light text-secondary fw-semibold'
                    }`}
                    style={{ fontSize: '0.9rem', border: 'none' }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      <i className="bi bi-stars text-warning"></i>
                      <span>Tất Cả Sản Phẩm</span>
                    </span>
                    <Badge
                      pill
                      bg={selectedCategoryId === null ? 'dark' : 'secondary'}
                      className="px-2"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {milkTeas.length}
                    </Badge>
                  </button>

                  {/* Danh sách từng Category từ API */}
                  {categories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => filterByCategory(cat.id)}
                        className={`btn text-start d-flex align-items-center justify-content-between py-2 px-3 rounded-3 transition-all ${
                          isSelected
                            ? 'btn-warning text-dark fw-bold shadow-sm'
                            : 'btn-light text-secondary fw-semibold'
                        }`}
                        style={{ fontSize: '0.9rem', border: 'none' }}
                      >
                        <span className="d-flex align-items-center gap-2 text-truncate">
                          <i className="bi bi-cup-hot text-amber-600"></i>
                          <span className="text-truncate">{cat.name}</span>
                        </span>
                        {cat.milkTeaCount > 0 && (
                          <Badge
                            pill
                            bg={isSelected ? 'dark' : 'light'}
                            text={isSelected ? 'white' : 'dark'}
                            className="border px-2"
                            style={{ fontSize: '0.7rem' }}
                          >
                            {cat.milkTeaCount}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Phần Topping gợi ý ở sidebar */}
                {toppings && toppings.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-bold mb-2 text-dark small d-flex align-items-center gap-1.5">
                      <i className="bi bi-plus-circle-fill text-success"></i>
                      <span>Topping Hấp Dẫn</span>
                    </h6>
                    <div className="d-flex flex-wrap gap-1.5">
                      {toppings.map((top) => (
                        <span
                          key={top.id}
                          className="badge bg-light text-dark border rounded-pill px-2.5 py-1.5 small fw-normal d-inline-flex align-items-center gap-1"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <span>{top.name}</span>
                          <span className="text-warning fw-semibold">+{formatVND(top.price)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Col>

            {/* ================= CỘT PHẢI: LƯỚI SẢN PHẨM MILKTEA (70%) ================= */}
            <Col xs={12} lg={8} xl={9} className="menu-products-col">
              {/* Header khu vực sản phẩm */}
              <div className="d-flex align-items-center justify-content-between bg-white rounded-4 p-3 border shadow-sm mb-3">
                <div>
                  <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                    <span>{currentCategoryName}</span>
                    {searchInput && (
                      <small className="text-muted fw-normal" style={{ fontSize: '0.85rem' }}>
                        (Kết quả cho: "{searchInput}")
                      </small>
                    )}
                  </h5>
                  <small className="text-muted">
                    Hiển thị <strong>{milkTeas.length}</strong> món trà sữa
                  </small>
                </div>
                {selectedCategoryId && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => filterByCategory(null)}
                    className="rounded-pill px-2.5 py-1 text-nowrap small"
                  >
                    <i className="bi bi-x me-1"></i> Bỏ lọc
                  </Button>
                )}
              </div>

              {/* Thông báo lỗi nếu có */}
              {error && (
                <Alert variant="danger" className="rounded-4 py-2.5 mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Trạng thái Loading */}
              {loading ? (
                <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
                  <Spinner animation="border" variant="warning" className="mb-2" />
                  <p className="text-muted small mb-0">Đang tải món trà sữa thơm ngon...</p>
                </div>
              ) : milkTeas.length === 0 ? (
                /* Trạng thái Empty */
                <div className="text-center py-5 bg-white rounded-4 border shadow-sm px-3">
                  <div className="mb-3">
                    <i className="bi bi-cup-straw text-muted" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h6 className="fw-bold text-dark mb-1">Không tìm thấy món trà sữa nào</h6>
                  <p className="text-muted small mb-3">
                    {searchInput
                      ? `Không có sản phẩm nào khớp với từ khóa "${searchInput}". Vui lòng thử từ khóa khác!`
                      : 'Chưa có sản phẩm nào trong danh mục này.'}
                  </p>
                  <Button
                    variant="warning"
                    size="sm"
                    className="rounded-pill px-3 py-1.5 fw-semibold"
                    onClick={() => {
                      setSearchInput('');
                      filterByCategory(null);
                    }}
                  >
                    Xem tất cả thực đơn
                  </Button>
                </div>
              ) : (
                /* Lưới Card sản phẩm Trà sữa */
                <Row className="row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 g-3">
                  {milkTeas.map((tea) => (
                    <Col key={tea.id}>
                      <Card className="h-100 border-0 rounded-4 shadow-sm overflow-hidden tea-card position-relative transition-all">
                        {/* Ảnh sản phẩm */}
                        <div
                          className="position-relative overflow-hidden"
                          style={{ height: '190px', cursor: 'pointer' }}
                          onClick={() => setSelectedProduct(tea)}
                        >
                          <img
                            src={tea.image || DEFAULT_TEA_IMAGE}
                            alt={tea.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_TEA_IMAGE;
                            }}
                            className="w-100 h-100 object-fit-cover tea-img-hover"
                          />
                          {/* Tag Category */}
                          {tea.categoryName && (
                            <span
                              className="position-absolute top-0 start-0 m-2.5 badge rounded-pill px-2.5 py-1 shadow-sm"
                              style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#92400e', fontSize: '0.72rem' }}
                            >
                              <i className="bi bi-tag-fill me-1 text-warning"></i>
                              {tea.categoryName}
                            </span>
                          )}
                        </div>

                        {/* Nội dung card */}
                        <Card.Body className="p-3 d-flex flex-column justify-content-between">
                          <div>
                            <Card.Title
                              className="fw-bold fs-6 text-dark mb-1 text-truncate"
                              title={tea.name}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setSelectedProduct(tea)}
                            >
                              {tea.name}
                            </Card.Title>
                            <Card.Text
                              className="text-muted small mb-2 line-clamp-2"
                              style={{
                                fontSize: '0.8rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                height: '38px',
                              }}
                            >
                              {tea.description || 'Hương vị trà hảo hạng pha chế cùng sữa tươi thanh trùng chuẩn gu.'}
                            </Card.Text>
                          </div>

                          {/* Giá tiền và nút Thêm giỏ hàng */}
                          <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                            <div>
                              <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>Giá chỉ từ</small>
                              <span className="fw-black text-warning fs-6">
                                {formatVND(tea.price)}
                              </span>
                            </div>

                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => setSelectedProduct(tea)}
                              className="rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1 shadow-sm"
                              style={{ fontSize: '0.8rem' }}
                              title="Tùy chọn topping và đặt món"
                            >
                              <i className="bi bi-bag-plus-fill"></i>
                              <span>Chọn món</span>
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal chi tiết món & Tùy chọn Topping */}
      <ProductDetailModal
        show={Boolean(selectedProduct)}
        product={selectedProduct}
        onHide={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Giỏ hàng dạng Drawer trượt */}
      <CartDrawer
        show={isCartOpen}
        onHide={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          alert('Đơn hàng của bạn đã được tiếp nhận thành công!');
          setCartItems([]);
        }}
      />

      {/* Modal Đăng Nhập / Đăng Ký */}
      <LoginModal
        show={isAuthOpen}
        onHide={() => setIsAuthOpen(false)}
        initialTab={authTab}
      />
    </MainLayout>
  );
}

export default MenuPage;
