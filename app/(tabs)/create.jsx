import { ToastAndroid, View } from "react-native";
import {
  Button,
  Form,
  Input,
  Label,
  ScrollView,
  Spinner,
  Text,
  YStack,
} from "tamagui";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "../../components/Dropdown";
import {
  setForm,
  setLoading,
  resetMovieForm,
} from "@/redux/slices/formDataSlice";
import { addMovie } from "../../lib/firebaseService";
import { FontAwesome6 } from "@expo/vector-icons";

const Create = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state?.formData);
  const user = useSelector((state) => state?.auth?.user);

  const submitHandler = (e) => {
    e.preventDefault();
    let isValid = true;
    Object.keys(formData?.movie).forEach((key) => {
      if (!formData?.movie[key]) {
        ToastAndroid.show(`Please fill ${key} field`, ToastAndroid.SHORT);
        isValid = false;
      }
    });
    if (!isValid) return;
    dispatch(setLoading(true));
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
  };

  return (
    <View className="bg-primary flex-1 items-center px-2">
      <View className="flex-row w-full justify-end items-center mt-2">
        <Text className="flex-1 text-white font-[MavenPro-SemiBold] text-xl">
          Create
        </Text>
        <Button
          className="bg-gray-700 border p-2 !h-9 !w-9 justify-center items-center"
          onPress={() => dispatch(resetMovieForm())}
        >
          <FontAwesome6 name="arrow-rotate-right" size={14} color="white" />
        </Button>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Form onSubmit={submitHandler}>
          <YStack>
            <Label color="white">Movie title</Label>
            <Input
              minWidth="100%"
              backgroundColor="transparent"
              color="white"
              value={formData?.movie?.title}
              onChangeText={(e) =>
                dispatch(setForm({ index: "movie", key: "title", value: e }))
              }
            />
          </YStack>
          <View className="flex-row w-full">
            <YStack className="mr-2">
              <Label color="white">Year</Label>
              <Dropdown
                color="white"
                backgroundColor="transparent"
                label="Year"
                name="year"
                index="movie"
              />
            </YStack>
            <YStack className="flex-1">
              <Label color="white">Origin</Label>
              <Dropdown
                color="white"
                backgroundColor="transparent"
                label="Origin"
                name="origin"
                index="movie"
                searchable
              />
            </YStack>
          </View>
          <View className="flex-row w-full">
            <YStack className="flex-1 mr-2">
              <Label color="white">Film type</Label>
              <Dropdown
                color="white"
                backgroundColor="transparent"
                label="Film type"
                name="filmType"
                index="movie"
              />
            </YStack>
            <YStack>
              <Label color="white">Type</Label>
              <Dropdown
                color="white"
                backgroundColor="transparent"
                label="Type"
                name="subType"
                index="movie"
              />
            </YStack>
          </View>

          <YStack>
            <Label color="white">Review</Label>
            <Dropdown
              color="white"
              backgroundColor="transparent"
              label="Review"
              name="review"
              index="movie"
            />
          </YStack>

          <Form.Trigger asChild disabled={formData?.isLoading} className="my-5">
            <Button
              icon={formData?.isLoading ? () => <Spinner /> : null}
              className="bg-secondary text-white"
            >
              Submit
            </Button>
          </Form.Trigger>
        </Form>
      </ScrollView>
    </View>
  );
};

export default Create;
