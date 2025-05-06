import { Appearance, View } from "react-native";
import { ICustomViewStyle } from "react-native-reanimated-skeleton";
import { Colors } from "./Colors";

export const defaultSkeleton: ICustomViewStyle = {
  width: "100%",
  height: 50,
  borderRadius: 5,
  marginBottom: 10,
};

export const generateFeedCardSkeleton: () => ICustomViewStyle = () => {
  const colorScheme = Appearance.getColorScheme();
  const background =
    colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
  return {
    width: "100%",
    padding: 18,
    flexDirection: "column",
    gap: 8,
    marginBottom: 24,
    backgroundColor: background,
    children: [
      {
        flexDirection: "row",
        justifyContent: "space-between",
        children: [
          {
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            children: [
              {
                borderRadius: "100%",
                height: 50,
                width: 50,
                marginRight: 12,
              },
              {
                flexDirection: "column",
                gap: 12,
                children: [
                  {
                    width: 80,
                    height: 16,
                  },
                  {
                    width: 40,
                    height: 16,
                  },
                ],
              },
            ],
          },
          {
            width: 30,
            height: 20,
          },
        ],
      },
      {
        flexDirection: "column",
        gap: 8,
        children: [
          {
            marginTop: 8,
            borderRadius: 6,
            height: 16,
            width: "50%",
          },
          {
            borderRadius: 6,
            height: 30,
            width: "100%",
          },
          {
            marginTop: 12,
            borderRadius: 6,
            height: 20,
            width: "30%",
          },
        ],
      },
    ],
  };
};

export const generateCompanyCardSkeleton: () => ICustomViewStyle = () => {
  const colorScheme = Appearance.getColorScheme();
  const background =
    colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
  return {
    width: "100%",
    padding: 8,
    flexDirection: "column",
    marginBottom: 18,
    backgroundColor: background,
    children: [
      {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        children: [
          {
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            children: [
              {
                borderRadius: "100%",
                height: 50,
                width: 50,
                marginRight: 12,
              },
              {
                flexDirection: "column",
                gap: 12,
                children: [
                  {
                    width: 100,
                    height: 16,
                  },
                  {
                    width: 50,
                    height: 16,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};

export const generateDocumentCardSkeleton: () => ICustomViewStyle = () => {
  const colorScheme = Appearance.getColorScheme();
  const background =
    colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
  return {
    width: "100%",
    paddingVertical: 16,
    flexDirection: "column",
    gap: 8,
    marginBottom: 24,
    backgroundColor: background,
    children: [
      {
        flexDirection: "row",
        justifyContent: "space-between",
        children: [
          {
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            marginLeft: 8,
            children: [
              {
                borderRadius: "100%",
                height: 50,
                width: 50,
                marginRight: 12,
              },
              {
                flexDirection: "column",
                gap: 12,
                children: [
                  {
                    width: 80,
                    height: 16,
                  },
                  {
                    width: 40,
                    height: 16,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        flexDirection: "column",
        gap: 12,
        children: [
          {
            marginTop: 8,
            borderRadius: 6,
            height: 200,
            width: "100%",
          },
          {
            borderRadius: 6,
            height: 20,
            width: "50%",
          },
          {
            borderRadius: 6,
            height: 40,
            width: "100%",
          },
        ],
      },
    ],
  };
};

export const generateCompanyOverviewSkeleton: () => ICustomViewStyle = () => {
  const colorScheme = Appearance.getColorScheme();
  const background =
    colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
  return {
    width: "100%",
    flexDirection: "column",
    gap: 16,
    marginBottom: 24,
    backgroundColor: background,
    children: [
      {
        flexDirection: "column",
        gap: 8,
        children: [
          {
            marginTop: 8,
            borderRadius: 8,
            height: 200,
            width: "100%",
          },
          {
            borderRadius: 8,
            height: 80,
            width: "100%",
          },
          {
            borderRadius: 8,
            height: 80,
            width: "100%",
          },
          {
            borderRadius: 8,
            height: 80,
            width: "100%",
          },
        ],
      },
    ],
  };
};
