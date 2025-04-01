import { useState, memo } from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { setForm } from "@/redux/slices/formDataSlice";
import { dropdownItems } from "../utils/dropdownItems";

const ListItem = memo(({ item, value }) => {
  return (
    <View className="flex-row justify-between p-2">
      <Text>{item.value}</Text>
      {item.value === value && (
        <AntDesign color="black" name="Safety" size={20} />
      )}
    </View>
  );
});

const CustomDropdown = ({
  name,
  index,
  items,
  style,
  search,
  placeholder,
  containerStyle,
  placeholderStyle,
  selectedTextStyle,
  itemContainerStyle,
}) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state?.formData);
  const [isFocus, setIsFocus] = useState(false);

  const renderItem = (item) => {
    return <ListItem item={item} value={formData?.[index]?.[name]} />;
  };

  return (
    <Dropdown
      data={dropdownItems?.[name] ?? items}
      value={formData?.[index]?.[name]}
      search={search}
      labelField="label"
      valueField="value"
      renderItem={renderItem}
      placeholder={placeholder}
      searchPlaceholder="Search..."
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(e) => {
        setIsFocus(false);
        dispatch(setForm({ index, key: name, value: e.value }));
      }}
      style={{
        width: 100,
        height: 30,
        borderWidth: 1,
        borderRadius: 200,
        paddingHorizontal: 10,
        backgroundColor: "black",
        borderColor: isFocus ? "orange" : "gray",
        ...style,
      }}
      itemContainerStyle={{ ...itemContainerStyle }}
      containerStyle={{ width: "100%", left: 0, ...containerStyle }}
      placeholderStyle={{ color: "white", fontSize: 10, ...placeholderStyle }}
      selectedTextStyle={{ color: "white", fontSize: 10, ...selectedTextStyle }}
    />
  );
};

export default CustomDropdown;
