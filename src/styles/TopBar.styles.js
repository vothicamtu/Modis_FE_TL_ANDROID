import { StyleSheet } from 'react-native';
import Colors from "../styles/color";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 0,    // Đã có View padding bên ngoài
    paddingBottom: 12,
    width: '100%',
    zIndex: 10,
    backgroundColor: 'transparent', 
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconImage: {
    width: 26,
    height: 26,
  },

  filterButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 6,
    maxWidth: 140,
  },
  arrowDown: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },

  homeFriendsButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  box_friends: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeTextCount: {
    paddingLeft: 8,
    fontSize: 15,
    fontWeight: '700',
  },
  homeTextLabel: {
    paddingLeft: 4,
    fontWeight: '600',
    fontSize: 15,
  },

  mask: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 110,
  },
  dropdownBoard: {
    width: 280,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    height: 300,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  separator: {
    height: 1,
  },
});
