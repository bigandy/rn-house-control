import { Pressable, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { IconSymbol } from "@/components/ui/IconSymbol";
import BluesoundFavorites from "@/components/bluesound/Favorites";
// import { VolumeController } from "@/components/VolumeController";
import PlayPauseIcon from "@/components/PlayPauseIcon";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { fetchUrl } from "@/constants/Urls";
import VolumeController from "@/components/VolumeController";

export default function BluesoundPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  const getStatus = useCallback(async () => {
    const response = await fetch(fetchUrl("api/music/bluesound/getStatus"));
    const responseJson = await response.json();

    const {
      data: { isPlaying, volume },
    } = responseJson;

    setVolume(volume);

    setIsPlaying(isPlaying);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      await getStatus();
      setIsLoading(false);
    };

    fetchStatus();
  }, []);

  const handleToggleMusic = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch(fetchUrl("api/music/bluesound/toggleRoom"));

      const data = await response.json();

      await getStatus();

      if (!data.success) {
        throw new Error(data.error || "Failed to play music");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = useCallback((status: boolean) => {
    setIsPlaying(status);
  }, []);

  const handleVolumeChange = async (volume: number) => {
    // const newVolume = Number(volume);
    setVolume(volume);

    try {
      setError(null);
      const response = await fetch(fetchUrl("api/music/bluesound/setVolume"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          volume,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to play music");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
    >
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

      <BluesoundFavorites updateStatus={updateStatus} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },

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
