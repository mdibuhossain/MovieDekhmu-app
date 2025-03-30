import { RefreshControl, Text, View } from "react-native";
import CustomInpurField from "../../components/CustomInpurField";
import { useEffect, useMemo, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import {
  Button,
  Card,
  H4,
  H5,
  H6,
  Paragraph,
  ScrollView,
  Separator,
  XStack,
} from "tamagui";
import { FlashList } from "@shopify/flash-list";
import { getMovies } from "../../lib/firebaseService";
import { useDispatch, useSelector } from "react-redux";
import { setDataByIndex, setLoading } from "@/redux/slices/dataSlice";
import { dropdownItems } from "../../utils/dropdownItems";

const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
  { label: "Item 8", value: "8" },
];

const Home = () => {
  const dispatch = useDispatch();
  const { movies, isLoading } = useSelector((state) => state?.data);

  const fetchData = (filter) => {
    dispatch(setLoading(true));
    try {
      getMovies(filter)
        .then((res) => {
          dispatch(setDataByIndex({ index: "movies", value: res }));
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData({});
  }, []);

  return (
    <View className="bg-primary flex-1">
      <View className=" px-3">
        <CustomInpurField
          placeholder="Search"
          inputFieldStyle="!rounded-full"
        />
        <View className="flex-row justify-between items-center mt-2">
          <ScrollView horizontal>
            <XStack gap={10} alignItems="center" className="pb-2">
              <CustomDropdown items={dropdownItems.review} />
              <CustomDropdown items={dropdownItems.origin} />
              <CustomDropdown items={dropdownItems.year} />
              <CustomDropdown items={dropdownItems.filmType} />
              <CustomDropdown items={dropdownItems.subType} />
              <Button className="flex items-center justify-center p-0 h-6 w-14">
                <Text>Reset</Text>
              </Button>
            </XStack>
          </ScrollView>
        </View>
        <Separator borderColor={"gray"}  />
      </View>

      <FlashList
        data={movies}
        contentContainerStyle={{
          paddingTop: 5,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: 10,
        }}
        estimatedItemSize={15}
        keyExtractor={(_, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchData}
            colors={["#FF9C01"]}
          />
        }
        renderItem={({ item, _index }) => (
          <Card
            elevate
            size="$1"
            className="bg-gray-800 px-2 py-1 rounded-md my-0.5"
            onPress={() => {
              console.log("click");
            }}
          >
            <Card.Header className="flex-col items-start gap-1">
              <View className="flex-row flex-1 items-start text-white text-sm font-[MavenPro-Regular]">
                <Text className="flex-1 color-white leading-5">
                  {item?.title}
                </Text>
                <Text className="color-gray-400/80 text-xs">
                  {item?.filmType} ({item?.subType})
                </Text>
              </View>
              <Text className="text-xs text-gray-400 font-[MavenPro-Regular]">
                {item?.review?.toUpperCase()} - {item?.origin} - {item?.year}
              </Text>
            </Card.Header>
          </Card>
        )}
      />
    </View>
  );
};

const CustomDropdown = ({ items }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderItem = (item) => {
    return (
      <View className="flex-row justify-between bg-gray-600/50 p-2">
        <Text>{item}</Text>
        {item === value && <AntDesign color="black" name="Safety" size={20} />}
      </View>
    );
  };

  return (
    <Dropdown
      data={items}
      value={value}
      selectedTextStyle={{ color: "white", fontSize: 10 }}
      placeholderStyle={{ color: "white", fontSize: 10 }}
      containerStyle={{ width: "100%", left: 0 }}
      style={{
        width: 100,
        height: 30,
        borderWidth: 1,
        borderRadius: 200,
        paddingHorizontal: 10,
        backgroundColor: "black",
        borderColor: isFocus ? "orange" : "gray",
      }}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(e) => {
        setValue(e);
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
