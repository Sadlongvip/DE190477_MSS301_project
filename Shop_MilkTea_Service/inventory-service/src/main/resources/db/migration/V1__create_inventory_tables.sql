-- Migration V1: Tạo bảng cho inventory-service (category_tea, milk_tea, topping)
-- Đảm bảo chuẩn charset utf8mb4 cho tiếng Việt có dấu

CREATE TABLE IF NOT EXISTS category_tea (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS milk_tea (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    image VARCHAR(500),
    category_id BIGINT,
    CONSTRAINT fk_milktea_category FOREIGN KEY (category_id) REFERENCES category_tea(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS topping (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
