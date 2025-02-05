import { Text, StyleSheet } from "react-native";

const PageTitle = ({ title }: { title: string }) => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingBlock: 16,
  },
});
export default PageTitle;
