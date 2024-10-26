import { useRef } from "react";
import useLoadingStore from "../store/useLoadingStore";
import useReachedEndStore from "../store/useReachedEndStore";

const useInfiniteScroll = (fetchMore) => {
  const scrollRef = useRef(false);
  const { isLoading } = useLoadingStore();
  const { reachedEnd } = useReachedEndStore();

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    // Check if the user has scrolled to the bottom and should fetch more items
    if (offsetY + layoutHeight >= contentHeight && !isLoading && !reachedEnd) {
      scrollRef.current = true;
    } else if (scrollRef.current && offsetY + layoutHeight < contentHeight - 100) {
      // Trigger fetching more products if the user scrolls back up after reaching the bottom
      fetchMore();
      scrollRef.current = false;
    }
  };

  return { handleScroll };
};

export default useInfiniteScroll;
