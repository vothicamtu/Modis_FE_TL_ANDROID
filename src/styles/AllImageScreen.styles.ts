import { StyleSheet } from 'react-native';
import Colors from "./color";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4ff',
  },
  topBarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Colors.surface_strong,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(159,165,174,0.25)',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    zIndex: 5,
    pointerEvents: 'none',
  },
  listContent: {
    paddingBottom: 110,
  },
  textPrimary:   { color: Colors.text_primary },
  textSecondary: { color: Colors.text_secondary },
  textHint:      { color: Colors.text_hint },
  accentButton: {
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 8,
  },
});
