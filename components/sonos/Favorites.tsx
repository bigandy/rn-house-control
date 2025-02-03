import { Fragment, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fetchUrl } from "@/constants/Urls";
import type { Room } from "@/constants/Types";

interface Favorite {
  url: string;
  title: string;
}

const Favorites = ({ room }: { room: Room }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFavorites = async () => {
      const response = await fetch(fetchUrl("api/music/sonos/getFavorites"));
      const responseJson = await response.json();

      const {
        data: { formattedFavorites },
      } = responseJson;

      const newFavorites = formattedFavorites
        .filter(({ title }: { title: string }) => title !== "Xmas In Frisko")
        .map((favorite: Favorite) => {
          return {
            ...favorite,
          };
        });

      setFavorites(newFavorites);
    };

    getFavorites();
  }, []);

  const handlePlayFavorite = async (favorite: {
    url: string;
    title: string;
  }) => {
    try {
      setError(null);
      const response = await fetch(fetchUrl("api/music/sonos/playFavorite"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favorite,
          room,
        }),
      });

      const data = await response.json();

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
        {favorites?.length > 0 ? (
          favorites.map((favorite, index) => (
            <Fragment>
              <Pressable
                key={`${favorite.url}-${index}`}
                onPress={() => handlePlayFavorite(favorite)}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: pressed ? "orange" : "green",
                  },
                ]}
              >
                <Text>{favorite.title}</Text>
              </Pressable>
            </Fragment>
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
    // backgroundColor: "purple",
    height: "100%",
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
    width: "47%",
    marginBottom: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
    padding: 20,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "bold",
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

export default Favorites;
