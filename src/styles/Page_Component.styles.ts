import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    backgroundColor: 'transparent',
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
    borderWidth: 3,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
