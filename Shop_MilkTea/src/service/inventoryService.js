import axiosClient from '../config/axiosClient';

/**
 * Service giao tiếp với inventory-service thông qua API Gateway
 * Endpoints: /api/categories, /api/milkteas, /api/toppings
 */
const inventoryService = {
  /* ================= CATEGORIES ================= */
  /**
   * Lấy danh sách danh mục trà sữa (hỗ trợ tìm kiếm theo từ khóa)
   * @param {string} [keyword]
   * @returns {Promise<Array<{ id: number, name: string, milkTeaCount: number }>>}
   */
  getCategories: (keyword) => {
    return axiosClient.get('/api/categories', {
      params: keyword ? { keyword } : {},
    });
  },

  /**
   * Lấy chi tiết danh mục theo ID
   * @param {number|string} id
   */
  getCategoryById: (id) => {
    return axiosClient.get(`/api/categories/${id}`);
  },

  /* ================= MILK TEAS ================= */
  /**
   * Lấy danh sách sản phẩm trà sữa (hỗ trợ lọc theo categoryId và tìm kiếm keyword)
   * @param {{ keyword?: string, categoryId?: number|string }} [params]
   * @returns {Promise<Array<{ id: number, name: string, description: string, price: number, image: string, categoryId: number, categoryName: string }>>}
   */
  getMilkTeas: (params = {}) => {
    const query = {};
    if (params.keyword && params.keyword.trim()) {
      query.keyword = params.keyword.trim();
    }
    if (params.categoryId) {
      query.categoryId = params.categoryId;
    }
    return axiosClient.get('/api/milkteas', { params: query });
  },

  /**
   * Lấy chi tiết sản phẩm trà sữa theo ID
   * @param {number|string} id
   */
  getMilkTeaById: (id) => {
    return axiosClient.get(`/api/milkteas/${id}`);
  },

  /* ================= TOPPINGS ================= */
  /**
   * Lấy danh sách topping
   * @param {string} [keyword]
   * @returns {Promise<Array<{ id: number, name: string, price: number }>>}
   */
  getToppings: (keyword) => {
    return axiosClient.get('/api/toppings', {
      params: keyword ? { keyword } : {},
    });
  },

  /**
   * Lấy chi tiết topping theo ID
   * @param {number|string} id
   */
  getToppingById: (id) => {
    return axiosClient.get(`/api/toppings/${id}`);
  },
};

export default inventoryService;
