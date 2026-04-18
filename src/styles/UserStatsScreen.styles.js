import { StyleSheet } from "react-native";
import { scale } from "../utils/scale";
import Colors from "./color";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral_dark1,
  },

  title: {
    color: Colors.neutral_light2,
    fontSize: scale(18),
    fontWeight: "bold",
    textAlign: "center",
  },

  updatedAt: {
    color: Colors.neutral_light1,
    fontSize: scale(12),
    textAlign: "center",
    marginBottom: scale(16),
  },

 // MAIN STATS 
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: Colors.neutral_dark2,
    width: "48%",
    borderRadius: scale(16),
    paddingVertical: scale(20),
    alignItems: "center",
  },

  icon: {
    fontSize: scale(26),
  },

  number: {
    color: Colors.white,
    fontSize: scale(28),
    fontWeight: "bold",
    marginTop: scale(6),
  },

  label: {
    color: Colors.neutral_light1,
    marginTop: scale(4),
    fontSize: scale(14),
  },

 // SMALL CARDS 
  smallCard: {
    backgroundColor: Colors.neutral_dark2,
    borderRadius: scale(12),
    padding: scale(16),
    marginTop: scale(16),
  },

  smallTitle: {
    color: Colors.neutral_light1,
    fontSize: scale(14),
  },

  smallNumber: {
    color: Colors.white,
    fontSize: scale(22),
    fontWeight: "bold",
    marginTop: scale(6),
  },

 // CHART 
  chart: {
    marginTop: scale(20),
    backgroundColor: Colors.neutral_dark2,
    borderRadius: scale(12),
    padding: scale(16),
  },

  chartTitle: {
    color: Colors.neutral_light1,
    marginBottom: scale(12),
    fontSize: scale(13),
  },

  barRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: scale(120),
  },

  barContainer: {
    alignItems: "center",
    width: scale(24),
  },

  barValue: {
    color: Colors.neutral_light1,
    fontSize: scale(11),
    marginBottom: scale(4),
  },

  bar: {
    width: scale(14),
    backgroundColor: Colors.accent_blue,
    borderRadius: scale(6),
  },

 // ENGAGEMENT 
  engagementCard: {
    marginTop: scale(20),
    backgroundColor: Colors.neutral_dark2,
    borderRadius: scale(12),
    padding: scale(16),
    alignItems: "center",
  },

  engagementTitle: {
    color: Colors.neutral_light1,
    fontSize: scale(14),
    marginBottom: scale(8),
  },

  engagementPercent: {
    color: Colors.neutral_light2,
    fontSize: scale(36),
    fontWeight: "bold",
  },

  engagementStatus: {
    color: Colors.white,
    fontSize: scale(16),
    marginBottom: scale(12),
  },

  progressBg: {
    width: "100%",  
    height: scale(8),
    backgroundColor: Colors.neutral_dark3,
    borderRadius: scale(8),
    overflow: "hidden",
    marginBottom: scale(8),
  },

  progressFill: {
    height: "100%",
    backgroundColor: Colors.accent_blue,
  },

  engagementDesc: {
    color: Colors.neutral_light1,
    fontSize: scale(12),
  },

 // ACTION 
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: scale(24),
    marginBottom: scale(24),
  },

  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  refreshIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: Colors.accent_blue,
    marginRight: scale(8),
  },

  refreshText: {
    color: Colors.neutral_light2,
    fontWeight: "600",
    fontSize: scale(15),
  },
});