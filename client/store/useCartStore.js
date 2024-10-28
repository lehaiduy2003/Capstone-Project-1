// cartItemsStore.js
import create from "zustand";

// Store quản lý giỏ hàng
const useCartStore = create((set, get) => ({
  cartItems: [],
  totalPrice: 0,

  // Hàm khởi tạo giỏ hàng khi người dùng đăng nhập
  initializeCart: (userId) => {
    const userCart = loadCartFromDB(userId); // Giả sử bạn lấy từ cơ sở dữ liệu
    set({
      cartItems: userCart.items,
      totalPrice: userCart.totalPrice,
    });
  },

  addProduct: (product) => {
    const { cartItems, totalPrice } = get();
    const updatedCart = [...cartItems, product];
    const newTotalPrice = totalPrice + product.price;

    set({
      cartItems: updatedCart,
      totalPrice: newTotalPrice,
    });

    // Lưu giỏ hàng vào cơ sở dữ liệu hoặc localStorage
    saveCartToDB(get().userId, updatedCart, newTotalPrice);
  },

  removeProduct: (productId) => {
    const { cartItems, totalPrice } = get();
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    const newTotalPrice = cartItems.reduce((total, item) => (item.id !== productId ? total + item.price : total), 0);

    set({
      cartItems: updatedCart,
      totalPrice: newTotalPrice,
    });

    // Lưu giỏ hàng cập nhật vào cơ sở dữ liệu
    saveCartToDB(get().userId, updatedCart, newTotalPrice);
  },
}));

// Hàm mô phỏng lấy giỏ hàng từ cơ sở dữ liệu (hoặc localStorage)
const loadCartFromDB = (userId) => {
  // Giả sử đây là kết quả từ cơ sở dữ liệu dựa trên userId
  return {
    items: [], // Lấy danh sách sản phẩm từ DB
    totalPrice: 0,
  };
};

// Hàm mô phỏng lưu giỏ hàng vào cơ sở dữ liệu
const saveCartToDB = (userId, cartItems, totalPrice) => {
  // Lưu giỏ hàng và tổng giá vào DB với userId tương ứng
};

export default useCartStore;
