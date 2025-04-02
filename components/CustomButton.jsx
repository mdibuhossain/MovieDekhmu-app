import { Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({
  icon,
  title,
  style,
  textStyle,
  isLoading,
  isDisabled,
  handlePress,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${
        isLoading || isDisabled ? "bg-gray-600" : "bg-secondary"
      } rounded-xl ${containerStyle} ${isLoading ? "opacity-75" : ""}`}
      style={{ ...style }}
      activeOpacity={0.8}
      disabled={isLoading || isDisabled}
    >
      {icon && title ? (
        <Text
          className={`text-primary font-mPbold text-lg text-center ${textStyle}`}
        >
          {icon} {title}
        </Text>
      ) : icon ? (
        icon
      ) : title ? (
        <Text
          className={`text-primary font-mPbold text-lg text-center ${textStyle}`}
        >
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default CustomButton;
