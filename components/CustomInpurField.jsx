import { View, Text, TextInput } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";

const CustomInpurField = ({
  type,
  label,
  labelStyle,
  GroupedButton,
  specialStyle,
  containerStyle,
  inputFieldStyle,
  handleChangeText,
  inputFieldContainerStyle,
  ...props
}) => {
  return (
    <View className={`w-full ${containerStyle}`}>
      <Text className={`text-gray-400 ${labelStyle}`}>{label}</Text>
      <View className={`w-full mt-2 flex-row ${specialStyle}`}>
        <View
          className={`w-full h-10 p-2 border border-gray-700 focus:border-blue-600 ${inputFieldContainerStyle}`}
        >
          <TextInput
            onChangeText={handleChangeText}
            type={type}
            keyboardType={type === "email" ? "email-address" : "default"}
            secureTextEntry={type === "password"}
            className={`flex-1 text-gray-300 ${inputFieldStyle}`}
          />
        </View>
        {GroupedButton && GroupedButton}
      </View>
    </View>
  );
};

export default CustomInpurField;
