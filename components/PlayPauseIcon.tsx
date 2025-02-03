import Svg, { Path } from "react-native-svg";

const PlayPauseIcon = ({
  isPlaying,
  size = 300,
}: {
  isPlaying: boolean;
  size?: number;
}) => {
  const playIcon = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";
  const pauseIcon =
    "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";

  const icon = isPlaying ? playIcon : pauseIcon;

  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Path d={icon} />
    </Svg>
  );
};

export default PlayPauseIcon;
