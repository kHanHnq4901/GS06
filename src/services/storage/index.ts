import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_SETTING = 'APP_SETTING';

// 1. Định nghĩa kiểu dữ liệu: Chỉ chứa language
export type PropsAppSetting = {
  language: 'vi' | 'en'; // Bạn có thể thêm các ngôn ngữ khác vào đây
};

// 2. Giá trị mặc định (Default)
export const getDefaultStorageValue = (): PropsAppSetting => {
  return {
    language: 'vi', // Mặc định là Tiếng Việt
  };
};

// 3. Lấy Setting từ Storage (Thay thế cho updateValueAppSettingFromNvm cũ)
export const getAppSetting = async (): Promise<PropsAppSetting> => {
  try {
    const result = await AsyncStorage.getItem(KEY_SETTING);
    
    if (result) {
      const storedSettings = JSON.parse(result);
      
      // Kỹ thuật Spread Operator (...): 
      // Lấy giá trị mặc định làm nền, sau đó ghi đè giá trị từ storage lên.
      // Giúp tránh lỗi nếu storage thiếu field hoặc file bị lỗi.
      return { 
        ...getDefaultStorageValue(), 
        ...storedSettings 
      };
    }
  } catch (err: any) {
    console.log('Error reading app setting:', err.message);
  }

  // Nếu chưa có trong storage hoặc bị lỗi, trả về mặc định
  return getDefaultStorageValue();
};

// 4. Lưu Setting vào Storage (Thay thế cho saveValueAppSettingToNvm cũ)
export const saveAppSetting = async (value: PropsAppSetting) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(KEY_SETTING, jsonValue);
    console.log('Saved settings:', jsonValue);
  } catch (err: any) {
    console.log('Error saving app setting:', err.message);
  }
};