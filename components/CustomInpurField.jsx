import { View, Text, TextInput } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setForm } from "@/redux/slices/formDataSlice";

const CustomInputField = (props) => {
  const {
    name,
    type,
    label,
    value,
    index,
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
  const dispatch = useDispatch();
  const formData = useSelector((state) => state?.formData);
  const [inputValue, setInputValue] = useState("");

  const cbProcessInputValue = () => {
    return new Promise((resolve, resject) => {
      resolve(inputValue);
    });
  };

  return (
    <View className={`w-full ${containerStyle}`}>
      {label && (
        <Text className={`text-gray-400 mb-2 ${labelStyle}`}>{label}</Text>
      )}
      <View className={`w-full flex-row ${specialStyle}`}>
        <View className={`w-full h-11 ${inputFieldContainerStyle}`}>
          <TextInput
            type={type}
            placeholder={placeholder}
            value={
              index && index !== ""
                ? formData?.[index]?.[name]
                : value || inputValue
            }
            secureTextEntry={type === "password"}
            onChangeText={
              index && index !== ""
                ? (e) => dispatch(setForm({ index, key: name, value: e }))
                : handleChangeText || setInputValue
            }
            keyboardType={type === "email" ? "email-address" : "default"}
            className={`flex-1 text-base text-gray-300 px-3 border border-gray-400/80 bg-transparent rounded-none ${inputFieldStyle}`}
            placeholderTextColor="#7d7d7d"
          />
        </View>
        {GroupedButton && <GroupedButton cbFn={cbProcessInputValue} />}
      </View>
    </View>
  );
};

export default CustomInputField;
