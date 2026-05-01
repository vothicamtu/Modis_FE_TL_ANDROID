import { StyleSheet } from "react-native";

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
    textAlign: 'center',
    lineHeight: 28,
  },
  subTagline: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 6,
  },

  buttonContainer: {
    width: '100%',
    gap: 14,
  },
  buttonPrimary: {
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 7,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  buttonTextPrimary: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  buttonTextSecondary: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
