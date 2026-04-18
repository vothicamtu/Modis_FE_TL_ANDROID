import { StyleSheet } from 'react-native';
import Colors from "./color";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
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
