import { useState, Suspense, lazy } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { MainLayout } from '../layout';
import HeroSection from '../component/landing/HeroSection';
import FeaturedMenu from '../component/landing/FeaturedMenu';
import LazySuspense from '../component/common/LazySuspense';
import useCart from '../hook/useCart';

// Nạp lười (Lazy Loading & Code Splitting) các section dưới màn hình đầu (below-the-fold)
const WhyChooseUs = lazy(() => import('../component/landing/WhyChooseUs'));
const Testimonials = lazy(() => import('../component/landing/Testimonials'));
const FAQSection = lazy(() => import('../component/landing/FAQSection'));

// Nạp lười các Modal / Drawer (chỉ tải khi người dùng mở lần đầu)
const ProductDetailModal = lazy(() => import('../component/landing/ProductDetailModal'));
const CartDrawer = lazy(() => import('../component/cart/CartDrawer'));
const LoginModal = lazy(() => import('../component/auth/LoginModal'));

/**
 * Trang Landing Page chính của Shop_MilkTea
 * Sử dụng MainLayout bao gồm Header và Footer
 */
export function LandingPage() {
  const {
    cartItems,
    totalQuantity,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Mở modal Auth với tab chỉ định
  const handleOpenAuth = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  // Thêm sản phẩm vào giỏ
  const handleAddToCart = (item) => {
    addToCart(item);
    setToastMessage(`Đã thêm "${item.name}" vào giỏ hàng!`);
    setShowToast(true);
  };

  return (
    <MainLayout
      cartCount={totalQuantity}
      onOpenCart={() => setIsCartOpen(true)}
      onOpenAuth={handleOpenAuth}
    >

      {/* 1. Hero Section */}
      <HeroSection onOpenCart={() => setIsCartOpen(true)} />


      {/* 3. Menu Món Nổi Bật */}
      <FeaturedMenu
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* 4. Giá Trị Thương Hiệu (Why Choose Us) - Nạp lười */}
      <Suspense fallback={null}>
        <WhyChooseUs />
      </Suspense>

      {/* 5. Đánh Giá Khách Hàng (Testimonials) - Nạp lười */}
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      {/* 6. Câu Hỏi Thường Gặp & Newsletter - Nạp lười */}
      <Suspense fallback={null}>
        <FAQSection />
      </Suspense>

      {/* Modal Tùy Chỉnh Chi Tiết Đồ Uống - Nạp lười khi mở lần đầu */}
      <LazySuspense show={Boolean(selectedProduct)}>
        <ProductDetailModal
          show={Boolean(selectedProduct)}
          product={selectedProduct}
          onHide={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      </LazySuspense>

      {/* Drawer Giỏ Hàng Offcanvas - Nạp lười khi mở lần đầu */}
      <LazySuspense show={isCartOpen}>
        <CartDrawer
          show={isCartOpen}
          onHide={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
        />
      </LazySuspense>


      {/* Modal Đăng Nhập / Đăng Ký - Nạp lười khi mở lần đầu */}
      <LazySuspense show={isAuthOpen}>
        <LoginModal
          show={isAuthOpen}
          initialTab={authTab}
          onHide={() => setIsAuthOpen(false)}
        />
      </LazySuspense>

      {/* Toast Thông Báo Khi Thêm Món Thành Công */}
      <ToastContainer position="bottom-end" className="p-3 position-fixed" style={{ zIndex: 2000 }}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2500}
          autohide
          className="shadow-lg rounded-4 border-0 bg-white"
        >
          <Toast.Header className="border-0 bg-warning-subtle text-dark rounded-top-4">
            <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
            <strong className="me-auto">Shop_MilkTea</strong>
            <small>Vừa xong</small>
          </Toast.Header>
          <Toast.Body className="small fw-semibold text-secondary">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </MainLayout>
  );
}

export default LandingPage;
