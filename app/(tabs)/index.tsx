import { Pressable, Text, StyleSheet, View, Platform } from "react-native";
import {
  VolumeManager,
  type RingerSilentStatus,
} from "react-native-volume-manager";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useCallback, useEffect, useState } from "react";
import PlayPauseButton from "@/components/PlayPauseButton";
import PlayPauseIcon from "@/components/PlayPauseIcon";
import VolumeController from "@/components/VolumeController";

const houseControlNextUrl = "http://192.168.1.120:3000";

type Room = "Blanc" | "Bedroom";
const nonActiveState = ["paused", "stopped"];

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room>("Bedroom");
  const [volume, setVolume] = useState(0);

  const [currentSystemVolume, setReportedSystemVolume] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean | undefined>();
  const [initialQuery, setInitialQuery] = useState<boolean | undefined>();
  const [ringerStatus, setRingerStatus] = useState<RingerSilentStatus>();
  const [hideUI, setHideUI] = useState<boolean>(false);

  const getStatus = useCallback(async (room: Room) => {
    const response = await fetch(
      `${houseControlNextUrl}/api/music/sonos/getStatus?room=${room}`
    );
    const responseJson = await response.json();
    const {
      data: {
        state: { state: playingState, volume },
      },
    } = responseJson;

    console.log({ volume });

    setVolume(volume);

    setIsPlaying(!nonActiveState.includes(playingState));
  }, []);

  const handleVolumeChange = useCallback(async (newVolume: number) => {
    await fetch(`${houseControlNextUrl}/api/music/sonos/setVolume`, {
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
    // const rzesponseJson = await response.json();
  }, []);

  useEffect(() => {
    const findStatus = async () => {
      await getStatus(selectedRoom);
    };

    findStatus();
  }, [selectedRoom]);

  useEffect(() => {
    VolumeManager.showNativeVolumeUI({ enabled: false });
  }, []);

  useEffect(() => {
    VolumeManager.getVolume().then((result) => {
      setReportedSystemVolume(result.volume);
      console.log("Read system volume", result);
    });

    const volumeListener = VolumeManager.addVolumeListener((result) => {
      // volumeChangedByListener.current = true;

      if (
        (Platform.OS === "android" && result.type === "music") ||
        Platform.OS === "ios"
      ) {
        setReportedSystemVolume(result.volume);
        console.log("Volume changed, updating state", result);
      } else {
        console.log(
          "Volume changed, but not for type music, not updating state",
          result
        );
      }
    });

    const silentListener = VolumeManager.addSilentListener((status) => {
      console.log(status);
      setIsMuted(status.isMuted);
      setInitialQuery(status.initialQuery);
    });

    const ringerListener = VolumeManager.addRingerListener((result) => {
      console.log("Ringer listener changed", result);
      setRingerStatus(result);
    });

    return () => {
      volumeListener.remove();
      silentListener.remove();
      VolumeManager.removeRingerListener(ringerListener);
    };
  }, []);

  const handleToggleMusic = useCallback(async () => {
    await fetch(houseControlNextUrl + "/api/music/sonos/toggleRoom", {
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
      // headerImage={() => {}}
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
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleToggleMusic}
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
          onPress={handleToggleMusic}
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  playPauseWrapper: {
    alignItems: "center",
    // backgroundColor: "red",
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
    // marginBottom: 8,
  },
});
