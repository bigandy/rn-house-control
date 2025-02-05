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
          backgroundColor: pressed ? "orange" : "red",
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
  },
});

export default PlayPauseButton;
