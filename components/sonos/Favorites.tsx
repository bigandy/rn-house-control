import type { Room } from "@/constants/Types";
import { sonosApi, sonosPostApi } from "@/constants/Urls";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Favorite, { type Favorite as TFavorite } from "@/components/Favorite";

const Favorites = ({ room }: { room: Room }) => {
  const [selectedFavoriteIndex, setSelectedFavoriteIndex] = useState<number>();
  const [favorites, setFavorites] = useState<TFavorite[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFavorites = async () => {
      const response = await sonosApi("getFavorites");
      const responseJson = await response.json();

      const {
        data: { formattedFavorites },
      } = responseJson;

      const newFavorites = formattedFavorites
        .filter(({ title }: { title: string }) => title !== "Xmas In Frisko")
        .map((favorite: TFavorite) => {
          return {
            ...favorite,
          };
        });

      setFavorites(newFavorites);
    };

    getFavorites();
  }, []);

  const handlePlayFavorite = useCallback(
    async (index: number) => {
      setSelectedFavoriteIndex(index);

      // find the favorite
      const favorite = favorites[index];

      try {
        setError(null);
        const response = await sonosPostApi("playFavorite", {
          favorite,
          room,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to play favorite");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [room]
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {favorites?.length > 0 ? (
          favorites.map((favorite, index) => {
            return (
              <Favorite
                favorite={favorite}
                handlePlayFavorite={handlePlayFavorite}
                index={index}
                key={`favorite-${index}`}
                selected={selectedFavoriteIndex === index}
              />
            );
          })
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
