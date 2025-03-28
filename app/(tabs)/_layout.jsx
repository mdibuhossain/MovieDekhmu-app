import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "../../constants";

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
  const TabsData = [
    { name: "home", title: "Home", header: false, icon: icons.home },
    { name: "explore", title: "Explore", header: false, icon: icons.compass },
    { name: "create", title: "Create", header: false, icon: icons.plus },
    { name: "bookmark", title: "Bookmark", header: false, icon: icons.bookmark },
    { name: "profile", title: "Profile", header: false, icon: icons.profile },
  ];

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
