import { bluesoundApi, bluesoundPostApi } from "@/constants/Urls";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Favorite from "@/components/Favorite";

type TFavorite = {
  id: string;
  url: string;
  title: string;
};

const Favorites = ({
  updateStatus,
}: {
  updateStatus: (newStatus: boolean) => void;
}) => {
  const [selectedFavoriteIndex, setSelectedFavoriteIndex] = useState<number>();
  const [favorites, setFavorites] = useState<TFavorite[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFavorites = async () => {
      const response = await bluesoundApi("getFavorites");
      const responseJson = await response.json();

      const {
        data: { favorites },
      } = responseJson;

      setFavorites(favorites);
    };

    getFavorites();
  }, []);

  const handlePlayFavorite = async (index: number) => {
    try {
      setError(null);
      setSelectedFavoriteIndex(index);

      const id = favorites[index].id!;

      const response = await bluesoundPostApi("playFavorite", {
        id,
      });

      const data = await response.json();

      updateStatus(data.data.state === "stream");

      if (!data.success) {
        throw new Error(data.error || "Failed to play favorite");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {favorites.length > 0 ? (
          favorites.map((favorite: TFavorite, index: number) => (
            <Favorite
              key={favorite.url}
              handlePlayFavorite={handlePlayFavorite}
              favorite={favorite}
              index={index}
              selected={selectedFavoriteIndex === index}
            />
          ))
        ) : (
          <Text>No favorites found</Text>
        )}
      </View>
      {error && <Text>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default Favorites;
