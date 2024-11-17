// ScrollPositionContext.js
import React, { createContext, useContext, useState } from "react";

const ScrollPositionContext = createContext();

export const ScrollPositionProvider = ({ children }) => {
  const [scrollPositions, setScrollPositions] = useState({});

  const setScrollPosition = (key, position) => {
    setScrollPositions((prev) => ({ ...prev, [key]: position }));
  };

  return (
    <ScrollPositionContext.Provider value={{ scrollPositions, setScrollPosition }}>
      {children}
    </ScrollPositionContext.Provider>
  );
};

export const useScrollPosition = () => useContext(ScrollPositionContext);
