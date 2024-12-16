import React, { useEffect, useState } from "react";
import MapView, {
  MapOverlay,
  Overlay,
  PROVIDER_GOOGLE,
  Region,
  UrlTile,
  WMSTile,
} from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const mapName = "keax_sr_bref";

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [region, setRegion] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  const [tiles, setTiles] = useState<
    [[number, number, number, number], string][]
  >([]);

  useEffect(() => {
    console.log("init");
    async function getCurrentLocation() {
      console.log("get status");
      console.log(
        "get status",
        await Location.requestForegroundPermissionsAsync(),
      );

      // Location.requestForegroundPermissionsAsync().then(console.log);
      // const { status } = await Location.requestForegroundPermissionsAsync();
      // console.log("status", status);
      // if (status !== "granted") {
      //   console.warn("Permission to access location was denied");
      //   return;
      // }
      // console.log("get loc");
      console.log("a");
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Balanced,
      });
      console.log("b", location);
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      });
    }

    getCurrentLocation();
  }, []);

  const bbox = React.useMemo(() => {
    return bboxToEPSG3857(
      region.latitude - region.latitudeDelta / 2,
      region.longitude - region.longitudeDelta / 2,
      region.latitude + region.latitudeDelta / 2,
      region.longitude + region.longitudeDelta / 2,
    );
  }, [region]);

  useEffect(() => {
    const newTiles: [[number, number, number, number], string][] = [];

    const tileSize = 512;
    const zoomLevel = Math.round(
      Math.log2(40075016.68557849 / (region.latitudeDelta * 111320)),
    );

    for (let x = 0; x < Math.ceil(40075016.68557849 / tileSize); x++) {
      for (let y = 0; y < Math.ceil(40075016.68557849 / tileSize); y++) {
        const tileUrl = `https://opengeo.ncep.noaa.gov/geoserver/${mapName.split("_").at(0)}/${mapName}/ows?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&TILES=true&LAYERS=${mapName}&WIDTH=${tileSize}&HEIGHT=${tileSize}&SRS=EPSG:3857&BBOX=${x * tileSize},${y * tileSize},${(x + 1) * tileSize},${(y + 1) * tileSize}&TIME=${new Date().toISOString()}`;
        const tileBbox: [number, number, number, number] = [
          x * tileSize,
          y * tileSize,
          (x + 1) * tileSize,
          (y + 1) * tileSize,
        ];
        newTiles.push([tileBbox, tileUrl]);
      }
    }

    console.log("new tile", newTiles);

    setTiles(newTiles);
  }, [region]);

  // const tileUrlString = React.useMemo(() => {
  //   // const mapName = "conus_bref_qcd";

  //   const tileUrl = new URL(
  //     `/geoserver/${mapName.split("_").at(0)}/${mapName}/ows`,
  //     "https://opengeo.ncep.noaa.gov/",
  //   );
  //   tileUrl.searchParams.append("REQUEST", "GetMap");
  //   tileUrl.searchParams.append("SERVICE", "WMS");
  //   tileUrl.searchParams.append("VERSION", "1.1.1");
  //   tileUrl.searchParams.append("FORMAT", "image/png");
  //   tileUrl.searchParams.append("TRANSPARENT", "true");
  //   tileUrl.searchParams.append("TILES", "true");
  //   tileUrl.searchParams.append("LAYERS", mapName);
  //   const currentTime = new Date().toISOString();
  //   tileUrl.searchParams.append("TIME", currentTime);
  //   tileUrl.searchParams.append("WIDTH", "512");
  //   tileUrl.searchParams.append("HEIGHT", "512");
  //   tileUrl.searchParams.append("SRS", "EPSG:3857");
  //   tileUrl.searchParams.append(
  //     "BBOX",
  //     `${bbox.minX},${bbox.minY},${bbox.maxX},${bbox.maxY}`,
  //   );

  //   return tileUrl.toString().replaceAll("%7B", "{").replaceAll("%7D", "}");
  // }, [bbox]);

  // console.log("locl", location);

  // if (!location) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }
  //
  console.log(tiles);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        userInterfaceStyle={"dark"}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={true}
        rotateEnabled={false}
        mapType="standard"
        // mapType="none"
        // onUserLocationChange={(userLocationChangeEvent) => {
        //   console.log("cahnge", userLocationChangeEvent);
        //   const coordinates = {
        //     latitude:
        //       userLocationChangeEvent.nativeEvent.coordinate?.latitude ?? 0,
        //     longitude:
        //       userLocationChangeEvent.nativeEvent.coordinate?.longitude ?? 0,
        //     latitudeDelta: 0.04, //change this
        //     longitudeDelta: 0.05, //change this
        //   };
        //   setRegion(coordinates);
        // }}
        onRegionChangeComplete={(newRegion) => {
          console.log("new", newRegion);
          if (
            Math.abs(newRegion.latitude - region.latitude) >= 0.01 ||
            Math.abs(newRegion.longitude - region.longitude) >= 0.01 ||
            Math.abs(newRegion.latitudeDelta - region.latitudeDelta) >= 0.01 ||
            Math.abs(newRegion.longitudeDelta - region.longitudeDelta) >= 0.01
          ) {
            console.log("save");
            setRegion(newRegion);
          }
        }}
        minZoomLevel={0}
        maxZoomLevel={10}
      >
        {/* <UrlTile urlTemplate={tileUrlString} zIndex={1} /> */}
        {/* <MapOverlay
          image={{ uri: tileUrlString }}
          bounds={[
            [
              region.latitude - region.latitudeDelta / 2,
              region.longitude - region.longitudeDelta / 2,
            ],
            [
              region.latitude + region.latitudeDelta / 2,
              region.longitude + region.longitudeDelta / 2,
            ],
          ]}
          opacity={0.5}
        /> */}
        {tiles.map((tile) => (
          <MapOverlay
            // image={{ uri: tile[1] }}
            image={{ uri: "https://picsum.photos/200" }}
            bounds={[
              [
                region.latitude - region.latitudeDelta / 2,
                region.longitude - region.longitudeDelta / 2,
              ],
              [
                region.latitude + region.latitudeDelta / 2,
                region.longitude + region.longitudeDelta / 2,
              ],
            ]}
            opacity={0.5}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
});

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
