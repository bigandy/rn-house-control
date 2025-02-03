import { fetchUrl } from "@/constants/Urls";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Favorite = {
  url: string;
  name: string;
  image: string;
  id: string;
};

const Favorites = ({
  updateStatus,
}: {
  updateStatus: (newStatus: boolean) => void;
}) => {
  const [selectedFavoriteId, setSelectedFavoriteId] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFavorites = async () => {
      const response = await fetch(
        fetchUrl("api/music/bluesound/getFavorites")
      );
      const responseJson = await response.json();

      const {
        data: { favorites },
      } = responseJson;

      setFavorites(favorites);
    };

    getFavorites();
  }, []);

  const handlePlayFavorite = async (favoriteId: string) => {
    try {
      setError(null);
      setSelectedFavoriteId(favoriteId);

      const response = await fetch(
        fetchUrl("api/music/bluesound/playFavorite"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: favoriteId,
          }),
        }
      );

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
          favorites.map((favorite: Favorite) => (
            <Pressable
              key={favorite.url}
              onPress={() => handlePlayFavorite(favorite.id)}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor:
                    pressed || favorite.id === selectedFavoriteId
                      ? "orange"
                      : "green",
                },
              ]}
            >
              <Text>{favorite.name}</Text>
            </Pressable>
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
    // flexDirection: "column",
    // gap: 8,
    // flexGrow: 1,
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
    gap: 10,
  },
  button: {
    width: "47%",
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
