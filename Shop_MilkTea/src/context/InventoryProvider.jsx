import { useReducer, useCallback, useEffect } from 'react';
import { InventoryContext } from './InventoryContext';
import {
  inventoryReducer,
  initialInventoryState,
  INVENTORY_ACTION_TYPES,
} from '../reduce/inventoryReducer';
import inventoryService from '../service/inventoryService';

/**
 * InventoryProvider - Nơi DUY NHẤT gọi API từ inventoryService
 * và điều phối state qua inventoryReducer.
 * Các component tuyệt đối không gọi trực tiếp service.
 */
export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialInventoryState);

  /**
   * Tải danh sách Danh mục
   */
  const fetchCategories = useCallback(async (keyword) => {
    dispatch({ type: INVENTORY_ACTION_TYPES.INVENTORY_START });
    try {
      const data = await inventoryService.getCategories(keyword);
      dispatch({
        type: INVENTORY_ACTION_TYPES.SET_CATEGORIES,
        payload: data || [],
      });
      return { success: true, data };
    } catch (err) {
      const msg = err.message || 'Không thể tải danh sách danh mục';
      dispatch({
        type: INVENTORY_ACTION_TYPES.INVENTORY_FAILURE,
        payload: msg,
      });
      return { success: false, error: msg };
    }
  }, []);

  /**
   * Tải danh sách Trà sữa theo bộ lọc (keyword, categoryId)
   */
  const fetchMilkTeas = useCallback(async (params = {}) => {
    dispatch({ type: INVENTORY_ACTION_TYPES.INVENTORY_START });
    try {
      const data = await inventoryService.getMilkTeas(params);
      dispatch({
        type: INVENTORY_ACTION_TYPES.SET_MILK_TEAS,
        payload: data || [],
      });
      return { success: true, data };
    } catch (err) {
      const msg = err.message || 'Không thể tải danh sách sản phẩm';
      dispatch({
        type: INVENTORY_ACTION_TYPES.INVENTORY_FAILURE,
        payload: msg,
      });
      return { success: false, error: msg };
    }
  }, []);

  /**
   * Tải danh sách Topping
   */
  const fetchToppings = useCallback(async (keyword) => {
    try {
      const data = await inventoryService.getToppings(keyword);
      dispatch({
        type: INVENTORY_ACTION_TYPES.SET_TOPPINGS,
        payload: data || [],
      });
      return { success: true, data };
    } catch (err) {
      const msg = err.message || 'Không thể tải danh sách topping';
      dispatch({
        type: INVENTORY_ACTION_TYPES.INVENTORY_FAILURE,
        payload: msg,
      });
      return { success: false, error: msg };
    }
  }, []);

  /**
   * Lọc sản phẩm theo Category (kết hợp với từ khóa hiện tại)
   */
  const filterByCategory = useCallback(
    (categoryId) => {
      dispatch({
        type: INVENTORY_ACTION_TYPES.SET_SELECTED_CATEGORY,
        payload: categoryId,
      });
      fetchMilkTeas({
        categoryId,
        keyword: state.searchKeyword,
      });
    },
    [state.searchKeyword, fetchMilkTeas]
  );

  /**
   * Tìm kiếm sản phẩm theo từ khóa (kết hợp với category đang chọn)
   */
  const searchProducts = useCallback(
    (keyword) => {
      dispatch({
        type: INVENTORY_ACTION_TYPES.SET_SEARCH_KEYWORD,
        payload: keyword,
      });
      fetchMilkTeas({
        keyword,
        categoryId: state.selectedCategoryId,
      });
    },
    [state.selectedCategoryId, fetchMilkTeas]
  );

  /**
   * Xóa thông báo lỗi
   */
  const clearError = useCallback(() => {
    dispatch({ type: INVENTORY_ACTION_TYPES.CLEAR_ERROR });
  }, []);

  // Tải dữ liệu ban đầu khi Provider mount
  useEffect(() => {
    fetchCategories();
    fetchMilkTeas();
    fetchToppings();
  }, [fetchCategories, fetchMilkTeas, fetchToppings]);

  const value = {
    // Trạng thái từ Reducer
    categories: state.categories,
    milkTeas: state.milkTeas,
    toppings: state.toppings,
    selectedCategoryId: state.selectedCategoryId,
    searchKeyword: state.searchKeyword,
    loading: state.loading,
    error: state.error,

    // Các hàm hành động (cổng duy nhất gọi API)
    fetchCategories,
    fetchMilkTeas,
    fetchToppings,
    filterByCategory,
    searchProducts,
    clearError,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export default InventoryProvider;
