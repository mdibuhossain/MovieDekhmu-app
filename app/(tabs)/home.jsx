import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import CustomInpurField from "../../components/CustomInpurField";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { deleteMovie, getMovies } from "../../lib/firebaseService";
import { useDispatch, useSelector } from "react-redux";
import { setDataByIndex, setLoading } from "@/redux/slices/dataSlice";
import { resetFilterForm, setMovie } from "@/redux/slices/formDataSlice";
import CustomDropdown from "../../components/CustomDropdown";
import CustomButton from "../../components/CustomButton";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import LottieView from "lottie-react-native";
import listLoader from "@/assets/list-loader.json";
import { Dimensions } from "react-native";
import { useDebounce } from "use-debounce";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef(null);
  const formData = useSelector((state) => state?.formData);
  const [debounceFilter] = useDebounce(formData?.filter, 500);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const { movies, isLoading } = useSelector((state) => state?.data);

  const fetchData = (filter) => {
    try {
      dispatch(setLoading(true));
      getMovies(filter)
        .then((res) => {
          dispatch(setDataByIndex({ index: "movies", value: res }));
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(debounceFilter);
  }, [debounceFilter]);

  const handleEdit = (item) => {
    dispatch(setMovie(item));
    router.push("/movieUpdateModal");
    bottomSheetModalRef.current.dismiss();
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
    bottomSheetModalRef.current.dismiss();
  };

  const spinner = () => {
    return (
      <View className="flex-1 flex-col">
        {movies.length === 0 && !isLoading && (
          <Text className="text-white text-center text-lg font-[MavenPro-Regular] mt-2">
            No movies found. Please add a movie.
          </Text>
        )}
        {isLoading && movies.length === 0 && (
          <LottieView
            source={listLoader}
            autoPlay
            loop
            style={{
              height: Dimensions.get("window").height * 0.25,
            }}
          />
        )}
      </View>
    );
  };

  const renderRightActions = useCallback(
    (item) => (
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
    ),
    [handleEdit, handleDelete]
  );

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
        ListHeaderComponent={spinner}
        renderItem={({ item, index }) => {
          return (
            <TouchableHighlight
              className="bg-gray-800 px-2 py-1 rounded-md my-0.5"
              onLongPress={() => {
                setCurrentItemIndex(index);
                bottomSheetModalRef.current.present();
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
                  {item?.review} - {item?.origin} - {item?.year}
                </Text>
              </View>
            </TouchableHighlight>
          );
        }}
      />
      <BottomSheetModalProvider>
        <BottomSheetModal ref={bottomSheetModalRef} snapPoints={["50%"]}>
          <BottomSheetView>
            <View className="flex-col justify-around">
              <CustomButton
                title="Edit"
                containerStyle="px-4 py-2 rounded-none bg-transparent"
                textStyle="text-black font-[MavenPro-Semibold]"
                handlePress={() => handleEdit(movies[currentItemIndex])}
              />
              <CustomButton
                title="Delete"
                containerStyle="px-4 py-2 rounded-none bg-transparent"
                textStyle="text-black font-[MavenPro-Semibold]"
                handlePress={() => handleDelete(movies[currentItemIndex])}
              />
              <CustomButton
                title="Cancel"
                containerStyle="px-4 py-2 rounded-none bg-red-600"
                textStyle="text-white font-[MavenPro-Semibold]"
                handlePress={() => bottomSheetModalRef.current.dismiss()}
              />
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export default memo(Home);
