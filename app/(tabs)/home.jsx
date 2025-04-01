import { RefreshControl, Text, View } from "react-native";
import CustomInpurField from "../../components/CustomInpurField";
import { useEffect } from "react";
import { Button, Card, ScrollView, Separator, XStack } from "tamagui";
import { FlashList } from "@shopify/flash-list";
import { getMovies } from "../../lib/firebaseService";
import { useDispatch, useSelector } from "react-redux";
import { setDataByIndex, setLoading } from "@/redux/slices/dataSlice";
import { dropdownItems } from "../../utils/dropdownItems";
import CustomDropdown from "../../components/CustomDropdown";

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
              <CustomDropdown
                items={dropdownItems.review}
                placeholder="Review"
              />
              <CustomDropdown
                items={dropdownItems.origin}
                search={true}
                placeholder="Origin"
              />
              <CustomDropdown items={dropdownItems.year} placeholder="Year" />
              <CustomDropdown
                items={dropdownItems.filmType}
                placeholder="Type"
              />
              <CustomDropdown
                items={dropdownItems.subType}
                placeholder="Sub type"
              />
              <Button className="flex items-center justify-center p-0 h-6 w-14">
                <Text>Reset</Text>
              </Button>
            </XStack>
          </ScrollView>
        </View>
        <Separator borderColor={"gray"} />
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

export default Home;
