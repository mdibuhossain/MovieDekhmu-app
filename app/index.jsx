import { Dimensions, Image, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";
import ScreenLayout from "@/components/ScreenLayout";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import openLoader from "@/assets/opening-loader.json";

const index = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <>
        <LottieView
          source={openLoader}
          autoPlay
          loop
          style={{
            height: Dimensions.get("window").height * 0.9,
          }}
        />
      </>
    );
  }

  if (user?.email) return <Redirect href="/home" />;

  return (
    <>
      <ScreenLayout>
        <View className="justify-center w-full h-full items-center">
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Unlock the magic of cinema with{" "}
              <Text className="text-secondary-200">MovieDekhmu</Text>
            </Text>
            <Image
              source={images.path}
              resizeMode="contain"
              className="w-[136px] h-[15px] absolute -bottom-[5px] -right-0"
            />
          </View>
          <Text className="text-base text-gray-100 mt-7 text-center">
            হুদাই! মুভি ট্র্যাক রাখার জন্য তৈরি করছি।
            {"\n"}এখনি সাইন ইন করো{" "}
            <Text className="text-secondary-200 font-semibold">
              MovieDekhmu
            </Text>{" "}
            অ্যাপের সাথে।
          </Text>
          <CustomButton
            handlePress={() => router.push("/sign-in")}
            containerStyle="w-full h-14 justify-center items-center mt-7"
            textStyle="text-mPsemibold"
            title="Continue with email"
          />
        </View>
        <StatusBar style="light" />
      </ScreenLayout>
    </>
  );
};

export default index;
