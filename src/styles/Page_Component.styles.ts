import { StyleSheet } from "react-native";
import Colors from "../styles/color";

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // vẫn trong suốt để gradient thấy
    position: 'absolute',
    zIndex: 100,
    top: 35,
  },
  toggle_friends: {
    width: "85%",
    height: "10%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 50,
  },
  gray_circle_border: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderColor: Colors.primary,   // đổi viền hồng pastel chính
    borderWidth: 3,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});