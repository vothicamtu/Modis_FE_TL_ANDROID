import { StyleSheet } from "react-native";
import { scale } from "../utils/scale";
import Colors from "./color";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  safeAreaAbsolute: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 16,
    paddingBottom: scale(32),
  },
  headerBarModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 0,    // Đã có View padding bên ngoài
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  backButtonModern: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // HEADER - KHÔNG dùng hardcode Colors.text_primary/secondary
  // Dùng dynamic color từ useColors() trong component
  title: {
    fontSize: scale(18),
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    fontSize: scale(14),
    textAlign: "center",
    marginBottom: scale(12),
  },

  // SEARCH - KHÔNG dùng hardcode
  searchBox: {
    height: scale(48),
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    fontSize: scale(14),
    marginBottom: scale(10),
    borderWidth: 1,
  },

  // SECTION - KHÔNG dùng hardcode
  sectionTitle: {
    marginTop: scale(16),
    marginBottom: scale(6),
    fontSize: scale(15),
    fontWeight: "bold",
  },

  // FRIEND ITEM
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(10),
  },

  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    marginRight: scale(8),
    borderWidth: 2,
  },

  avatarSmall: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    marginRight: scale(8),
    borderWidth: 2,
  },

  name: {
    flex: 1,
    fontSize: scale(14),
  },

  icon: {
    width: scale(18),
    height: scale(18),
  },

  iconWrapper: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },

  requestActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },

  rejectBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: "center",
    alignItems: "center",
  },
  rejectIcon: {
    width: scale(16),
    height: scale(16),
  },

  // BUTTONS - KHÔNG dùng hardcode
  addBtn: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(8),
    marginRight: scale(12),
  },

  addText: {
    fontWeight: "bold",
    fontSize: scale(13),
  },

  // SHARE APP
  appRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: scale(12),
  },

  shareItem: {
    alignItems: "center",
  },

  shareIcon: {
    width: scale(32),
    height: scale(32),
    marginBottom: scale(4),
  },

  shareText: {
    fontSize: scale(14),
  },

  // INVITE
  appCol: {
    marginTop: scale(12),
  },

  inviteItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(12),
  },

  inviteIcon: {
    width: scale(32),
    height: scale(32),
  },

  inviteText: {
    fontSize: scale(16),
    marginLeft: scale(12),
  },

  username: {
    fontSize: 12,
    marginTop: 2,
  },
});