import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    padding: 24, 
    backgroundColor: '#F9FAFB', // Màu nền xám nhạt hiện đại
  },
  
  header: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#111827',
    marginVertical: 24,
    textAlign: 'center',
  },

  // Container chứa Avatar + Nút Camera
  avatarContainer: { 
    position: 'relative', 
    marginBottom: 20,
    // Tạo bóng cho avatar
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  avatar: { 
    width: 130, 
    height: 130, 
    borderRadius: 65, 
    borderWidth: 4, 
    borderColor: '#FFF', // Viền trắng tạo cảm giác nổi
    backgroundColor: '#E5E7EB'
  },

  cameraIcon: {
    position: 'absolute', 
    bottom: 5, 
    right: 5,
    backgroundColor: '#2563EB', 
    padding: 8, 
    borderRadius: 20,
    borderWidth: 3, 
    borderColor: '#FFF', // Viền trắng tách biệt icon và avatar
    elevation: 4,
  },

  username: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1F2937', 
    marginBottom: 4 
  },

  subtext: { 
    fontSize: 14,
    color: '#6B7280', 
    marginBottom: 32,
    textAlign: 'center'
  },

  button: { 
    width: '100%', 
    paddingVertical: 6, 
    backgroundColor: '#2563EB',
    borderRadius: 12,
    elevation: 3,
  },
  
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  }
});