import { View, Text, TextInput } from "react-native";
import React from "react";
import { Input } from "tamagui";

const CustomInpurField = (props) => {
  const {
    type,
    label,
    value,
    setValue,
    labelStyle,
    placeholder,
    specialStyle,
    GroupedButton,
    containerStyle,
    inputFieldStyle,
    handleChangeText,
    inputFieldContainerStyle,
    ...rest
  } = props;

  const [inputValue, setInputValue] = React.useState("");

  const cbProcessInputValue = () => {
    return new Promise((resolve, resject) => {
      resolve(inputValue);
    });
  };

  return (
    <View className={`w-full ${containerStyle}`}>
      {label && <Text className={`text-gray-400 ${labelStyle}`}>{label}</Text>}
      <View className={`w-full mt-2 flex-row ${specialStyle}`}>
        <View className={`w-full h-10 ${inputFieldContainerStyle}`}>
          <Input
            type={type}
            placeholder={placeholder}
            value={value || inputValue}
            secureTextEntry={type === "password"}
            onChangeText={handleChangeText || setInputValue}
            keyboardType={type === "email" ? "email-address" : "default"}
            className={`flex-1 text-base text-gray-300 border-gray-400 bg-transparent rounded-none ${inputFieldStyle}`}
          />
        </View>
        {GroupedButton && <GroupedButton cbFn={cbProcessInputValue} />}
      </View>
    </View>
  );
};

export default CustomInpurField;
