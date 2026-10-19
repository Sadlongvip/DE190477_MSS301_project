package com.dework.orderservice.service;

import com.dework.orderservice.dto.cart.AddToCartRequest;
import com.dework.orderservice.dto.cart.CartResponse;
import com.dework.orderservice.model.Cart;
import com.dework.orderservice.model.CartItem;
import com.dework.orderservice.repository.CartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private CartService cartService;

    private AddToCartRequest addRequest;

    @BeforeEach
    void setUp() {
        addRequest = AddToCartRequest.builder()
                .milkTeaId(1L)
                .milkTeaName("Trà Sữa Matcha")
                .size("M")
                .sugar("50%")
                .ice("70%")
                .quantity(1)
                .unitPrice(30000.0)
                .build();
    }

    @Test
    @DisplayName("Thêm món mới vào giỏ hàng thành công")
    void addToCart_NewItem_Success() {
        Cart cart = Cart.builder()
                .id(1L)
                .userId(5L)
                .items(new ArrayList<>())
                .build();

        when(cartRepository.findByUserId(5L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenAnswer(i -> i.getArgument(0));

        CartResponse res = cartService.addToCart(addRequest, 5L);

        assertNotNull(res);
        assertEquals(1, res.getItems().size());
        assertEquals(1, res.getTotalQuantity());
        assertEquals(30000.0, res.getTotalPrice());
    }

    @Test
    @DisplayName("Thêm món đã có trong giỏ hàng sẽ cộng dồn số lượng")
    void addToCart_ExistingItem_MergesQuantity() {
        CartItem existing = CartItem.builder()
                .milkTeaId(1L)
                .milkTeaName("Trà Sữa Matcha")
                .size("M")
                .sugar("50%")
                .ice("70%")
                .quantity(2)
                .unitPrice(30000.0)
                .totalPrice(60000.0)
                .build();

        ArrayList<CartItem> items = new ArrayList<>();
        items.add(existing);

        Cart cart = Cart.builder()
                .id(1L)
                .userId(5L)
                .items(items)
                .build();

        when(cartRepository.findByUserId(5L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenAnswer(i -> i.getArgument(0));

        CartResponse res = cartService.addToCart(addRequest, 5L);

        assertNotNull(res);
        assertEquals(1, res.getItems().size());
        assertEquals(3, res.getTotalQuantity());
        assertEquals(90000.0, res.getTotalPrice());
    }

    @Test
    @DisplayName("Xóa toàn bộ giỏ hàng thành công")
    void clearCart_Success() {
        CartItem existing = CartItem.builder().milkTeaId(1L).unitPrice(30000.0).quantity(1).totalPrice(30000.0).build();
        ArrayList<CartItem> items = new ArrayList<>();
        items.add(existing);

        Cart cart = Cart.builder().id(1L).userId(5L).items(items).build();

        when(cartRepository.findByUserId(5L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenAnswer(i -> i.getArgument(0));

        cartService.clearCart(5L, null);

        assertEquals(0, cart.getItems().size());
        assertEquals(0, cart.getTotalQuantity());
        assertEquals(0.0, cart.getTotalPrice());
        verify(cartRepository).save(cart);
    }
}
