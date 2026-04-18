import { StyleSheet } from 'react-native';
import Colors from './color';

export const styles = StyleSheet.create({
  container: { flex: 1 },

  back: { margin: 12 },   

  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Colors.primary,        
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    color: Colors.text_primary,
  },
  edit: {
    fontSize: 14,
    color: Colors.primary,                
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
    color: Colors.text_primary,
  },

  section: {
    marginTop: 5,
    marginLeft: 20,
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 18,
    marginTop: 10,
    padding: 15,
    borderRadius: 15,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,    
    shadowColor: Colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    color: Colors.text_primary,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: Colors.text_secondary,
    marginTop: 2,
  },

  //  MODAL 
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26,26,46,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.surface_strong,
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: Colors.primary,          
    elevation: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.text_primary,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: Colors.primary + '88',   
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: Colors.text_primary,
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
  btnCancel: {
    backgroundColor: 'rgba(26,26,46,0.08)',
  },
  btnSave: {
    backgroundColor: Colors.primary,     
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnTextCancel: {
    color: Colors.text_secondary,
    fontWeight: '600',
  },
  btnTextSave: {
    color: Colors.text_primary,          
    fontWeight: 'bold',
  },
});
