import React, { useEffect, useState } from "react";
import Welcome from "./welcome";
import Splash from "./splash";

const homeScreen = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 6000);
  });
  return <> {isShowSplash ? <Splash /> : <Welcome />}</>;
};

export default homeScreen;
