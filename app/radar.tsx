import * as Location from "expo-location";
import { Text, useColorScheme, View } from "react-native";
import { useEffect, useState } from "react";
import MapView, { Overlay, WMSTile } from "react-native-maps";
import { Link } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function RadarPage() {
  // const mapName = "keax_sr_bref";
  const mapName = "conus_bref_qcd";

  let colorScheme = useColorScheme();

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("No access Granted");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      });
    }
  }, [location]);

  if (!location) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // &WIDTH=${width}&HEIGHT={height}
  // const theURL = `https://opengeo.ncep.noaa.gov/geoserver/${mapName.split("_").at(0)}/${mapName}/ows?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&WIDTH=512&HEIGHT=512&TRANSPARENT=true&TILES=true&LAYERS=${mapName}&SRS=EPSG:3857&BBOX=${region.latitude - region.latitudeDelta / 2},${region.longitude - region.longitudeDelta / 2},${region.latitude + region.latitudeDelta / 2},${region.longitude + region.longitudeDelta / 2}&TIME=${new Date().toISOString()}`;
  const bbox = bboxToEPSG3857(
    region.latitude - region.latitudeDelta / 2,
    region.longitude - region.longitudeDelta / 2,
    region.latitude + region.latitudeDelta / 2,
    region.longitude + region.longitudeDelta / 2,
  );

  //              https://opengeo.ncep.noaa.gov/geoserver/conus                                    /conus_bref_qcd/ows?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&FORMAT=image%2Fpng&TRANSPARENT=true&TILES=true&LAYERS=conus_bref_qcd&TIME=2024-12-10T18%3A14%3A04.000Z&WIDTH=512&HEIGHT=512&SRS=EPSG%3A3857&BBOX=-15028131.257091936%2C0%2C-10018754.171394624%2C5009377.085697311
  const theURL = `https://opengeo.ncep.noaa.gov/geoserver/${mapName.split("_").at(0)}/${mapName}/ows?REQUEST=GetMap&SERVICE=WMS&VERSION=1.1.1&FORMAT=image%2Fpng&TRANSPARENT=true&TILES=true&LAYERS=${mapName}&TIME=${new Date().toISOString()}&WIDTH=${512}&HEIGHT=${512}&SRS=EPSG:3857&BBOX=${bbox.minX},${bbox.minY},${bbox.maxX},${bbox.maxY}`;
  console.log(theURL);

  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <View
        style={{
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
              Radar
            </Text>
          </View>
        </Link>
      </View>
      <MapView
        initialRegion={{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        }}
        onRegionChange={(region) => {
          setRegion(region);
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Overlay
          image={{
            uri: theURL,
            // uri: "https://picsum.photos/200/200",
            cache: "reload",
          }}
          opacity={0.5}
          bounds={[
            [
              region?.latitude - region?.latitudeDelta / 2,
              region?.longitude - region?.longitudeDelta / 2,
            ],
            [
              region?.latitude + region?.latitudeDelta / 2,
              region?.longitude + region?.longitudeDelta / 2,
            ],
          ]}
        />
      </MapView>
    </View>
  );
}

interface Point {
  x: number;
  y: number;
}

interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function toEPSG3857(lat: number, lon: number): Point {
  const R_MAJOR = 6378137.0;
  const R_MINOR = 6356752.314245179;
  const RATIO = R_MINOR / R_MAJOR;
  const ECCENT = Math.sqrt(1.0 - RATIO * RATIO);
  const COM = 0.5 * ECCENT;

  const x = R_MAJOR * toRadians(lon);

  const latRad = toRadians(lat);
  const ts =
    Math.tan(Math.PI / 4 - latRad / 2) /
    Math.pow(
      (1 - ECCENT * Math.sin(latRad)) / (1 + ECCENT * Math.sin(latRad)),
      COM,
    );
  const y = -R_MAJOR * Math.log(ts);

  return { x: x, y: y };
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function bboxToEPSG3857(
  minLat: number,
  minLon: number,
  maxLat: number,
  maxLon: number,
): BBox {
  const minPoint = toEPSG3857(minLat, minLon);
  const maxPoint = toEPSG3857(maxLat, maxLon);

  return {
    minX: minPoint.x,
    minY: minPoint.y,
    maxX: maxPoint.x,
    maxY: maxPoint.y,
  };
}
