import React, { useRef } from "react";
import CustomPage from "@/lib/components/Page";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomFilterBottomSheetModal from "@/lib/components/CustomBottomSheetModal";
import _debounce from "lodash.debounce";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { ButtonWithBorderRadius } from "@/lib/components/ButtonWithBorderRadius";

const SecondTab = () => {
  const primaryColor = useThemeColor({}, "primary");

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = () => {
    bottomSheetRef.current?.present();
  };

  return (
    <CustomPage>
      <CustomFilterBottomSheetModal ref={bottomSheetRef} />
      <View className="flex-1 justify-center items-center">
        <Text
          variant={"headlineLarge"}
          style={{
            color: primaryColor as string,
          }}
          className="font-bold text-center"
        >
          This is the second tab of the app
        </Text>
        <ButtonWithBorderRadius
          mode="contained"
          style={{
            marginTop: 16,
            backgroundColor: primaryColor,
          }}
          onPress={handlePresentModalPress}
        >
          Open Bottom Sheet
        </ButtonWithBorderRadius>
      </View>
    </CustomPage>
  );
};

export default SecondTab;
