import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Device, IUser, Room, SettingsState } from '../types';
import { fetchWeatherData } from '../services/weatherService';
import { convertTemperature } from '../utils/helpers';


// Mock data
const mockRooms: Room[] = [
    {
        id: '1',
        name: 'Living Room',
        icon: 'sofa',
        backgroundColor: '#FF6B6B',
        deviceIds: ['1', '2', '3'],
    },
    {
        id: '2',
        name: 'Bedroom',
        icon: 'bed',
        backgroundColor: '#4ECDC4',
        deviceIds: ['4', '5'],
    },
    {
        id: '3',
        name: 'Kitchen',
        icon: 'utensils',
        backgroundColor: '#45B7D1',
        deviceIds: ['6', '7', '8'],
    },
    {
        id: '4',
        name: 'Bathroom',
        icon: 'bath',
        backgroundColor: '#96CEB4',
        deviceIds: ['9'],
    },
    {
        id: '5',
        name: 'Office',
        icon: 'laptop',
        backgroundColor: '#FFEAA7',
        deviceIds: ['10', '11'],
    },
];

const mockDevices: Device[] = [
    { id: '1', name: 'Smart Light', type: 'light', isOn: true, roomId: '1', icon: 'lightbulb', value: 80, unit: '%' },
    { id: '2', name: 'Air Conditioner', type: 'ac', isOn: false, roomId: '1', icon: 'snowflake', value: 23, unit: '°C' },
    { id: '3', name: 'Smart TV', type: 'tv', isOn: true, roomId: '1', icon: 'tv' },
    { id: '4', name: 'Bedside Lamp', type: 'light', isOn: false, roomId: '2', icon: 'lightbulb', value: 60, unit: '%' },
    { id: '5', name: 'Ceiling Fan', type: 'fan', isOn: true, roomId: '2', icon: 'fan', value: 3, unit: 'speed' },
    { id: '6', name: 'Kitchen Light', type: 'light', isOn: true, roomId: '3', icon: 'lightbulb', value: 100, unit: '%' },
    { id: '7', name: 'Refrigerator', type: 'ac', isOn: true, roomId: '3', icon: 'snowflake', value: 4, unit: '°C' },
    { id: '8', name: 'Microwave', type: 'tv', isOn: false, roomId: '3', icon: 'tv' },
    { id: '9', name: 'Bathroom Light', type: 'light', isOn: false, roomId: '4', icon: 'lightbulb', value: 70, unit: '%' },
    { id: '10', name: 'Desk Lamp', type: 'light', isOn: true, roomId: '5', icon: 'lightbulb', value: 90, unit: '%' },
    { id: '11', name: 'Security Camera', type: 'camera', isOn: true, roomId: '5', icon: 'video' },
];

const initialState: AppState = {
    rooms: mockRooms,
    devices: mockDevices,
    weather: null,
    energyUsage: {
        current: 2.4,
        daily: 18.5,
        monthly: 450,
        unit: 'kWh',
    },
    selectedRoomId: null,
    temperatureUnit: 'C',
    isLoading: false,
    auth: {
        user: null,
        isAuthenticated: false,
        token: null
    },
    settings: {
        notificationsEnabled: true,
        autoUpdateEnabled: false,
        darkModeEnabled: false,
        language: 'en',
    },
};

// Async thunks
export const fetchWeatherAsync = createAsyncThunk(
    'smartHome/fetchWeather',
    async () => {
        return await fetchWeatherData();
    }
);

export const loadPersistedState = createAsyncThunk(
    'smartHome/loadPersistedState',
    async () => {
        try {
            const devicesData = await AsyncStorage.getItem('devices');
            const temperatureUnit = await AsyncStorage.getItem('temperatureUnit');
            const settingsData = await AsyncStorage.getItem('settings');

            const settings = settingsData ? JSON.parse(settingsData) : {
                notificationsEnabled: true,
                autoUpdateEnabled: false,
                darkModeEnabled: false,
                language: 'en',
            };

            return {
                devices: devicesData ? JSON.parse(devicesData) : mockDevices,
                temperatureUnit: (temperatureUnit === 'F' ? 'F' : 'C') as 'C' | 'F',
                settings,
            };
        } catch (error) {
            console.error('Error loading persisted state:', error);
            return {
                devices: mockDevices,
                temperatureUnit: 'C' as 'C' | 'F',
                settings: {
                    notificationsEnabled: true,
                    autoUpdateEnabled: false,
                    darkModeEnabled: false,
                    language: 'en',
                },
            };
        }
    }
);

