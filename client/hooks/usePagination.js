import { useState } from "react";
import useLoadingStore from "../store/useLoadingStore";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const usePagination = () => {
  const { isLoading, setLoading } = useLoadingStore();
  const [sort, setSort] = useState("updated_at");
  const [order, setOrder] = useState("desc");

  const queryClient = useQueryClient();

  const fetchProducts = async ({ pageParam = 0 }) => {
    setLoading(true);
    // console.log("fetching products");

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/products?limit=30&skip=${pageParam}&sort=${sort}&order=${order}`
    );
    setLoading(false);
    if (!response.ok) {
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ server
      throw new Error(errorData.message || "Failed to fetch products"); // Ném lỗi với thông báo từ server
    }
    return await response.json();
  };

  const {
    data,
    error,
    isLoading: queryLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", { sort, order }],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) return undefined;
      return pages.length * 30;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  const products = data ? data.pages.flat() : [];

  const onEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const sortOption = (sort) => {
    setSort(sort);
    queryClient.invalidateQueries("products");
  };

  const orderOption = (order) => {
    setOrder(order);
    queryClient.invalidateQueries("products");
  };

  return {
    products,
    isLoading: queryLoading,
    error,
    fetchProducts,
    sortOption,
    orderOption,
    onEndReached,
  };
};

export default usePagination;
