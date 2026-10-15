import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { MainLayout } from '../layout';
import HeroSection from '../component/landing/HeroSection';
import PromoBanner from '../component/landing/PromoBanner';
import FeaturedMenu from '../component/landing/FeaturedMenu';
import WhyChooseUs from '../component/landing/WhyChooseUs';
import Testimonials from '../component/landing/Testimonials';
import FAQSection from '../component/landing/FAQSection';
import ProductDetailModal from '../component/landing/ProductDetailModal';
import CartDrawer from '../component/cart/CartDrawer';
import LoginModal from '../component/auth/LoginModal';

/**
 * Trang Landing Page chính của Shop_MilkTea
 * Sử dụng MainLayout đã tách riêng TopHeader, Header và Footer
 */
export function LandingPage() {
  // Quản lý giỏ hàng với LocalStorage
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
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Mở modal Auth với tab chỉ định
  const handleOpenAuth = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  // Đồng bộ giỏ hàng với localStorage
  useEffect(() => {
    try {
      localStorage.setItem('milktea_cart', JSON.stringify(cartItems));
    } catch {
      // Ignored
    }
  }, [cartItems]);

  // Thêm sản phẩm vào giỏ
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

    setToastMessage(`Đã thêm "${item.name}" vào giỏ hàng!`);
    setShowToast(true);
  };

  // Cập nhật số lượng
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

  // Xóa sản phẩm khỏi giỏ
  const handleRemoveItem = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  // Xóa sạch giỏ hàng
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Tổng số lượng cốc trong giỏ
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MainLayout
      cartCount={totalCartCount}
      onOpenCart={() => setIsCartOpen(true)}
      onOpenAuth={handleOpenAuth}
    >
      {/* 1. Hero Section */}
      <HeroSection onOpenCart={() => setIsCartOpen(true)} />

      {/* 2. Voucher & Khuyến Mãi */}
      <PromoBanner onOpenCart={() => setIsCartOpen(true)} />

      {/* 3. Menu Món Nổi Bật */}
      <FeaturedMenu
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* 4. Giá Trị Thương Hiệu (Why Choose Us) */}
      <WhyChooseUs />

      {/* 5. Đánh Giá Khách Hàng (Testimonials) */}
      <Testimonials />

      {/* 6. Câu Hỏi Thường Gặp & Newsletter */}
      <FAQSection />

      {/* Modal Tùy Chỉnh Chi Tiết Đồ Uống */}
      <ProductDetailModal
        show={Boolean(selectedProduct)}
        product={selectedProduct}
        onHide={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Drawer Giỏ Hàng Offcanvas */}
      <CartDrawer
        show={isCartOpen}
        onHide={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Modal Đăng Nhập / Đăng Ký */}
      <LoginModal
        show={isAuthOpen}
        initialTab={authTab}
        onHide={() => setIsAuthOpen(false)}
      />

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
