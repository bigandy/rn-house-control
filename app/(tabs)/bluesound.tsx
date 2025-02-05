import { Text } from "react-native";

import BluesoundFavorites from "@/components/bluesound/Favorites";
import LoadingIndicator from "@/components/LoadingIndicator";
import PlayPauseButton from "@/components/PlayPauseButton";
import VolumeController from "@/components/VolumeController";
import { bluesoundApi, bluesoundPostApi } from "@/constants/Urls";
import { useCallback, useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function BluesoundPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  const getStatus = useCallback(async () => {
    const response = await bluesoundApi("getStatus");
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
      const response = await bluesoundApi("toggleRoom");

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
      const response = await bluesoundPostApi("setVolume", {
        volume,
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
    <DefaultLayout title="Bluesound">
      {isLoading && <LoadingIndicator />}
      {error && <Text>{error}</Text>}

      <PlayPauseButton
        isPlaying={isPlaying}
        handleToggleMusic={handleToggleMusic}
      />

      <VolumeController
        volume={volume}
        handleVolumeChange={handleVolumeChange}
      />

      <BluesoundFavorites updateStatus={updateStatus} />
    </DefaultLayout>
  );
}
