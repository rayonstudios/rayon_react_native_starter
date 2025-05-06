# Simple script to make react-native-reanimated-skeleton work in expo
echo "Running postinstall script for react-native-reanimated-skeleton to support expo"

# Ensure the directory exists
if [ -d "./node_modules/react-native-reanimated-skeleton" ]; then
  # Replace react-native-linear-gradient with expo-linear-gradient
  # Replace LinearGradient import with { LinearGradient } in all files
  find ./node_modules/react-native-reanimated-skeleton -type f -exec sed -i '' -e 's/import LinearGradient/import { LinearGradient }/g' -e 's/react-native-linear-gradient/expo-linear-gradient/g' {} +

  echo "Postinstall script completed successfully."
else
  echo "Directory ./node_modules/react-native-reanimated-skeleton does not exist. Skipping postinstall script."
fi
