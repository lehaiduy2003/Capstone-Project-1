import { useState } from "react";
import useLoadingStore from "../store/useLoadingStore";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getValueFor } from "../utils/secureStore";
const usePagination = (searchType, isSearching = false, searchQuery = null, type = null) => {
  const { isLoading, setLoading } = useLoadingStore();
  const [sort, setSort] = useState("updated_at");
  const [order, setOrder] = useState("desc");
  const queryClient = useQueryClient();

  const fetchProducts = async ({ pageParam = 0 }) => {
    setLoading(true);
    console.log("fetching products", searchType, type, searchQuery, isSearching);

    let url = `${process.env.EXPO_PUBLIC_API_URL}/${searchType}`;
    if (isSearching) {
      if (!searchQuery && !type) {
        throw new Error("Query or type is required for searching");
      }
      url += `/search?limit=30&skip=${pageParam}&sort=${sort}&order=${order}`;
    } else url += `?limit=30&skip=${pageParam}&sort=${sort}&order=${order}`;
    if (searchQuery) {
      url += `&query=${searchQuery}`;
    }
    if (type) {
      url += `&type=${type}`;
    }

    console.log("url", url);

    const response = await fetch(url);

    setLoading(false);
    if (!response.ok) {
      const errorData = await response.json(); // Lấy dữ liệu lỗi từ server
      throw new Error(errorData.message || "Failed to fetch data"); // Ném lỗi với thông báo từ server
    }
    const data = await response.json(); // Lấy dữ liệu từ server
    return data;
  };

  const {
    data,
    error,
    isLoading: queryLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [searchType, sort, order, searchQuery, type],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) return undefined;
      return pages.length * 30;
    },
    staleTime: 1 * 60 * 1000, // 1 minutes for fresh data
    cacheTime: 5 * 60 * 1000, // 5 minutes for cache
  });

  const products = data ? data.pages.flat() : [];

  // console.log("products", products);

  const onEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const sortOption = (sort) => {
    setSort(sort);
    queryClient.invalidateQueries([searchType, sort, order, searchQuery, type]);
  };

  const orderOption = (order) => {
    setOrder(order);
    queryClient.invalidateQueries([searchType, sort, order, searchQuery, type]);
  };

  return {
    products,
    isLoading: queryLoading,
    error,
    fetchProducts,
    sortOption,
    orderOption,
    onEndReached,
    hasNextPage,
    fetchNextPage,
  };
};

export default usePagination;
