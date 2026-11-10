import { useState } from 'react';
import { Suspense } from 'react';

/**
 * LazySuspense - Trình bao nạp lười (Lazy Loading) cho Modal / Drawer / Overlay
 *
 * - Component con cần được khai báo bằng React.lazy() ở trang cha.
 * - Chỉ mount khi `show` được bật lần đầu (tránh nạp bundle ngay khi trang render).
 * - Sau lần mở đầu tiên, component giữ nguyên đã nạp (giữ animation đóng mượt),
 *   chunk JS chỉ được tải đúng một lần duy nhất.
 *
 * Ví dụ:
 *   const CartDrawer = lazy(() => import('../component/cart/CartDrawer'));
 *   ...
 *   <LazySuspense show={isCartOpen}>
 *     <CartDrawer show={isCartOpen} onHide={...} />
 *   </LazySuspense>
 */
export default function LazySuspense({ show, fallback = null, children }) {
  // Cờ đánh dấu đã từng mở (giữ chunk đã tải và animation đóng khi ẩn đi)
  const [hasShown, setHasShown] = useState(show);

  // Điều chỉnh state ngay trong lúc render (pattern chuẩn của React,
  // tránh useEffect + setState gây render dây chuyền)
  if (show && !hasShown) {
    setHasShown(true);
  }

  if (!hasShown) return null;

  return <Suspense fallback={fallback}>{children}</Suspense>;
}
