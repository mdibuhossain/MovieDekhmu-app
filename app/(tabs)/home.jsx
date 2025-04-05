import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import CustomInpurField from "../../components/CustomInpurField";
import { memo, useEffect, useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { deleteMovie, getMovies } from "../../lib/firebaseService";
import { useDispatch, useSelector } from "react-redux";
import { setDataByIndex, setLoading } from "@/redux/slices/dataSlice";
import { resetFilterForm, setMovie } from "@/redux/slices/formDataSlice";
import CustomDropdown from "../../components/CustomDropdown";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import LottieView from "lottie-react-native";
import listLoader from "@/assets/list-loader.json";
import { Dimensions } from "react-native";
import { useDebounce } from "use-debounce";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { TapGestureHandler } from "react-native-gesture-handler";

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef(null);
  const { user } = useSelector((state) => state?.auth);
  const formData = useSelector((state) => state?.formData);
  const [debounceFilter] = useDebounce(formData?.filter, 500);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const { movies, isLoading } = useSelector((state) => state?.data);

  const fetchData = (filter) => {
    try {
      dispatch(setLoading(true));
      getMovies(filter, user?.email)
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
    } finally {
      if (
        debounceFilter?.title === "" &&
        debounceFilter?.review === "" &&
        debounceFilter?.origin === "" &&
        debounceFilter?.year === "" &&
        debounceFilter?.filmType === "" &&
        debounceFilter?.subType === "" &&
        movies?.length !== 0
      ) {
        dispatch(setLoading(false));
      }
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
            deleteMovie(item?.id, user?.email)
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

  return (
    <TapGestureHandler
      onActivated={() => bottomSheetModalRef.current.dismiss()}
    >
      <View className="bg-primary flex-1">
        <View className=" px-3">
          <CustomInpurField
            inputFieldStyle="!rounded-full focus:!border-secondary"
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
              onRefresh={() => fetchData(debounceFilter)}
              colors={["#FF9C01"]}
            />
          }
          ListHeaderComponent={spinner}
          renderItem={({ item, index }) => {
            return (
              <TouchableHighlight
                className="bg-gray-800 px-2 py-1 rounded-md my-0.5"
                delayLongPress={100}
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
        <BottomSheetModal
          ref={bottomSheetModalRef}
          backgroundStyle={{
            backgroundColor: "#2d2d38",
            borderColor: "#73737a",
            borderWidth: 1,
          }}
        >
          <BottomSheetView>
            <View className="flex-col justify-around">
              <TouchableHighlight
                onPress={() => handleEdit(movies[currentItemIndex])}
                underlayColor={"#FF9C01"}
                className="px-4 py-2"
              >
                <Text className="text-white text-lg text-center">Edit</Text>
              </TouchableHighlight>
              <View className="bg-[#73737a] h-[1]"></View>
              <TouchableHighlight
                onPress={() => handleDelete(movies[currentItemIndex])}
                underlayColor={"red"}
                className="px-4 py-2"
              >
                <Text className="text-white text-lg text-center">Delete</Text>
              </TouchableHighlight>
              <View className="bg-[#73737a] h-[1]"></View>
              <TouchableHighlight
                onPress={() => bottomSheetModalRef.current.dismiss()}
                underlayColor={"#161622"}
                className="px-4 py-2"
              >
                <Text className="text-white text-lg text-center">Cancel</Text>
              </TouchableHighlight>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </TapGestureHandler>
  );
};

export default memo(Home);
