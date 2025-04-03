import {
  ActivityIndicator,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, resetMovieForm } from "@/redux/slices/formDataSlice";
import { addMovie, updateMovie } from "../../lib/firebaseService";
import { FontAwesome6 } from "@expo/vector-icons";
import CustomDropdown from "../../components/CustomDropdown";
import CustomInpurField from "../../components/CustomInpurField";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";
import { setDataByIndex } from "@/redux/slices/dataSlice";

const Create = ({ isUpdate }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state?.formData);
  const { movies } = useSelector((state) => state?.data);
  const user = useSelector((state) => state?.auth?.user);
  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    for (const key in formData?.movie) {
      if (!formData?.movie[key]) {
        ToastAndroid.show(`Please fill ${key} field`, ToastAndroid.SHORT);
        return;
      }
    }
    dispatch(setLoading(true));
    if (isUpdate) {
      updateMovie(formData?.movie)
        .then(() => {
          ToastAndroid.show("Movie updated successfully", ToastAndroid.SHORT);
          dispatch(
            setDataByIndex({
              index: "movies",
              value: movies.map((movie) =>
                movie?.id === formData?.movie?.id ? formData?.movie : movie
              ),
            })
          );
          dispatch(resetMovieForm());
          router.back();
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      addMovie({
        ...formData?.movie,
        user: {
          displayName: user?.displayName,
          photoURL: user?.photoURL,
          email: user?.email,
        },
      })
        .then(() => {
          ToastAndroid.show("Movie added successfully", ToastAndroid.SHORT);
          dispatch(resetMovieForm());
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  };

  const handleBack = () => {
    router.back();
    dispatch(resetMovieForm());
  };

  return (
    <View className="bg-primary flex-1 items-center px-2">
      <View className="flex-row w-full justify-end items-center mt-2">
        <View
          className="flex-1 flex-row items-center justify-between"
          style={{ gap: isUpdate ? 8 : 0 }}
        >
          {isUpdate && (
            <CustomButton
              containerStyle="bg-gray-700 border p-2 !h-9 !w-9 justify-center items-center"
              handlePress={handleBack}
              icon={<FontAwesome6 name="arrow-left" size={14} color="white" />}
            />
          )}
          <Text className="flex-1 text-white font-[MavenPro-SemiBold] text-xl">
            {isUpdate ? "Update" : "Create"}
          </Text>
        </View>
        {!isUpdate && (
          <CustomButton
            containerStyle="bg-gray-700 border p-2 !h-9 !w-9 justify-center items-center"
            handlePress={() => dispatch(resetMovieForm())}
            icon={
              <FontAwesome6 name="arrow-rotate-right" size={14} color="white" />
            }
          />
        )}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View>
            <Text className="color-gray-400 my-2">Movie title</Text>
            <CustomInpurField
              index="movie"
              name="title"
              inputFieldStyle="rounded-lg"
            />
          </View>
          <View className="flex-row w-full">
            <View className="mr-2">
              <Text className="color-gray-400 my-2">Year</Text>
              <CustomDropdown
                placeholder="Year"
                index="movie"
                name="year"
                style={{
                  height: 44,
                  backgroundColor: "transparent",
                  borderRadius: 8,
                }}
                placeholderStyle={{
                  fontSize: 13,
                }}
                selectedTextStyle={{
                  fontSize: 13,
                }}
              />
            </View>
            <View className="flex-1">
              <Text className="color-gray-400 my-2">Origin</Text>
              <CustomDropdown
                search={true}
                index="movie"
                name="origin"
                placeholder="Origin"
                style={{
                  height: 44,
                  width: "100%",
                  backgroundColor: "transparent",
                  borderRadius: 8,
                }}
                placeholderStyle={{
                  fontSize: 13,
                }}
                selectedTextStyle={{
                  fontSize: 13,
                }}
              />
            </View>
          </View>
          <View className="flex-row w-full">
            <View className="flex-1 mr-2">
              <Text className="color-gray-400 my-2">Film type</Text>
              <CustomDropdown
                index="movie"
                name="filmType"
                placeholder="Film type"
                style={{
                  height: 44,
                  width: "100%",
                  backgroundColor: "transparent",
                  borderRadius: 8,
                }}
                placeholderStyle={{
                  fontSize: 13,
                }}
                selectedTextStyle={{
                  fontSize: 13,
                }}
              />
            </View>
            <View>
              <Text className="color-gray-400 my-2">Type</Text>
              <CustomDropdown
                index="movie"
                name="subType"
                placeholder="Sub type"
                style={{
                  height: 44,
                  backgroundColor: "transparent",
                  borderRadius: 8,
                }}
                placeholderStyle={{
                  fontSize: 13,
                }}
                selectedTextStyle={{
                  fontSize: 13,
                }}
              />
            </View>
          </View>

          <View>
            <Text className="color-gray-400 my-2">Review</Text>
            <CustomDropdown
              placeholder="Review"
              index="movie"
              name="review"
              style={{
                height: 44,
                width: "100%",
                backgroundColor: "transparent",
                borderRadius: 8,
              }}
              placeholderStyle={{
                fontSize: 13,
              }}
              selectedTextStyle={{
                fontSize: 13,
              }}
            />
          </View>

          <CustomButton
            icon={
              formData?.isLoading ? <ActivityIndicator color="#161622" /> : null
            }
            title={
              isUpdate
                ? formData?.isLoading
                  ? "Updating..."
                  : "Update"
                : formData?.isLoading
                ? "Creating..."
                : "Create"
            }
            handlePress={submitHandler}
            isLoading={formData?.isLoading}
            textStyle="text-primary"
            containerStyle={`mt-4 h-10 justify-center items-center rounded-lg`}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Create;
