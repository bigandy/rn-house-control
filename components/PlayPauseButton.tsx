import { Pressable, StyleSheet } from "react-native";

import PlayPauseIcon from "@/components/PlayPauseIcon";

const PlayPauseButton = ({
  isPlaying,
  handleToggleMusic,
}: {
  isPlaying: boolean;
  handleToggleMusic: () => void;
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.playPauseWrapper,
        {
          opacity: pressed ? 0.75 : 1,
        },
      ]}
      onPress={handleToggleMusic}
    >
      <PlayPauseIcon isPlaying={isPlaying} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  playPauseWrapper: {
    alignItems: "center",
    backgroundColor: "orange",
    // borderRadius: 50,
    // borderRadius: "100%",
    // borderWidth: 3,
    // borderColor: "black",
    // padding: 10,
  },
});

export default PlayPauseButton;
