import {
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { memo, useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import {
  auth,
  logOut,
  updateUserData,
  uploadProfilePicture,
  verifyEmail,
} from "../../lib/firebaseService";
import { images, svgs } from "../../constants";
import FeatherIcons from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { FlashList } from "@shopify/flash-list";
import CustomInpurField from "../../components/CustomInpurField";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setLoading,
  setTrigger,
  setLoggedIn,
} from "@/redux/slices/authSlice";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, trigger } = useSelector((state) => state.auth);
  const [isLoadingForPhoto, setIsLoadingForPhoto] = useState(false);
  const [isLoadingForName, setIsLoadingForName] = useState(false);
  const [isLoadingForEmailVerify, setIsLoadingForEmailVerify] = useState(false);

  const handleUpdateFullName = async (newName) => {
    setIsLoadingForName(true);
    try {
      if (newName.trim() === "") return alert("Name cannot be empty");
      const result = await updateUserData({ displayName: newName.trim() });
      if (result?.displayName) {
        dispatch(setUser({ ...user, displayName: result.displayName }));
        setIsLoadingForName(false);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoadingForName(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsLoadingForEmailVerify(true);
    try {
      await verifyEmail();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoadingForEmailVerify(false);
    }
  };

  const handleUpdateProfilePicture = async () => {
    setIsLoadingForPhoto(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      selectionLimit: 1,
    });
    if (!result.canceled) {
      uploadProfilePicture({
        mimeType: result.assets[0].mimeType,
        uri: result.assets[0].uri,
      })
        .then(async (url) => {
          const response = await updateUserData({
            photoURL: url,
          });
          if (response) {
            dispatch(setUser({ ...user, photoURL: url }));
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    }
    setIsLoadingForPhoto(false);
  };

  const signOut = async () => {
    await logOut();
    dispatch(setUser(null));
  };

  const onRefresh = () => {
    dispatch(setLoading(true));
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(setTrigger(!trigger));
    }
  }, [isLoading]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (_user) => {
      if (_user) {
        dispatch(
          setUser({
            email: _user.email,
            displayName: _user.displayName,
            photoURL: _user.photoURL,
            uid: _user.uid,
            emailVerified: _user.emailVerified,
          })
        );
        dispatch(setLoggedIn(true));
      } else {
        dispatch(setLoggedIn(false));
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [trigger]);

  const items = [
    // {
    //   isButton: false,
    //   title: "My Orders",
    //   icon: svgs.orders,
    //   onPress: () => {},
    // },
    // {
    //   isButton: false,
    //   title: "My Address",
    //   icon: svgs.address,
    //   onPress: () => {},
    // },
    // {
    //   isButton: false,
    //   title: "My Payment",
    //   icon: svgs.payment,
    //   onPress: () => {},
    // },
    {
      isButton: false,
      title: "My Wishlist",
      icon: svgs.wishlist,
      onPress: () => {},
    },
    // {
    //   isButton: false,
    //   title: "My Reviews",
    //   icon: svgs.reviews,
    //   onPress: () => {},
    // },
    // {
    //   isButton: false,
    //   title: "My Coupons",
    //   icon: svgs.coupons,
    //   onPress: () => {},
    // },
    // {
    //   isButton: false,
    //   title: "My Notifications",
    //   icon: svgs.notifications,
    //   onPress: () => {},
    // },
    {
      isButton: false,
      title: "My Settings",
      icon: svgs.settings,
      onPress: () => {},
    },
    {
      isButton: true,
      title: "Sign Out",
      icon: svgs.settings,
      onPress: signOut,
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={item.onPress}
          activeOpacity={0.7}
          className="flex-row items-center justify-between py-3"
        >
          <View className="flex-row items-center">
            {item.icon}
            <Text className="text-white text-base font-mPregular ml-3">
              {item.title}
            </Text>
          </View>
          {!item.isButton && (
            <FeatherIcons name="chevron-right" size={20} color="#FF7F50" />
          )}
        </TouchableOpacity>
        <View className="border-t border-gray-700 w-full" />
      </View>
    );
  };

  const listHeaderComponent = () => {
    return (
      <>
        <View className="w-full items-center">
          <View className="relative w-[90] h-[90] justify-center items-center rounded-full bg-gray-700">
            {isLoadingForPhoto ? (
              <Image
                className="w-16 h-16 rounded-full"
                resizeMode="contain"
                source={images.spinning}
              />
            ) : (
              <Image
                className="w-20 h-20 rounded-full"
                resizeMode="contain"
                source={
                  user?.photoURL ? { uri: user?.photoURL } : images.profile
                }
              />
            )}
            {/* <TouchableOpacity
              activeOpacity={0.7}
              className="absolute right-0 bottom-0 bg-gray-700 rounded-full p-1"
            >
              <MaterialCommunityIcons
                onPress={handleUpdateProfilePicture}
                name="image-edit-outline"
                color="#FF7F50"
                size={20}
              />
            </TouchableOpacity> */}
          </View>
          <Text className="text-white text-base font-mPbold mt-2">
            {isLoading || isLoadingForName
              ? "Loading..."
              : user?.displayName || "No name found"}
          </Text>
          <Text className="text-white text-xs font-mPregular">
            {isLoading
              ? "Loading..."
              : `${user?.email}${user?.emailVerified ? " ✅" : " ❌"}`}
          </Text>
          {!user?.emailVerified && (
            <CustomButton
              title={isLoadingForEmailVerify ? "Loading..." : "Verify Email"}
              containerStyle="px-4 py-1 rounded-full mt-3 active:bg-red-600"
              textStyle="text-white text-xs uppercase"
              handlePress={handleVerifyEmail}
            />
          )}
        </View>
        <View className="w-full">
          <CustomInpurField
            label="Full Name"
            containerStyle="mt-5"
            inputFieldContainerStyle="flex-1"
            inputFieldStyle="focus:!border-secondary"
            GroupedButton={({ cbFn }) => (
              <CustomButton
                title="Update"
                containerStyle="justify-center items-center px-2 rounded-none active:bg-red-600"
                textStyle="text-white text-xs uppercase"
                handlePress={() => {
                  cbFn().then(async (value) => {
                    await handleUpdateFullName(value);
                  });
                }}
              />
            )}
          />
        </View>
      </>
    );
  };

  return (
    // <ScreenLayout>
    <View className="bg-primary flex-1 items-center">
      <View className="w-full flex-1">
        <FlashList
          data={items}
          estimatedItemSize={10}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingTop: 10,
          }}
          ListHeaderComponent={listHeaderComponent}
          keyExtractor={(_, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
              colors={["#FF7F50"]}
            />
          }
        />
      </View>
    </View>
    // </ScreenLayout>
  );
};

export default memo(Profile);
