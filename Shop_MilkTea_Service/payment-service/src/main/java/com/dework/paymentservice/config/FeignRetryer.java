package com.dework.paymentservice.config;

import feign.Retryer;

/**
 * Retryer cho Feign client (Spring Cloud OpenFeign mặc định là NEVER_RETRY - không retry).
 * Cấu hình: tối đa 3 lần thử (2 lần retry), chờ 500ms rồi backoff nhân đôi, tối đa 2s.
 * Callback "cập nhật trạng thái thanh toán" là PUT idempotent nên retry an toàn.
 * Chỉ retry lỗi tạm thời: mất kết nối / timeout / 503 từ service đích.
 */
public class FeignRetryer extends Retryer.Default {

    public FeignRetryer() {
        super(500, 2000, 3);
    }
}
