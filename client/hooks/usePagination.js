import { useState } from "react";
import useLoadingStore from "../store/useLoadingStore";

const usePagination = () => {
  const [products, setProducts] = useState([]);
  const { isLoading, setLoading } = useLoadingStore();
  const [limit, setLimit] = useState(30); // Start with 30 products
  const [skip, setSkip] = useState(0); // Start with 0
  const [sort, setSort] = useState("updatedAt");
  const [order, setOrder] = useState("desc");

  const fetchProducts = async () => {
    if (isLoading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/products?limit=${limit}&skip=${skip}&sort=${sort}&order=${order}`,
      );
      const newProducts = await response.json();

      setProducts((prev) => {
        return [...prev, ...newProducts];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onEndReached = async () => {
    setLimit(10); // Load 10 more products
    setSkip((prev) => prev + limit);
    await fetchProducts();
  };

  const sortOption = (sort) => {
    setSort(sort);
  };

  const orderOption = (order) => {
    setOrder(order);
  };

  return {
    products,
    isLoading,
    sortOption,
    orderOption,
    fetchProducts,
    onEndReached,
  };
};

export default usePagination;
