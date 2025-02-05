import { StyleSheet, Pressable, Text, View } from "react-native";

import type { Room } from "@/constants/Types";

const rooms = [
  { id: "Bedroom", name: "Bedroom" },
  { id: "Blanc", name: "Kitchen" },
];

const RoomSelector = ({
  selectedRoom,
  setSelectedRoom,
}: {
  selectedRoom: Room;
  setSelectedRoom: (room: Room) => void;
}) => {
  return (
    <View style={styles.buttonContainer}>
      {rooms.map((room) => (
        <Pressable
          key={room.id}
          onPress={() => setSelectedRoom(room.id as Room)}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor:
                selectedRoom === room.id ? "rgb(210, 230, 255)" : "green",
              opacity: pressed ? 0.5 : 1,
            },
          ]}
        >
          <Text>{room.name}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    padding: 16,
  },
});

export default RoomSelector;