const smartHomeSlice = createSlice({
    name: 'smartHome',
    initialState,
    reducers: {
        // --- DEVICE ACTIONS ---
        toggleDevice: (state, action: PayloadAction<string>) => {
            const device = state.devices.find(d => d.id === action.payload);
            if (device) {
                device.isOn = !device.isOn;
                // ⚠️ Lưu ý: Gọi AsyncStorage trong reducer là "Side Effect", không khuyến khích.
                // Tốt nhất là dùng Middleware hoặc redux-persist. Nhưng để code chạy được ngay thì giữ tạm.
                AsyncStorage.setItem('devices', JSON.stringify(state.devices)).catch(err => console.log(err));
            }
        },
        updateDeviceValue: (state, action: PayloadAction<{ deviceId: string; value: number }>) => {
            const device = state.devices.find(d => d.id === action.payload.deviceId);
            if (device) {
                device.value = action.payload.value;
                AsyncStorage.setItem('devices', JSON.stringify(state.devices)).catch(err => console.log(err));
            }
        },

        // --- ROOM & SETTINGS ACTIONS ---
        selectRoom: (state, action: PayloadAction<string>) => {
            state.selectedRoomId = action.payload;
        },
        toggleTemperatureUnit: (state) => {
            state.temperatureUnit = state.temperatureUnit === 'C' ? 'F' : 'C';
            AsyncStorage.setItem('temperatureUnit', state.temperatureUnit).catch(err => console.log(err));

            state.devices.forEach(device => {
                if (device.unit === '°C' || device.unit === '°F') {
                    const currentUnit = device.unit === '°C' ? 'C' : 'F';
                    const convertedTemp = convertTemperature(
                        device.value!,
                        currentUnit,
                        state.temperatureUnit
                    );
                    device.value = Number(convertedTemp.toFixed(1)); // Làm tròn số cho đẹp
                    device.unit = `°${state.temperatureUnit}`;
                }
            });
        },
        updateSettings: (state, action: PayloadAction<Partial<any>>) => {
            state.settings = { ...state.settings, ...action.payload };
            AsyncStorage.setItem('settings', JSON.stringify(state.settings)).catch(err => console.log(err));
        },

        // --- AUTH ACTIONS (CẬP NHẬT MỚI) ---
        
        // Dùng khi đăng nhập thành công
        login: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
            state.auth.user = action.payload.user;
            state.auth.token = action.payload.token; // <--- Lưu token
            state.auth.isAuthenticated = true;
            
        },

        // Dùng khi mở App (Auto Login)
        restoreSession: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
            state.auth.user = action.payload.user;
            state.auth.token = action.payload.token;
            state.auth.isAuthenticated = true;
        },

        // Dùng khi đăng xuất
        logout: (state) => {
            state.auth.user = null;
            state.auth.token = null; // <--- Xóa token
            state.auth.isAuthenticated = false;
            // Việc xóa AsyncStorage.removeItem('USER_SESSION') nên làm ở nơi gọi action này
        },
        updateUserProfile: (state, action) => {
        // Kiểm tra nếu đang có user thì mới update
        if (state.auth.user) {
            // Gộp thông tin cũ với thông tin mới (action.payload)
            state.auth.user = { ...state.auth.user, ...action.payload };
        }
        },
    },
    
    // --- EXTRA REDUCERS (Giữ nguyên logic của bạn) ---
    extraReducers: (builder) => {
        // Giả sử bạn đã define các thunk này ở file khác
        /*
        builder
            .addCase(fetchWeatherAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchWeatherAsync.fulfilled, (state, action) => {
                state.weather = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchWeatherAsync.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(loadPersistedState.fulfilled, (state, action) => {
                if(action.payload) {
                    state.devices = action.payload.devices || [];
                    state.temperatureUnit = action.payload.temperatureUnit || 'C';
                    state.settings = action.payload.settings || {};
                }
            });
        */
    },
});

export const { toggleDevice, selectRoom, toggleTemperatureUnit, updateDeviceValue, login, logout, updateSettings,updateUserProfile } = smartHomeSlice.actions;
export default smartHomeSlice.reducer;
