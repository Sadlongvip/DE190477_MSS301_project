package com.dework.orderservice.repository;

import com.dework.orderservice.model.Order;
import com.dework.orderservice.model.OrderStatus;
import com.dework.orderservice.model.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCode(String orderCode);

    boolean existsByOrderCode(String orderCode);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus) AND " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(o.orderCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(o.customerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " o.phoneNumber LIKE CONCAT('%', :keyword, '%')) " +
           "ORDER BY o.createdAt DESC")
    Page<Order> searchOrders(
            @Param("status") OrderStatus status,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
