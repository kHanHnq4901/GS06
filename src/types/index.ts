export interface Device {
    id: string;
    name: string;
    type: 'light' | 'ac' | 'tv' | 'fan' | 'door' | 'camera';
    isOn: boolean;
    roomId: string;
    icon: string;
    value?: number; // For temperature, brightness, etc.
    unit?: string; // For temperature unit (°C/°F)
}

export interface Room {
    id: string;
    name: string;
    icon: string;
    backgroundColor: string;
    deviceIds: string[];
}

export interface WeatherData {
    location: {
        name: string;
        region: string;
        country: string;
    };
    current: {
        temp_c: number;
        temp_f: number;
        condition: {
            text: string;
            icon: string;
        };
        humidity: number;
        wind_kph: number;
        vis_km: number;
        feelslike_c: number;
        feelslike_f: number;
    };
    unit: 'C' | 'F';
}

export interface EnergyUsage {
    current: number;
    daily: number;
    monthly: number;
    unit: string;
}

export interface IUser {
  USER_ID: number;
  USER_ACCOUNT: string;
  USER_NAME: string;
  ROLE_ID?: number;
  USER_TYPE?: string;
  USER_ADDRESS?: string;
  USER_TEL?: string;
  USER_EMAIL?: string;
  STATE: string;
  IMAGE:string;
}


interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  token: string | null;
}


export interface SettingsState {
    notificationsEnabled: boolean;
    autoUpdateEnabled: boolean;
    darkModeEnabled: boolean;
    language: 'en' | 'vi';
}

export interface AppState {
    rooms: Room[];
    devices: Device[];
    weather: WeatherData | null;
    energyUsage: EnergyUsage;
    selectedRoomId: string | null;
    temperatureUnit: 'C' | 'F';
    isLoading: boolean;
    auth: AuthState;
    settings: SettingsState;
}

// RootState is now defined in store/index.ts
