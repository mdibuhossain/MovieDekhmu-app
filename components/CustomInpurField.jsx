import { View, Text, TextInput } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";

const CustomInpurField = ({
  type,
  label,
  labelStyle,
  containerStyle,
  inputFieldStyle,
  handleChangeText,
  inputFieldContainerStyle,
  ...props
}) => {
  return (
    <View className={`w-full ${containerStyle}`}>
      <Text className={`text-gray-400 ${labelStyle}`}>{label}</Text>
      <View
        className={`w-full h-10 p-2 mt-2 border border-gray-700 focus:border-blue-600 rounded-md ${inputFieldContainerStyle}`}
      >
        <TextInput
          onChangeText={handleChangeText}
          type={type}
          keyboardType={type === "email" ? "email-address" : "default"}
          secureTextEntry={type === "password"}
          className={`flex-1 text-gray-300 ${inputFieldStyle}`}
        />
      </View>
      <CustomButton
        title="Update"
        containerStyle="px-2 active:bg-red-600"
        textStyle="text-white text-xs uppercase"
      />
    </View>
  );
};

export default CustomInpurField;
