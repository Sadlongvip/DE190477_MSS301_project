# Shop_MilkTea — Hệ thống Đặt hàng Trà sữa trực tuyến

> **Đồ án môn học:** MSS301 — Kiến trúc Hướng Dịch vụ — **Sinh viên:** Nguyễn Thành Long — MSSV: DE190477 — Đại học FPT

## Chạy hệ thống bằng Docker Compose

**Yêu cầu:** chỉ cần cài [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
cd Shop_MilkTea_Service
docker compose up -d --build
```

Lệnh trên sẽ tự build và khởi động toàn bộ hệ thống:

- MySQL 8.4 — port `3306`
- Apache Kafka 3.8 (KRaft) — port `9092`
- API Gateway — port `9000`
- 5 microservices (`customer`, `inventory`, `order`, `payment`, `report`) — port `8081` → `8085`
- Frontend React (qua nginx) — port `5173`

Lần đầu build image từng service nên sẽ lâu. Chờ gateway `9000` lên rồi truy cập:

| Trang | URL |
| :--- | :--- |
| 🏠 Trang chủ khách hàng | http://localhost:5173 |
| 📊 Admin — Dashboard | http://localhost:5173/admin/dashboard |

Tài khoản thử nghiệm: `admin_db` / `password123` (ADMIN), `customer1` / `password123` (CUSTOMER).

**Dừng hệ thống:**

```bash
docker compose down        # Dừng container
docker compose down -v     # Dừng + xóa dữ liệu MySQL (reset về đầu)
```
