import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  let colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        // Hide the header for all other routes.
        headerShown: false,
        statusBarStyle: colorScheme === "light" ? "dark" : "light",
        statusBarBackgroundColor:
          colorScheme === "light" ? "#eeeeff" : "#0f0f1f",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="location"
        options={{
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen name="radar" />
    </Stack>
  );
}
