import { Image, Text, View } from "react-native";
import React from "react";
import CustomButton from "../../components/CustomButton";
import { logOut, updateUserData, verifyEmail } from "../../lib/firebaseService";
import { useGlobalContext } from "../../context/GlobalProvider";
import ScreenLayout from "../../components/ScreenLayout";
import { images } from "../../constants";
import CustomInpurField from "../../components/CustomInpurField";

const Profile = () => {
  const { user, checkUser, isLoggedIn } = useGlobalContext();
  const [newName, setNewName] = React.useState("");

  const handleUpdateFullName = async () => {
    try {
      if (newName === "") return alert("Name cannot be empty");
      const result = await updateUserData({ displayName: newName });
      if (result) {
        await checkUser();
        setNewName("");
      }
    } catch (error) {
      alert(error.message);
    }
  };

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
          <View className="p-1 justify-center items-center rounded-full bg-gray-700">
            <Image
              className="w-20 h-20 rounded-full"
              resizeMode="contain"
              source={images.profile}
            />
          </View>
          <Text className="text-white text-base font-mPbold mt-2">
            {isLoggedIn ? "Loading..." : user?.displayName || "No name found"}
          </Text>
          <Text className="text-white text-xs font-mPregular">
            {isLoggedIn
              ? "Loading..."
              : `${user?.email}${user?.emailVerified ? " ✅" : " ❌"}`}
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
          <CustomInpurField
            value={newName}
            label="Full Name"
            containerStyle="mt-5"
            inputFieldContainerStyle="flex-1 focus:!border-secondary"
            handleChangeText={setNewName}
            GroupedButton={
              <CustomButton
                title="Update"
                containerStyle="justify-center items-center px-2 rounded-none active:bg-red-600"
                textStyle="text-white text-xs uppercase"
                handlePress={handleUpdateFullName}
              />
            }
          />
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
