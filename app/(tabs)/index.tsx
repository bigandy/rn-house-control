import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { VolumeManager } from "react-native-volume-manager";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import PlayPauseIcon from "@/components/PlayPauseIcon";
import VolumeController from "@/components/VolumeController";
import { useCallback, useEffect, useState } from "react";
import SonosFavorites from "@/components/sonos/Favorites";
import type { Room } from "@/constants/Types";
import { fetchUrl } from "@/constants/Urls";
const nonActiveState = ["paused", "stopped"];

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room>("Bedroom");
  const [volume, setVolume] = useState(0);

  const getStatus = useCallback(async (room: Room) => {
    const response = await fetch(
      fetchUrl(`api/music/sonos/getStatus?room=${room}`)
    );
    const responseJson = await response.json();
    const {
      data: {
        state: { state: playingState, volume },
      },
    } = responseJson;

    setVolume(volume);

    setIsPlaying(!nonActiveState.includes(playingState));
  }, []);

  const handleVolumeChange = useCallback(
    async (newVolume: number) => {
      await fetch(fetchUrl("/api/music/sonos/setVolume"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: selectedRoom,
          volume: newVolume,
        }),
      });

      setVolume(newVolume);
    },
    [selectedRoom]
  );

  useEffect(() => {
    const findStatus = async () => {
      await getStatus(selectedRoom);
    };

    findStatus();
  }, [selectedRoom]);

  useEffect(() => {
    VolumeManager.showNativeVolumeUI({ enabled: true });
  }, []);

  useEffect(() => {
    const volumeListener = VolumeManager.addVolumeListener((result) => {
      if (
        (Platform.OS === "android" && result.type === "music") ||
        Platform.OS === "ios"
      ) {
        console.log("Volume changed, updating state", result);
        handleVolumeChange(result.volume * 100);
      } else {
        console.log(
          "Volume changed, but not for type music, not updating state",
          result
        );
      }
    });

    return () => {
      volumeListener.remove();
    };
  }, []);

  const handleToggleMusic = useCallback(async () => {
    await fetch(fetchUrl("api/music/sonos/toggleRoom"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room: selectedRoom,
      }),
    });

    await getStatus(selectedRoom);
  }, [selectedRoom]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => setSelectedRoom("Bedroom")}
          style={({}) => [
            styles.button,
            {
              backgroundColor:
                selectedRoom === "Bedroom" ? "rgb(210, 230, 255)" : "green",
            },
          ]}
          disabled={selectedRoom === "Bedroom"}
        >
          <Text>Bedroom</Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedRoom("Blanc")}
          style={({}) => {
            return [
              styles.button,
              {
                backgroundColor:
                  selectedRoom === "Blanc" ? "rgb(210, 230, 255)" : "green",
              },
            ];
          }}
          disabled={selectedRoom === "Blanc"}
        >
          <Text>Kitchen</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.playPauseWrapper,
          {
            backgroundColor: pressed ? "orange" : "red",
          },
        ]}
        onPress={handleToggleMusic}
      >
        <PlayPauseIcon isPlaying={isPlaying} />
      </Pressable>

      <VolumeController
        volume={volume}
        handleVolumeChange={handleVolumeChange}
      />

      <SonosFavorites room={selectedRoom} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  playPauseWrapper: {
    alignItems: "center",
  },
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
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
  },
});
