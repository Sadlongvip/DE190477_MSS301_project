import axiosClient from '../config/axiosClient';

/**
 * Service giao tiếp với report-service thông qua API Gateway
 * Endpoints: /api/reports/*
 */
const reportService = {
  /**
   * Lấy báo cáo tổng hợp dashboard
   */
  getDashboardReport: (params = {}) => {
    return axiosClient.get('/api/reports/dashboard', { params });
  },

  /**
   * Lấy tóm tắt chỉ số KPI
   */
  getSummary: (params = {}) => {
    return axiosClient.get('/api/reports/summary', { params });
  },

  /**
   * Lấy xu hướng doanh thu theo ngày
   */
  getDailyRevenueTrend: (params = {}) => {
    return axiosClient.get('/api/reports/revenue-trend', { params });
  },

  /**
   * Lấy danh sách sản phẩm bán chạy nhất
   */
  getTopSellingProducts: (params = {}) => {
    return axiosClient.get('/api/reports/top-selling', { params });
  },

  /**
   * Lấy phân bố trạng thái đơn hàng
   */
  getOrderStatusDistribution: (params = {}) => {
    return axiosClient.get('/api/reports/order-status', { params });
  },

  /**
   * Lấy thống kê phương thức thanh toán
   */
  getPaymentMethodBreakdown: (params = {}) => {
    return axiosClient.get('/api/reports/payment-methods', { params });
  },
};

export default reportService;
