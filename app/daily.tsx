import {
  RefreshControl,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Navigation,
  Sun,
} from "lucide-react-native";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

const weatherDescriptions = {
  "0": {
    day: { description: "Sunny", Icon: Sun },
    night: { description: "Clear", Icon: Moon },
  },
  "1": {
    day: { description: "Mainly Sunny", Icon: Sun },
    night: { description: "Mainly Clear", Icon: Moon },
  },
  "2": {
    day: { description: "Partly Cloudy", Icon: CloudSun },
    night: { description: "Partly Cloudy", Icon: CloudMoon },
  },
  "3": {
    day: { description: "Cloudy", Icon: Cloud },
    night: { description: "Cloudy", Icon: Cloud },
  },
  "45": {
    day: { description: "Foggy", Icon: CloudFog },
    night: { description: "Foggy", Icon: CloudFog },
  },
  "48": {
    day: { description: "Rime Fog", Icon: CloudFog },
    night: { description: "Rime Fog", Icon: CloudFog },
  },
  "51": {
    day: { description: "Light Drizzle", Icon: CloudDrizzle },
    night: { description: "Light Drizzle", Icon: CloudDrizzle },
  },
  "53": {
    day: { description: "Drizzle", Icon: CloudDrizzle },
    night: { description: "Drizzle", Icon: CloudDrizzle },
  },
  "55": {
    day: { description: "Heavy Drizzle", Icon: CloudDrizzle },
    night: { description: "Heavy Drizzle", Icon: CloudDrizzle },
  },
  "56": {
    day: { description: "Light Freezing Drizzle", Icon: CloudSnow },
    night: { description: "Light Freezing Drizzle", Icon: CloudSnow },
  },
  "57": {
    day: { description: "Freezing Drizzle", Icon: CloudSnow },
    night: { description: "Freezing Drizzle", Icon: CloudSnow },
  },
  "61": {
    day: { description: "Light Rain", Icon: CloudRain },
    night: { description: "Light Rain", Icon: CloudRain },
  },
  "63": {
    day: { description: "Rain", Icon: CloudRain },
    night: { description: "Rain", Icon: CloudRain },
  },
  "65": {
    day: { description: "Heavy Rain", Icon: CloudRain },
    night: { description: "Heavy Rain", Icon: CloudRain },
  },
  "66": {
    day: { description: "Light Freezing Rain", Icon: CloudSnow },
    night: { description: "Light Freezing Rain", Icon: CloudSnow },
  },
  "67": {
    day: { description: "Freezing Rain", Icon: CloudSnow },
    night: { description: "Freezing Rain", Icon: CloudSnow },
  },
  "71": {
    day: { description: "Light Snow", Icon: CloudSnow },
    night: { description: "Light Snow", Icon: CloudSnow },
  },
  "73": {
    day: { description: "Snow", Icon: CloudSnow },
    night: { description: "Snow", Icon: CloudSnow },
  },
  "75": {
    day: { description: "Heavy Snow", Icon: CloudSnow },
    night: { description: "Heavy Snow", Icon: CloudSnow },
  },
  "77": {
    day: { description: "Snow Grains", Icon: CloudSnow },
    night: { description: "Snow Grains", Icon: CloudSnow },
  },
  "80": {
    day: { description: "Light Showers", Icon: CloudRain },
    night: { description: "Light Showers", Icon: CloudRain },
  },
  "81": {
    day: { description: "Showers", Icon: CloudRain },
    night: { description: "Showers", Icon: CloudRain },
  },
  "82": {
    day: { description: "Heavy Showers", Icon: CloudRain },
    night: { description: "Heavy Showers", Icon: CloudRain },
  },
  "85": {
    day: { description: "Light Snow Showers", Icon: CloudSnow },
    night: { description: "Light Snow Showers", Icon: CloudSnow },
  },
  "86": {
    day: { description: "Snow Showers", Icon: CloudSnow },
    night: { description: "Snow Showers", Icon: CloudSnow },
  },
  "95": {
    day: { description: "Thunderstorm", Icon: CloudLightning },
    night: { description: "Thunderstorm", Icon: CloudLightning },
  },
  "96": {
    day: { description: "Light Thunderstorms With Hail", Icon: CloudHail },
    night: {
      description: "Light Thunderstorms With Hail",
      Icon: CloudHail,
    },
  },
  "99": {
    day: { description: "Thunderstorm With Hail", Icon: CloudHail },
    night: { description: "Thunderstorm With Hail", Icon: CloudHail },
  },
} as Record<
  number,
  {
    day: { description: string; Icon: React.ComponentType<any> };
    night: { description: string; Icon: React.ComponentType<any> };
  }
