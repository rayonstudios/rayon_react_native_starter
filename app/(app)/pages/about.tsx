import { useCallback } from "react";
import CustomPage from "@/lib/components/Page";
import { useFocusEffect } from "expo-router";
import { useRootContextValues } from "@/lib/contexts/root.context";
import { Text } from "react-native-paper";

export default function About() {
  const { setHeaderOptions } = useRootContextValues();

  useFocusEffect(
    useCallback(() => {
      setHeaderOptions({
        title: "About",
        showBackButton: true,
      });
    }, [])
  );

  return (
    <CustomPage verticalPadding>
      <Text className="font-bold">
        This React Native Rayon starter is a starter which wires together
        utility-first styling with NativeWind, zero-config, type-safe API
        integration via openapi-fetch, and a suite of battle-tested, reusable UI
        components—all preconfigured in an Expo project. By eliminating the
        endless boilerplate of StyleSheets, manual fetch helpers, and homegrown
        component libraries, it gives you a rock-solid foundation so you can:
        {"\n"}
        {"\n"}- Spin up beautiful, responsive layouts with Tailwind-style
        classes out of the box.{"\n"}
        {"\n"}- Instantly call your backend with fully typed, schema-driven
        fetch clients—no hand-rolling request code or worrying about drift from
        your API spec.{"\n"}
        {"\n"}- Pick from common screens and hooks (lists, forms, headers,
        modals, loading/error states), all wired to theme and typography
        settings, so your team stays consistent and productive. With this
        starter in place, you bypass the grind of wiring together core tooling
        every time and jump straight into building the features that make your
        app unique.
        {"\n"}
        {"\n"}
      </Text>
    </CustomPage>
  );
}
