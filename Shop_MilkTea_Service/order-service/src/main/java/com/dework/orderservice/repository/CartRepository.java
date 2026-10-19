package com.dework.orderservice.repository;

import com.dework.orderservice.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUserId(Long userId);

    Optional<Cart> findBySessionId(String sessionId);

    void deleteByUserId(Long userId);

    void deleteBySessionId(String sessionId);

    boolean existsByUserId(Long userId);
}
