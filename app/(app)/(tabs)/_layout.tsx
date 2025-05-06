import React, { useCallback } from "react";
import { BottomNavigation, BottomNavigationRoute } from "react-native-paper";
import FirstTab from "./first-tab";
import SecondTab from "./second-tab";
import ThirdTab from "./third-tab";
import { useRootContextValues } from "@/lib/contexts/root.context";
import { useFocusEffect } from "expo-router";

export default function TabsLayout() {
  const { setHeaderOptions } = useRootContextValues();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "tab-1",
      title: "Tab 1",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "tab-2",
      title: "Tab 2",
      focusedIcon: "compass",
      unfocusedIcon: "compass-outline",
    },
    {
      key: "tab-3",
      title: "Tab 3",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  const renderScene = ({ route }: { route: BottomNavigationRoute }) => {
    switch (route.key) {
      case "tab-1":
        return <FirstTab />;
      case "tab-2":
        return <SecondTab />;
      case "tab-3":
        return <ThirdTab />;
      default:
        return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      switch (index) {
        case 0:
          setHeaderOptions({ title: "First tab", showBackButton: false });
          break;
        case 1:
          setHeaderOptions({ title: "Second tab", showBackButton: false });
          break;
        case 2:
          setHeaderOptions({ title: "Third tab", showBackButton: false });
          break;
      }
    }, [index])
  );

  return (
    <>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={(newIndex) => {
          setIndex(newIndex);
        }}
        renderScene={renderScene}
        sceneAnimationEnabled
      />
    </>
  );
}
