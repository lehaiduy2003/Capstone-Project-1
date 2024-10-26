import useScrollStore from "../store/useScrollStore";

const handleScroll = ({ nativeEvent }) => {
  const setReachedEnd = useScrollStore.getState().setReachedEnd;

  const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;

  if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
    setReachedEnd(true);
  } else {
    setReachedEnd(false);
  }
};

export default handleScroll;
