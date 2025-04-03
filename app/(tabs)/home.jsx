import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import CustomInpurField from "../../components/CustomInpurField";
import { useEffect, useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { deleteMovie, getMovies } from "../../lib/firebaseService";
import { useDispatch, useSelector } from "react-redux";
import { setDataByIndex, setLoading } from "@/redux/slices/dataSlice";
import { resetFilterForm, setMovie } from "@/redux/slices/formDataSlice";
import CustomDropdown from "../../components/CustomDropdown";
import CustomButton from "../../components/CustomButton";
import { Swipeable } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import LottieView from "lottie-react-native";
import listLoader from "@/assets/list-loader.json";
import { Dimensions } from "react-native";

const Home = () => {
  const dispatch = useDispatch();
  const { movies, isLoading } = useSelector((state) => state?.data);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const swipeableRefs = useRef([]);
  const router = useRouter();

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

  const handleSwipeOpen = (index) => {
    setCurrentItemIndex(index);
    const openedSwipeableRef = swipeableRefs.current[index];
    swipeableRefs.current.forEach((_swipeableRef) => {
      if (_swipeableRef !== openedSwipeableRef) {
        _swipeableRef.close();
      }
    });
  };

  const handleEdit = (item) => {
    setCurrentItemIndex((_prev) => {
      swipeableRefs.current[_prev].close();
      return null;
    });
    dispatch(setMovie(item));
    router.push("/movieUpdateModal");
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this movie?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setCurrentItemIndex((_prev) => {
              swipeableRefs.current[_prev].close();
              return null;
            });
            deleteMovie(item?.id)
              .then(() => {
                dispatch(
                  setDataByIndex({
                    index: "movies",
                    value: movies.filter((movie) => movie?.id !== item?.id),
                  })
                );
              })
              .catch((error) => {
                console.log(error);
              });
          },
        },
      ]
    );
  };

  const renderRightActions = (item) => {
    return (
      <View
        className="flex-row items-center justify-center"
        style={{ gap: 8, width: 100 }}
      >
        <CustomButton
          handlePress={() => handleEdit(item)}
          containerStyle="bg-gray-600 p-[8] rounded-full"
          icon={<Feather name="edit" size={20} color="white" />}
        />
        <CustomButton
          handlePress={() => handleDelete(item)}
          containerStyle="bg-gray-600 p-[8] rounded-full"
          icon={<AntDesign name="delete" size={20} color="white" />}
        />
      </View>
    );
  };

  return (
    <View className="bg-primary flex-1">
      <View className=" px-3">
        <CustomInpurField
          inputFieldStyle="!rounded-full"
          containerStyle="mt-2"
          placeholder="Search"
          index="filter"
          name="title"
        />
        <View className="flex-row justify-between items-center mt-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 6 }} className="mb-2">
              <CustomDropdown
                placeholder="Review"
                index="filter"
                name="review"
              />
              <CustomDropdown
                search={true}
                placeholder="Origin"
                index="filter"
                name="origin"
              />
              <CustomDropdown placeholder="Year" index="filter" name="year" />
              <CustomDropdown
                placeholder="Film type"
                index="filter"
                name="filmType"
              />
              <CustomDropdown
                placeholder="Sub type"
                index="filter"
                name="subType"
              />
              <CustomButton
                title="Reset"
                containerStyle="w-14 h-7 justify-center items-center"
                textStyle="text-sm"
                handlePress={() => dispatch(resetFilterForm())}
              />
            </View>
          </ScrollView>
        </View>
        <View className="h-[1.5] w-full bg-gray-600" />
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
        ListHeaderComponent={isLoading ? spinner : null}
        renderItem={({ item, index }) => {
          return (
            <Swipeable
              friction={2}
              ref={(_ref) => {
                if (!swipeableRefs.current[index])
                  swipeableRefs.current[index] = _ref;
              }}
              renderRightActions={() => renderRightActions(item)}
              onSwipeableOpen={() => handleSwipeOpen(index)}
            >
              <TouchableHighlight
                elevate
                size="$1"
                className="bg-gray-800 px-2 py-1 rounded-md my-0.5"
                onPress={() => {
                  console.log("date", new Date());
                }}
              >
                <View className="flex-col items-start gap-1">
                  <View className="flex-row flex-1 items-start text-white text-sm font-[MavenPro-Regular]">
                    <Text className="flex-1 color-white leading-5">
                      {item?.title}
                    </Text>
                    <Text className="color-gray-400/80 text-xs">
                      {item?.filmType} ({item?.subType})
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-400 font-[MavenPro-Regular]">
                    {item?.review?.toUpperCase()} - {item?.origin} -{" "}
                    {item?.year}
                  </Text>
                </View>
              </TouchableHighlight>
            </Swipeable>
          );
        }}
      />
    </View>
  );
};

const spinner = () => {
  return (
    <View className="w-full h-full flex-1 flex-col">
      <LottieView
        source={listLoader}
        autoPlay
        loop
        style={{
          height: Dimensions.get("window").height * 0.3,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Home;
