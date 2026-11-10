package com.dework.orderservice.config;

import feign.Retryer;

/**
 * Retryer cho Feign client (Spring Cloud OpenFeign mặc định là NEVER_RETRY - không retry).
 * Cấu hình: tối đa 2 lần thử (1 lần retry), chờ 500ms rồi backoff nhân đôi, tối đa 2s.
 * Chỉ retry lỗi tạm thời: mất kết nối / timeout / 503 từ service đích.
 * Lỗi 4xx nghiệp vụ (sai ID, sai dữ liệu...) KHÔNG được retry.
 */
public class FeignRetryer extends Retryer.Default {

    public FeignRetryer() {
        super(500, 2000, 2);
    }
}
