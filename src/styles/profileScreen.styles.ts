import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },

  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButtonModern: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderRadius: 22,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  edit: {
    fontSize: 14,
    marginTop: 4,
  },

  iinviteWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20,
    marginLeft: 10,
  },
  invite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inviteText: {
    fontSize: 16,
  },

  section: {
    marginTop: 5,
    marginLeft: 20,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 10,
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 3,
    shadowColor: '#000000', // Revert to working version - will fix with proper theme integration later
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    marginTop: 2,
  },

  //  MODAL 
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    elevation: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: {},
  btnSave: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnTextCancel: {
    fontWeight: '600',
  },
  btnTextSave: {
    fontWeight: 'bold',
  },
});
