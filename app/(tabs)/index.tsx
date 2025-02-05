import { Platform, StyleSheet } from "react-native";
import { VolumeManager } from "react-native-volume-manager";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import SonosFavorites from "@/components/sonos/Favorites";
import VolumeController from "@/components/VolumeController";
import type { Room } from "@/constants/Types";
import { sonosApi } from "@/constants/Urls";
import { useCallback, useEffect, useState } from "react";

import PlayPauseButton from "@/components/PlayPauseButton";
import SonosRoomSelector from "@/components/sonos/RoomSelector";

const nonActiveState = ["paused", "stopped"];

export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room>("Bedroom");
  const [volume, setVolume] = useState(0);

  const getStatus = useCallback(async (room: Room) => {
    const response = await sonosApi(`getStatus?room=${room}`);
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
      await sonosApi("setVolume", {
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
    await sonosApi("toggleRoom", {
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
      <SonosRoomSelector
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
      />

      <PlayPauseButton
        isPlaying={isPlaying}
        handleToggleMusic={handleToggleMusic}
      />

      <VolumeController
        volume={volume}
        handleVolumeChange={handleVolumeChange}
      />

      <SonosFavorites room={selectedRoom} />
    </ParallaxScrollView>
  );
}
