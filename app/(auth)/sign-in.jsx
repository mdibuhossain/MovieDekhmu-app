import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import ScreenLayout from "../../components/ScreenLayout";
import CustomInpurField from "../../components/CustomInpurField";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { logIn } from "@/lib/supabaseService";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/slices/authSlice";
import { router } from "expo-router";

const initialUserInfo = {
  email: "",
  password: "",
};

const SignIn = () => {
  const dispatch = useDispatch();
  const [formPayload, setFormPayload] = React.useState(initialUserInfo);
  const { isLoading } = useSelector((state) => state.auth);

  const handleSignIn = async () => {
    if (!formPayload.email || !formPayload.password) {
      alert("Please fill all fields");
      return;
    }
    try {
      dispatch(setLoading(true));
      const user = await logIn(formPayload.email, formPayload.password);
      const newUser = {
        uid: user?.id,
        email: user?.email,
        ...user?.user_metadata,
      };
      if (user?.email) {
        dispatch(setUser(newUser));
      }
    } catch (error) {
      alert(error.message);
      dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <ScreenLayout>
      <View className="w-full h-full justify-center items-start">
        <View className="w-full">
          <Image
            className="h-20 w-16 border"
            resizeMode="contain"
            resizeMethod="resize"
            source={images.logo}
          />
        </View>
        <Text className="text-white text-2xl mt-3 font-mPsemibold">
          Sign In
        </Text>
        <View className="w-full mt-6">
          <CustomInpurField
            type="email"
            value={formPayload.email}
            label="Your email"
            handleChangeText={(e) =>
              setFormPayload({ ...formPayload, email: e })
            }
          />
          <CustomInpurField
            type="password"
            value={formPayload.password}
            label="Your password"
            containerStyle="mt-2"
            handleChangeText={(e) =>
              setFormPayload({ ...formPayload, password: e })
            }
          />
          <CustomButton
            title={isLoading ? "Loading..." : "Log In"}
            containerStyle="h-10 justify-center items-center mt-5"
            handlePress={handleSignIn}
          />
        </View>
        <View className="w-full flex-row justify-center items-center mt-5">
          <Text className="text-white text-center font-mPsemibold">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text className="text-secondary font-mPsemibold">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
};

export default SignIn;
