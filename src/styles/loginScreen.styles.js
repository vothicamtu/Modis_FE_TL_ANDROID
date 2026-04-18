import { StyleSheet } from "react-native";
import Colors from "./color";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: 8,
    padding: 4,
  },

  containerSignup: {
    flex: 1,
    paddingHorizontal: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
    color: Colors.text_primary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text_hint,
    marginBottom: 32,
    textAlign: 'center',
  },

  inputContainer: { marginBottom: 16 },

  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: Colors.text_secondary,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(137,212,255,0.5)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 26, // Bo tròn hơn giống trang react
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    fontSize: 15,
    color: Colors.text_primary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  buttonActive: {
    backgroundColor: Colors.primary,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(62,80,107,0.35)',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: Colors.text_primary,
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.3,
  },

  footer: { marginTop: 24, alignItems: 'center' },
  linkText: {
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 12,
    fontSize: 14,
  },

  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },

  card: {
    backgroundColor: Colors.surface_strong,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
});