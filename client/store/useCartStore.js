// cartItemsStore.js
import { create } from 'zustand';

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
    // if (!product.id) {
    //   console.error("Product is missing an id:", product);
    //   return; // Skip adding products without an id
    // }
    // const { cartItems, totalPrice } = get();
    // const updatedCart = [...cartItems, product];
    // const newTotalPrice = totalPrice + product.price;

    // set({
    //   cartItems: updatedCart,
    //   totalPrice: newTotalPrice,
    // });

    set((state) => {
      // Add product to cartItems or update quantity if it already exists
      const existingProduct = state.cartItems.find((item) => item._id === product._id);
      let updatedCartItems;

      if (existingProduct) {
        updatedCartItems = state.cartItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCartItems = [...state.cartItems, { ...product, quantity: 1 }];
      }

      // Calculate the new total price
      const newTotalPrice = updatedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      saveCartToDB(get().userId, updatedCartItems, newTotalPrice);

      return { cartItems: updatedCartItems, totalPrice: newTotalPrice };
    });
    // Lưu giỏ hàng vào cơ sở dữ liệu hoặc localStorage
  },
  increaseProductQuantity: (productId) => {
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );

      const newTotalPrice = updatedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { cartItems: updatedCartItems, totalPrice: newTotalPrice };
    });
  },

  decreaseProductQuantity: (productId) => {
    set((state) => {
      const updatedCartItems = state.cartItems
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0); // Remove items with quantity 0

      const newTotalPrice = updatedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { cartItems: updatedCartItems, totalPrice: newTotalPrice };
    });
  },



  removeProduct: (productId) => {
    // const { cartItems, totalPrice } = get();
    // const updatedCart = cartItems.filter((item) => item.id !== productId);
    // const newTotalPrice = cartItems.reduce((total, item) => (item.id !== productId ? total + item.price : total), 0);

    // set({
    //   cartItems: updatedCart,
    //   totalPrice: newTotalPrice,
    // });
    set((state) => {
      // Remove product or decrease quantity
      const updatedCartItems = state.cartItems
        .map((item) => (item._id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0);

      // Calculate the new total price
      const newTotalPrice = updatedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      saveCartToDB(get().userId, updatedCartItems, newTotalPrice);

      return { cartItems: updatedCartItems, totalPrice: newTotalPrice };
    });
    // Lưu giỏ hàng cập nhật vào cơ sở dữ liệu
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

