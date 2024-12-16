import {
  RefreshControl,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import {
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
      <View
        style={{
          position: "fixed",
          top: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingBlock: 4,
          paddingInline: 16,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            width: 32,
          }}
        >
          <CloudSun
            color={colorScheme === "light" ? "#aaaaff" : "#aaaaff"}
            size={24}
          />
        </Text>
        <View
          style={{
            flex: 1,
            backgroundColor: colorScheme === "light" ? "#e5e5ff" : "#151533",
            borderColor: colorScheme === "light" ? "#ccccff" : "#222244",
            borderWidth: 1,
            position: "sticky",
            margin: 10,
            paddingBlock: 8,
            paddingInline: 16,
            borderRadius: 10,
            top: 0,
          }}
        >
          <Link href="/location">
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text>
                <Navigation
                  color={colorScheme === "light" ? "#000000" : "#ffffff"}
                  size={16}
                />
              </Text>
              <Text
                style={{
                  color: colorScheme === "light" ? "#000000" : "#ffffff",
                }}
              >
                Overland Park, KS
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                <ChevronDown
                  color={colorScheme === "light" ? "#000000" : "#ffffff"}
                  size={16}
                />
              </Text>
            </View>
          </Link>
        </View>
        <View
          style={{
            width: 32,
            height: 32,
            backgroundColor: colorScheme === "light" ? "#aaaaff" : "#aaaaff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>D</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 128,
          paddingInline: 16,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            paddingInline: 24,
          }}
        >
          <Text
            style={{
              color: colorScheme === "light" ? "#aaaaff" : "#7777cc",
            }}
          >
            {greeting}, Drake!
          </Text>
          <Text
            style={{
              color: colorScheme === "light" ? "#aaaaff" : "#aaaaff",
              fontSize: 36,
              fontWeight: "bold",
            }}
          >
            It's {Math.round(data?.current?.temperature_2m ?? -1)}° and{" "}
            {weatherDescriptions[data?.current?.weather_code]?.[
              isDay ? "day" : "night"
            ]?.description?.toLowerCase()}
            .
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 32,
            paddingInline: 24,
            paddingBlock: 24,
            borderRadius: 20,
            gap: 16,
            backgroundColor: colorScheme === "light" ? "#e8e8ff" : "#1a1a2f",
          }}
        >
          <Link href="/hourly">
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colorScheme === "light" ? "#000000" : "#ffffff",
                  fontWeight: "bold",
                  fontSize: 18,
                  flex: 1,
                }}
              >
                Hourly
              </Text>
              {/* <Text style={{ width: 18 }}>
                <ChevronRight
                  color={colorScheme === "light" ? "#000000" : "#ffffff"}
                  size={24}
                />
              </Text> */}
            </View>
            <ScrollView
              horizontal
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 16,
                paddingBlock: 16,
              }}
              persistentScrollbar
            >
              {Array(9 + 3)
                .fill(0)
                .map((_, i) => {
                  const idx = 24 * 3 + (i - 2) + (new Date().getUTCHours() - 6);
                  const apparent_temperature =
                    data?.hourly?.temperature_2m[idx];
                  const weather_code = data?.hourly?.weather_code[idx];
                  const timeFormatted = new Date(
                    data?.hourly?.time[idx],
                  ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  });
                  const time = new Date(data?.hourly?.time[idx] ?? Date.now());
                  const isDay = time.getHours() > 6 && time.getHours() < 18;
                  const WeatherIcon =
                    weatherDescriptions[weather_code]?.[isDay ? "day" : "night"]
                      ?.Icon;
                  return (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        height: 128,
                        opacity: i <= 1 ? 0.2 : 1,
                        borderLeftColor:
                          colorScheme === "light" ? "#ccccff" : "#222244",
                        borderLeftWidth: i != 0 ? 1 : 0,
                        width: 64,
                      }}
                      key={idx}
                    >
                      <Text
                        style={{
                          color:
                            colorScheme === "light" ? "#000000" : "#ffffff",
                        }}
                      >
                        {timeFormatted}
                      </Text>
                      <View style={{ flex: 1 }} />
                      {WeatherIcon ? (
                        <WeatherIcon
                          color={
                            colorScheme === "light" ? "#000000" : "#ffffff"
                          }
                        />
                      ) : (
                        <></>
                      )}
                      <Text
                        style={{
                          color:
                            colorScheme === "light" ? "#000000" : "#ffffff",
                        }}
                      >
                        {Math.round(apparent_temperature)}°
                      </Text>
                    </View>
                  );
                })}
              <LinearGradient
                style={{
                  position: "absolute",
                  right: 100,
                  top: 0,
                  height: 200,
                  width: 200,
                }}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={[
                  "transparent",
                  colorScheme === "light" ? "#e8e8ff" : "#1a1a2f",
                ]}
              />
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  height: 200,
                  width: 100,
                  backgroundColor:
                    colorScheme === "light" ? "#e8e8ff" : "#1a1a2f",
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 128 / 2 - 16 / 2,
                  right: 16,
                  backgroundColor: "#aaaaff",
                  width: 128,
                  height: 32,
                  borderRadius: 100,
                }}
              >
                <Text style={{ textAlign: "center" }}>View More</Text>
                <Text style={{ textAlign: "center" }}>
                  <ChevronRight color="#000000" />
                </Text>
              </View>
            </ScrollView>
          </Link>
          <Link href="/daily">
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colorScheme === "light" ? "#000000" : "#ffffff",
                  fontWeight: "bold",
                  fontSize: 18,
                  flex: 1,
                }}
              >
                Daily
              </Text>
            </View>
            <ScrollView
              horizontal
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 16,
                paddingBlock: 16,
              }}
              persistentScrollbar
            >
              {Array(8 + 1)
                .fill(0)
                .map((_, i) => {
                  const idx = i + 3;
                  const apparent_temperature =
                    data?.daily?.temperature_2m_max[idx];
                  const weather_code = data?.daily?.weather_code[idx];
                  const timeFormatted = new Date(data?.daily?.time[idx])
                    .toLocaleTimeString("en-US", {
                      weekday: "short",
                    })
                    .split(" ")
                    .at(0);
                  const isDay = true;
                  const WeatherIcon =
                    weatherDescriptions[weather_code]?.[isDay ? "day" : "night"]
                      ?.Icon;
                  return (
                    <View
                      style={{
                        opacity: i <= 0 ? 0.2 : 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        height: 128,
                        borderLeftColor:
                          colorScheme === "light" ? "#ccccff" : "#222244",
                        borderLeftWidth: i != 0 ? 1 : 0,
                        width: 64,
                      }}
                      key={idx}
                    >
                      <Text
                        style={{
                          color:
                            colorScheme === "light" ? "#000000" : "#ffffff",
                        }}
                      >
                        {timeFormatted}
                      </Text>
                      <View style={{ flex: 1 }} />
                      {WeatherIcon ? (
                        <WeatherIcon
                          color={
                            colorScheme === "light" ? "#000000" : "#ffffff"
                          }
                        />
                      ) : (
                        <></>
                      )}
                      <Text
                        style={{
                          color:
                            colorScheme === "light" ? "#000000" : "#ffffff",
                        }}
                      >
                        {Math.round(apparent_temperature)}°
                      </Text>
                    </View>
                  );
                })}
              <LinearGradient
                style={{
                  position: "absolute",
                  right: 100,
                  top: 0,
                  height: 200,
                  width: 200,
                }}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={[
                  "transparent",
                  colorScheme === "light" ? "#e8e8ff" : "#1a1a2f",
                ]}
              />
              <View
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  height: 200,
                  width: 100,
                  backgroundColor:
                    colorScheme === "light" ? "#e8e8ff" : "#1a1a2f",
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 128 / 2 - 16 / 2,
                  right: 16,
                  backgroundColor: "#aaaaff",
                  width: 128,
                  height: 32,
                  borderRadius: 100,
                }}
              >
                <Text style={{ textAlign: "center" }}>View More</Text>
                <Text style={{ textAlign: "center" }}>
                  <ChevronRight color="#000000" />
                </Text>
              </View>
            </ScrollView>
          </Link>
          <View>
            <Link href="/radar">
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colorScheme === "light" ? "#000000" : "#ffffff",
                    fontWeight: "bold",
                    fontSize: 18,
                    flex: 1,
                  }}
                >
                  Radar
                </Text>
                <Text style={{ width: 18 }}>
                  <ChevronRight
                    color={colorScheme === "light" ? "#000000" : "#ffffff"}
                    size={24}
                  />
                </Text>
              </View>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
