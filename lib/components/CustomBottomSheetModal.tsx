import { View } from "react-native";
import React, { forwardRef, useCallback, useState } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Divider, Icon, ToggleButton, Text } from "react-native-paper";
import { useThemeColor } from "../hooks/useThemeColor";

export type Ref = BottomSheetModal;

const CustomFilterBottomSheetModal = forwardRef<Ref>((props, ref) => {
  const backgroundColor = useThemeColor({}, "background") as string;
  const [currentFilterValue, setCurrentFilterValue] = useState<string>("");

  const handleSortByChange = useCallback((value: any) => {
    setCurrentFilterValue(value);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor }}
    >
      <BottomSheetView
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: "relative",
          padding: 24,
          width: "100%",
          gap: 24,
        }}
      >
        {/* Filters section */}
        <View className="w-full flex-col gap-3">
          <Text variant="labelMedium">Here you can implement filters</Text>
          <ToggleButton.Group
            onValueChange={handleSortByChange}
            value={currentFilterValue}
          >
            <ToggleButton
              icon={() => (
                <CustomTextButtonWithCheckedIcon
                  label="Filter 1"
                  checked={currentFilterValue === "filter1"}
                />
              )}
              value="filter1"
              style={{ width: "100%" }}
            />
            <ToggleButton
              icon={() => (
                <CustomTextButtonWithCheckedIcon
                  label="Filter 2"
                  checked={currentFilterValue === "filter2"}
                />
              )}
              value="filter2"
              style={{ width: "100%" }}
            />
          </ToggleButton.Group>
        </View>

        {/* Divider */}
        <View className="w-[92%] mx-auto">
          <Divider bold />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default CustomFilterBottomSheetModal;

type Props = {
  label: string;
  checked?: boolean;
};

const CustomTextButtonWithCheckedIcon = ({ label, checked }: Props) => {
  return (
    <View
      style={{
        width: "95%",
        padding: 12,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 24,
      }}
    >
      <Text style={{ width: "100%" }}>{label}</Text>
      {checked && <Icon size={20} source={"check"} />}
    </View>
  );
};
