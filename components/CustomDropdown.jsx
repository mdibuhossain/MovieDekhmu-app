import { useState, memo } from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

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
  items,
  style,
  search,
  placeholder,
  containerStyle,
  placeholderStyle,
  selectedTextStyle,
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderItem = (item) => {
    return <ListItem item={item} value={value} />;
  };

  return (
    <Dropdown
      data={items}
      value={value}
      search={search}
      labelField="label"
      valueField="value"
      renderItem={renderItem}
      placeholder={placeholder}
      searchPlaceholder="Search..."
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(e) => {
        setValue(e.value);
        setIsFocus(false);
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
      itemContainerStyle={{}}
      containerStyle={{ width: "100%", left: 0, ...containerStyle }}
      placeholderStyle={{ color: "white", fontSize: 10, ...placeholderStyle }}
      selectedTextStyle={{ color: "white", fontSize: 10, ...selectedTextStyle }}
    />
  );
};

export default CustomDropdown;
