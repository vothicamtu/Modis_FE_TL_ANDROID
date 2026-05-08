import { StyleSheet } from "react-native";

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
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 32,
    textAlign: 'center',
  },

  inputContainer: { marginBottom: 16 },

  label: {
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 26,
    fontSize: 15,
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
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  buttonActive: {},
  buttonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.3,
  },

  footer: { marginTop: 24, alignItems: 'center' },
  linkText: {
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
    borderRadius: 24,
    padding: 24,
    borderWidth: 0.5,
    shadowColor: '#000000', // Revert to working version
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
});
