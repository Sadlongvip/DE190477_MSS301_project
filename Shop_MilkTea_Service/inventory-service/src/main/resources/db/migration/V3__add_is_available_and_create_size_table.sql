-- Migration V3: Bổ sung is_available cho milk_tea, topping và tạo bảng tea_size

ALTER TABLE milk_tea ADD COLUMN is_available BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE topping ADD COLUMN is_available BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS tea_size (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    extra_price DOUBLE NOT NULL DEFAULT 0.0,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO tea_size (id, name, code, extra_price, is_default, is_available) VALUES
    (1, 'Size M (Tiêu chuẩn)', 'M', 0, TRUE, TRUE),
    (2, 'Size L (Cỡ lớn)', 'L', 6000, FALSE, TRUE),
    (3, 'Size XL (Khổng lồ 1L)', 'XL', 12000, FALSE, TRUE);
