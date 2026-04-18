import { StyleSheet } from "react-native";
import Colors from "./color";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 220,
    height: 220,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.text_primary,
    marginTop: 0,
    letterSpacing: -1,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text_primary,
    textAlign: 'center',
    lineHeight: 28,
  },
  subTagline: {
    fontSize: 16,
    color: Colors.text_secondary,
    textAlign: 'center',
    marginTop: 6,
  },

  buttonContainer: {
    width: '100%',
    gap: 14,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 7,
  },
  buttonSecondary: {
    backgroundColor: Colors.surface_strong,
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonTextPrimary: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text_primary,
    letterSpacing: 0.2,
  },
  buttonTextSecondary: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.secondary_dark,
    letterSpacing: 0.2,
  },
});