>;

export default function Index() {
  let colorScheme = useColorScheme();

  const [refreshing, setRefresting] = useState(true);

  const [greeting, setGreeting] = useState("Good morning");
  const [data, setData] = useState<any>(null);
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    if (!refreshing) return;

    const now = new Date().getHours();
    if (now > 6 && now < 12) {
      setGreeting("Good morning");
    } else if (now >= 12 && now < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    const fetchData = async () => {
      try {
        const url = new URL("/v1/forecast", "https://api.open-meteo.com/");
        url.searchParams.set("latitude", "38.9822");
        url.searchParams.set("longitude", "-94.6708");
        url.searchParams.set(
          "current",
          "temperature_2m,precipitation,rain,showers,snowfall,weather_code",
        );
        url.searchParams.set(
          "hourly",
          "temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,wind_speed_10m,wind_gusts_10m",
        );
        url.searchParams.set(
          "daily",
          "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours",
        );
        url.searchParams.set("temperature_unit", "fahrenheit");
        url.searchParams.set("wind_speed_unit", "mph");
        url.searchParams.set("precipitation_unit", "inch");
        url.searchParams.set("timezone", "America/Chicago");
        url.searchParams.set("past_days", "3");
        url.searchParams.set("forecast_days", "14");
        const result = await (await fetch(url)).json();
        console.log("done", result);
        setData(result);
        const now = new Date(result.current.time).getHours();
        const day = now > 6 && now < 18;
        setIsDay(day);
        setRefresting(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [refreshing]);

  return (
    <View>
      <View
        style={{
          position: "fixed",
          top: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingBlock: 16,
          gap: 4,
          paddingInline: 16,
          backgroundColor: colorScheme === "light" ? "#eeeeff" : "#0f0f1f",
          borderBottomColor: colorScheme === "light" ? "#e5e5ff" : "#151533",
          borderBottomWidth: 1,
        }}
      >
        <Link href="../" replace relativeToDirectory>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                marginRight: 8,
                width: 36,
                textAlign: "center",
              }}
            >
              <ArrowLeft color="#aaaaff" />
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "#aaaaff",
              }}
            >
              Daily
            </Text>
          </View>
        </Link>
      </View>
      <ScrollView
        style={{
          backgroundColor: colorScheme === "light" ? "#eeeeff" : "#0f0f1f",
        }}
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefresting(true)}
          />
        }
      >
        <View>
          {Array((data?.daily?.temperature_2m_max.length ?? 2) - 2)
            .fill(0)
            .map((_, i) => {
              const idx = i + 2;
              const apparent_temperature = data?.daily?.temperature_2m_max[idx];
              const weather_code = data?.daily?.weather_code[idx];
              const timeFormatted = new Date(
                data?.daily?.time[idx],
              ).toLocaleDateString("en-US", {
                day: "numeric",
                weekday: "long",
              });
              const time = new Date(data?.daily?.time[idx] ?? Date.now());
              const isDay = time.getHours() > 6 && time.getHours() < 18;
              const WeatherIcon =
                weatherDescriptions[weather_code]?.[isDay ? "day" : "night"]
                  ?.Icon;
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    height: 64,
                    opacity: i <= 1 ? 0.2 : 1,
                    paddingInline: 16,
                    borderLeftColor:
                      colorScheme === "light" ? "#ccccff" : "#222244",
                    borderLeftWidth: i != 0 ? 1 : 0,
                  }}
                  key={idx}
                >
                  <Text
                    style={{
                      color: colorScheme === "light" ? "#000000" : "#ffffff",
                      flex: 1,
                    }}
                  >
                    {timeFormatted}
                  </Text>
                  {WeatherIcon ? (
                    <WeatherIcon
                      color={colorScheme === "light" ? "#000000" : "#ffffff"}
                    />
                  ) : (
                    <></>
                  )}
                  <Text
                    style={{
                      color: colorScheme === "light" ? "#000000" : "#ffffff",
                    }}
                  >
                    {Math.round(apparent_temperature)}°
                  </Text>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}
