import { Pressable, Text, StyleSheet } from "react-native";

export interface Favorite {
  url: string;
  title: string;
}

const Favorite = ({
  favorite,
  handlePlayFavorite,
  index,
  selected,
}: {
  favorite: Favorite;
  handlePlayFavorite: (index: number) => void;
  index: number;
  selected: boolean;
}) => {
  return (
    <Pressable
      onPress={() => handlePlayFavorite(index)}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: selected ? "rgb(210, 230, 255)" : "green",
          opacity: pressed ? 0.5 : 1,
        },
      ]}
    >
      <Text style={styles.buttonText}>{favorite.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flexBasis: "25%",
    flexGrow: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    // color: "white",
  },
});

export default Favorite;
