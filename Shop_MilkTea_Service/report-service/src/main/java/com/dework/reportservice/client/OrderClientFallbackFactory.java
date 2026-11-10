package com.dework.reportservice.client;

import com.dework.reportservice.client.dto.OrderResponseDto;
import com.dework.reportservice.client.dto.PageResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * Fallback khi order-service lỗi hoặc Circuit Breaker ở trạng thái OPEN.
 * Report-service phải "giảm cấp mượt" (dùng dữ liệu cũ trong report_db) chứ không được chết theo order-service.
 */
@Slf4j
@Component
public class OrderClientFallbackFactory implements FallbackFactory<OrderClient> {

    @Override
    public OrderClient create(Throwable cause) {
        log.warn("OrderClient fallback kích hoạt - order-service không phản hồi ({}): {}",
                cause.getClass().getSimpleName(), cause.getMessage());
        return new OrderClient() {

            @Override
            public OrderResponseDto getOrderByCode(String orderCode) {
                // ReportSyncService sẽ tự bỏ qua khi nhận null
                return null;
            }

            @Override
            public PageResponseDto<OrderResponseDto> searchOrders(int page, int size) {
                // Trang rỗng -> vòng lặp đồng bộ kết thúc nhẹ nhàng thay vì ném exception
                return PageResponseDto.<OrderResponseDto>builder()
                        .content(new ArrayList<>())
                        .totalPages(0)
                        .totalElements(0)
                        .size(size)
                        .number(page)
                        .build();
            }
        };
    }
}
