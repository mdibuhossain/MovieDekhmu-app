import { Image, Text, View } from "react-native";
import React from "react";
import CustomButton from "../../components/CustomButton";
import { logOut, verifyEmail } from "../../lib/firebaseService";
import { useGlobalContext } from "../../context/GlobalProvider";
import ScreenLayout from "../../components/ScreenLayout";
import { images } from "../../constants";
import CustomInpurField from "../../components/CustomInpurField";

const Profile = () => {
  const { user } = useGlobalContext();

  console.log("User: ", user);

  const handleVerifyEmail = async () => {
    try {
      await verifyEmail();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScreenLayout>
      <View className="flex-1 items-center">
        <View className="w-full items-center">
          <Image
            className="w-20 h-20 rounded-full"
            resizeMode="contain"
            source={images.profile}
          />
          <Text className="text-white text-base font-mPbold mt-2">
            {user?.displayName || "No name found"}
          </Text>
          <Text className="text-white text-xs font-mPregular">
            {user?.email}
            {user?.emailVerified ? " ✅" : " ❌"}
          </Text>
          {!user?.emailVerified && (
            <CustomButton
              title="Verify Email"
              containerStyle="px-4 py-1 rounded-full mt-3 active:bg-red-600"
              textStyle="text-white text-xs uppercase"
              handlePress={handleVerifyEmail}
            />
          )}
        </View>
        <View className="w-full">
          <CustomInpurField label="Full Name" containerStyle="mt-5" />
        </View>
        <View className="flex-1 justify-end">
          <CustomButton
            title="Sign Out"
            containerStyle="px-4 py-1 rounded-full mt-3 active:bg-red-600"
            textStyle="text-white uppercase"
            handlePress={logOut}
          />
        </View>
      </View>
    </ScreenLayout>
  );
};

export default Profile;
