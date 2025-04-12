import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { router, Tabs } from "expo-router";
import { icons } from "../../constants";
import { useSelector } from "react-redux";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Image
        source={icon}
        resizeMode="contain"
        // tintColor={color}
        className={`${focused ? "w-8 h-8" : "w-8 h-8"}`}
      />
      <Text
        style={{ color: color }}
        className={`${
          focused ? "font-[MavenPro-SemiBold]" : "font-[MavenPro-Regular]"
        } text-xs`}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const TabsData = [
    { name: "home", title: "Home", header: false, icon: icons.home, href: "home" },
    { name: "explore", title: "Explore", header: false, icon: icons.compass, href: null },
    { name: "create", title: "Create", header: false, icon: icons.plus, href: "create" },
    { name: "bookmark", title: "Bookmark", header: false, icon: icons.bookmark, href: null },
    { name: "profile", title: "Profile", header: false, icon: icons.profile, href: "profile" },
  ];

  useEffect(() => {
    if (!user) {
      router.replace("/sign-in");
    }
  }, [user]);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#B7B7B7",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 0,
            borderTopColor: "#232533",
            width: "100%",
            height: 60,
          },
          tabBarIconStyle: {
            width: "100%",
            height: "100%",
          },
        }}
      >
        {TabsData?.map((tabItem, index) => (
          <Tabs.Screen
            key={index}
            name={tabItem.name}
            options={{
              href: tabItem.href,
              title: tabItem.title,
              headerShown: tabItem.header,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={tabItem.icon}
                  name={tabItem.title}
                  color={color}
                  focused={focused}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
};

export default TabsLayout;
