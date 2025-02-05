import { View, Text } from "react-native";

// TODO: Make this a loading spinner
const LoadingIndicator = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

export default LoadingIndicator;
