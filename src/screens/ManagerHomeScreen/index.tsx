import React, { useEffect, useState } from 'react';
import {
  View, FlatList, StatusBar, Text as RNText, TouchableOpacity,
  Alert, ActivityIndicator, Modal, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useAppSelector } from '../../store/hooks';
import { getHomesByUserId, createHome, editHome, deleteHome } from './../../services/api/common';
import { styles } from './styles';
export function ManagerHomeScreen() {
  const user = useAppSelector(state => state.smartHome.auth.user);
  const [listHomes, setListHomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [homeNameInput, setHomeNameInput] = useState('');
  const [editingHome, setEditingHome] = useState<any>(null);

  useEffect(() => { fetchHomes(); }, [user?.USER_ID]);

  const fetchHomes = async () => {
    if (!user?.USER_ID) return;
    setLoading(true);
    try {
      const res = await getHomesByUserId(user.USER_ID);
      if (res.CODE === 1) setListHomes(res.DATA);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!homeNameInput.trim()) return Alert.alert("Thông báo", "Vui lòng nhập tên nhà");
    
    setSubmitting(true);
    try {
      let res;
      if (editingHome) {
        res = await editHome(editingHome.HOME_ID, user.USER_ID, homeNameInput);
      } else {
        res = await createHome(user.USER_ID, homeNameInput);
      }

      if (res.data.CODE === 1) {
        setModalVisible(false);
        fetchHomes();
      } else {
        Alert.alert("Lỗi", res.data.MESSAGE_VI);
      }
    } catch (e) { 
      Alert.alert("Lỗi", "Kết nối máy chủ thất bại"); 
    } finally {
      setSubmitting(false);
    }
  };

  const renderHomeItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardIconBox}>
        <MaterialIcons name="home-work" size={24} color="#2563EB" />
      </View>
      
      <View style={{ flex: 1, marginLeft: 12 }}>
        <RNText style={styles.cardTitle}>{item.HOME_NAME}</RNText>
        <RNText style={styles.cardSub}>Mã số: #{item.HOME_ID}</RNText>
      </View>

      <View style={styles.actionGroup}>
        <TouchableOpacity 
          onPress={() => { setEditingHome(item); setHomeNameInput(item.HOME_NAME); setModalVisible(true); }}
          style={styles.iconBtn}
        >
          <MaterialIcons name="edit" size={20} color="#4B5563" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            Alert.alert("Xác nhận", `Xóa "${item.HOME_NAME}"?`, [
              { text: "Hủy" },
              { text: "Xóa", style: "destructive", onPress: () => deleteHome(item.HOME_ID, user.USER_ID).then(fetchHomes) }
            ]);
          }}
          style={[styles.iconBtn, { backgroundColor: '#FEE2E2' }]}
        >
          <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <RNText style={styles.headerTitle}>Danh sách nhà</RNText>
        <TouchableOpacity 
          onPress={() => { setEditingHome(null); setHomeNameInput(''); setModalVisible(true); }} 
          style={styles.addBtn}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
          <RNText style={styles.addBtnText}>Thêm mới</RNText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listHomes}
        keyExtractor={(item) => item.HOME_ID.toString()}
        renderItem={renderHomeItem}
        contentContainerStyle={{ padding: 16 }}
        refreshing={loading}
        onRefresh={fetchHomes}
        ListEmptyComponent={!loading && <RNText style={styles.emptyText}>Chưa có dữ liệu nhà</RNText>}
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
            <Pressable style={styles.sheetContent} onPress={e => e.stopPropagation()}>
              <View style={styles.sheetHandle} />
              <RNText style={styles.sheetTitle}>{editingHome ? "Chỉnh sửa tên nhà" : "Tạo không gian mới"}</RNText>
              
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: Nhà riêng, Văn phòng..."
                value={homeNameInput}
                onChangeText={setHomeNameInput}
                placeholderTextColor="#9CA3AF"
              />

              <TouchableOpacity 
                disabled={submitting}
                onPress={handleSubmit} 
                style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
              >
                {submitting ? <ActivityIndicator color="#fff" /> : <RNText style={styles.submitBtnText}>Xác nhận lưu</RNText>}
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}