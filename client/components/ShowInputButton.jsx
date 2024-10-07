import React from "react";

const ShowInputButton = (showPassword, setShowPassword) => {
  return (
    <TouchableOpacity onPress={setShowPassword}>
      <Icon
        name={showPassword ? "visibility" : "visibility-off"}
        size={24}
        color="gray"
      />
    </TouchableOpacity>
  );
};

export default ShowInputButton;
