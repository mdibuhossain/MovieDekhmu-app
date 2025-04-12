import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import ScreenLayout from "../../components/ScreenLayout";
import CustomInpurField from "../../components/CustomInpurField";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import { router } from "expo-router";
import { signUp } from "@/lib/supabaseService";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/slices/authSlice";

const initialUserInfo = {
  email: "",
  fullName: "",
  password: "",
  passwordConfirmation: "",
};

const SignUp = () => {
  const dispatch = useDispatch();
  const [formPayload, setFormPayload] = React.useState(initialUserInfo);
  const { isLoading } = useSelector((state) => state.auth);

  const handleSignUp = async () => {
    if (formPayload.password !== formPayload.passwordConfirmation) {
      alert("Passwords do not match");
      return;
    }
    dispatch(setLoading(true));
    try {
      const { loading, user } = await signUp(
        formPayload.fullName,
        formPayload.email,
        formPayload.password
      );
      dispatch(setLoading(loading));
      if (user) {
        const newUser = {
          uid: user?.id,
          email: user?.email,
          ...user?.user_metadata,
        };
        if (user?.email) {
          dispatch(setUser(newUser));
        }
      }
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="w-full h-full justify-between items-start">
          <View className="w-full">
            <Image
              className="h-20 w-16 border"
              resizeMode="contain"
              resizeMethod="resize"
              source={images.logo}
            />
            <Text className="text-white text-2xl mt-3 font-mPsemibold">
              Sign Up
            </Text>
          </View>
          <View className="w-full mt-6">
            <CustomInpurField
              type="text"
              label="Enter Full Name"
              value={formPayload.fullName}
              handleChangeText={(e) =>
                setFormPayload({ ...formPayload, fullName: e })
              }
            />
            <CustomInpurField
              type="email"
              label="Enter email"
              containerStyle="mt-2"
              value={formPayload.email}
              handleChangeText={(e) =>
                setFormPayload({ ...formPayload, email: e })
              }
            />
            <CustomInpurField
              type="password"
              label="Enter password"
              containerStyle="mt-2"
              value={formPayload.password}
              handleChangeText={(e) =>
                setFormPayload({ ...formPayload, password: e })
              }
            />
            <CustomInpurField
              type="password"
              label="Confirm password"
              containerStyle="mt-2"
              value={formPayload.passwordConfirmation}
              handleChangeText={(e) =>
                setFormPayload({ ...formPayload, passwordConfirmation: e })
              }
            />
            <CustomButton
              containerStyle="h-10 justify-center items-center mt-5"
              title={isLoading ? "Loading..." : "Sign up"}
              handlePress={handleSignUp}
              isLoading={isLoading}
              isDisabled={
                formPayload.password &&
                formPayload.email &&
                formPayload.fullName &&
                formPayload.passwordConfirmation
                  ? false
                  : true
              }
            />
          </View>
          <CustomButton
            title="Log in"
            containerStyle="h-10 w-full justify-center items-center mt-5 bg-transparent border border-secondary"
            textStyle="text-secondary"
            handlePress={() => router.back()}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

export default SignUp;
