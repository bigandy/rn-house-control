import { Pressable, Image, Text, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCallback, useEffect, useState } from "react";

const houseControlNextUrl = "http://192.168.1.120:3000";

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await fetch(
        houseControlNextUrl + "/api/music/sonos/getStatus"
      );
      const responseJson = await response.json();
      const {
        data: {
          state: { state: playingState },
        },
      } = responseJson;

      console.log({ playingState });
      setIsPlaying(playingState !== "stopped");
    };

    fetchStatus();
  }, []);

  const handlePlayMusic = useCallback(async () => {
    const response = await fetch(
      houseControlNextUrl + "/api/music/sonos/toggleRoom",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: "Bedroom",
        }),
      }
    );

    const data = await response.json();

    const newStatePlaying = data.data.state !== "stopped";

    setIsPlaying(newStatePlaying);
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      // headerImage={null}
    >
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handlePlayMusic}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? "rgb(210, 230, 255)" : "green",
            },
          ]}
        >
          <Text>{isPlaying ? "Stop Music" : "Play Music"}</Text>
        </Pressable>
        <Pressable
          onPress={handlePlayMusic}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? "rgb(210, 230, 255)" : "green",
            },
          ]}
        >
          <Text>{isPlaying ? "Stop Music" : "Play Music"}</Text>
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    padding: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
