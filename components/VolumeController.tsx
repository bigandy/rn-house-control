import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

const VolumeController = ({
  volume,
  handleVolumeChange,
}: {
  volume: number;
  handleVolumeChange: (newVolume: number) => void;
}) => {
  return (
    <View>
      <Text style={styles.volumeText}>{volume.toFixed(0)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#ff0000"
        maximumTrackTintColor="#000000"
        onSlidingComplete={handleVolumeChange}
        value={volume}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  volumeText: {
    paddingTop: 8,
    textAlign: "center",
  },
  slider: {
    height: 40,
    paddingBottom: 8,
  },
});

export default VolumeController;
