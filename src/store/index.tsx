
import { configureStore } from '@reduxjs/toolkit';
import smartHomeReducer from './smartHomeSlice';
import { getDefaultStorageValue, PropsAppSetting } from '../services/storage'; 
import { Platform } from 'react-native';
import React, { useState, createContext, useContext, ReactNode } from 'react';

export const store = configureStore({
    reducer: {
        smartHome: smartHomeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>; 


export type TYPE_TOUCH_ID = 'FaceID' | 'TouchID' | 'NoSupport';

export type PropsState = {
  net: {
    netconnected: boolean;
    netReachAble: boolean;
  };
  app: {
    mdVersion: boolean;
    enableDebug: boolean;
  };
  alert: {
    show: boolean;
  };
  // Đây là phần Setting chứa ngôn ngữ (language)
  appSetting: PropsAppSetting; 

  typeTouchID: TYPE_TOUCH_ID;
  isCredential: boolean;
};

// Định nghĩa kiểu dữ liệu cho Context
type PropsStore = {
  state: PropsState;
  setState: React.Dispatch<React.SetStateAction<PropsState>>;
};

// Khởi tạo Context
export const StoreContext = createContext<PropsStore | null>(null);

// Custom Hook: Giúp gọi state ở các màn hình khác ngắn gọn hơn
// Ví dụ: const { state, setState } = useGlobalState();
export const useGlobalState = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useGlobalState phải được sử dụng bên trong StoreProvider");
    }
    return context;
};

// Component Provider: Dùng để bọc ngoài App
export const StoreProvider = ({ children }: { children: ReactNode }) => {

  const [globalState, setGlobalState] = useState<PropsState>({
    net: {
      netReachAble: true, // Mặc định là có mạng để app không hiện lỗi ngay khi vào
      netconnected: true,
    },
    app: {
      enableDebug: false,
      mdVersion: false,
    },
    alert: {
      show: false,
    },
    // Lấy giá trị mặc định (language: 'vi') từ file storage.ts
    appSetting: getDefaultStorageValue(), 
    
    typeTouchID: Platform.OS === 'ios' ? 'FaceID' : 'TouchID',
    isCredential: false,
  });

  const contextValue: PropsStore = {
    state: globalState,
    setState: setGlobalState,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};