import { Text, View } from "react-native";
import CustomInpurField from "../../components/CustomInpurField";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import {
  Button,
  Card,
  H4,
  Paragraph,
  Separator,
  XStack,
} from "tamagui";
import { FlashList } from "@shopify/flash-list";

const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];

const Home = () => {
  return (
    <View className="bg-primary flex-1">
      <View className=" px-3">
        <CustomInpurField
          placeholder="Search"
          inputFieldStyle="!rounded-full"
        />
        <XStack
          gap={10}
          paddingTop={10}
          alignItems="center"
          alignSelf="flex-start"
        >
          <CustomDropdown />
          <CustomDropdown />
          <Button
            size="$1.5"
            fontSize={11}
            alignSelf="flex-end"
            animation={"bouncy"}
          >
            Reset
          </Button>
        </XStack>
        <Separator marginVertical={10} borderColor={"gray"} />
      </View>

      <FlashList
        data={[
          1, 2, 3, 4, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ]}
        contentContainerStyle={{
          paddingTop: 5,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10,
        }}
        estimatedItemSize={15}
        keyExtractor={(_, index) => index.toString()}
        renderItem={(item) => (
          <Card
            elevate
            size="$1"
            className="bg-gray-800 px-2 rounded-md"
            onPress={() => {
              console.log("click");
            }}
          >
            <Card.Header padded>
              <H4 className="text-white">Iron Man</H4>
              <Paragraph theme="alt2">Now available</Paragraph>
            </Card.Header>
          </Card>
        )}
      />
    </View>
  );
};

const CustomDropdown = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderItem = (item) => {
    return (
      <View className="flex-row justify-between p-2">
        <Text>{item.label}</Text>
        {item.value === value && (
          <AntDesign color="black" name="Safety" size={20} />
        )}
      </View>
    );
  };
  return (
    <Dropdown
      data={data}
      value={value}
      placeholder="Review"
      labelField="label"
      valueField="value"
      selectedTextStyle={{ color: "white", fontSize: 10 }}
      placeholderStyle={{ color: "white", fontSize: 10 }}
      containerStyle={{ width: "100%", left: 0 }}
      style={{
        width: 100,
        height: 25,
        borderWidth: 1,
        borderRadius: 200,
        paddingHorizontal: 10,
        backgroundColor: "black",
        borderColor: isFocus ? "orange" : "gray",
      }}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        setValue(item.value);
        setIsFocus(false);
      }}
      renderItem={renderItem}
    // renderLeftIcon={() => (
    //   <AntDesign
    //     color={isFocus ? "blue" : "black"}
    //     name="Review"
    //     size={20}
    //   />
    // )}
    />
  );
};

export default Home;
