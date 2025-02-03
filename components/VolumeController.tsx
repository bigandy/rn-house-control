import { View, Text } from "react-native";
// import { useState } from "react";
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
      <Text>Volume Controller Component: {volume}</Text>
      <Slider
        style={{ height: 50 }}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onSlidingComplete={handleVolumeChange}
        value={volume}
      />
    </View>
  );
};

export default VolumeController;
