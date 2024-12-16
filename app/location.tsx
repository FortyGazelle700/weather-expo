import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import { Text, TextInput, useColorScheme, View } from "react-native";

export default function LocationModal() {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: colorScheme === "light" ? "#eeeeff" : "#0f0f1f",
        flex: 1,
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Link href="../" replace relativeToDirectory>
          <Text
            style={{
              fontSize: 24,
              marginRight: 8,
              width: 36,
              textAlign: "center",
            }}
          >
            <ArrowLeft
              color={colorScheme === "light" ? "#000000" : "#ffffff"}
            />
          </Text>
        </Link>
        <TextInput
          placeholder="Search Location by City or Address"
          placeholderTextColor={colorScheme === "light" ? "#333333" : "#aaaaaa"}
          autoFocus
          style={{
            backgroundColor: colorScheme === "light" ? "#e5e5ff" : "#151533",
            color: colorScheme === "light" ? "#000000" : "#ffffff",
            borderColor: colorScheme === "light" ? "#ccccff" : "#222244",
            borderWidth: 1,
            borderRadius: 10,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 12,
            paddingBottom: 12,
            flex: 1,
          }}
        />
      </View>
    </View>
  );
}
