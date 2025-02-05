import { Platform } from "react-native";

import { VolumeManager } from "react-native-volume-manager";

import SonosFavorites from "@/components/sonos/Favorites";
import VolumeController from "@/components/VolumeController";
import type { Room } from "@/constants/Types";
import { sonosApi, sonosPostApi } from "@/constants/Urls";
import { useCallback, useEffect, useState } from "react";

import PlayPauseButton from "@/components/PlayPauseButton";
import SonosRoomSelector from "@/components/sonos/RoomSelector";
import DefaultLayout from "@/layouts/DefaultLayout";

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
      await sonosPostApi("setVolume", {
        room: selectedRoom,
        volume: newVolume,
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
    await sonosPostApi("toggleRoom", {
      room: selectedRoom,
    });

    await getStatus(selectedRoom);
  }, [selectedRoom]);

  return (
    <DefaultLayout title="Sonos">
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
    </DefaultLayout>
  );
}
