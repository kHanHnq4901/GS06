import React, { useState, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { login } from '../../../store/smartHomeSlice';
import { getCurrentLanguageTranslations } from '../../../utils/localization';
import { PropsState } from '../../store';
import { PropsAppSetting } from '../../services/storage';

type PropsHook = {
  state: PropsState;
  setState: React.Dispatch<React.SetStateAction<PropsState>>;
};
export const hook = {} as PropsHook;
export let store = {} as PropsStore;
export function UpdateHook() {
  store = React.useContext(storeContext);

  const [state, setState] = React.useState<PropsState>({
    appSetting: { ...store.state.appSetting },
  });

  state.appSetting.server = { ...state.appSetting.server };

  hook.state = state;
  hook.setState = setState;
}
export const useLoginController = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const settings = useAppSelector(state => state.smartHome.settings);
    const { t } = getCurrentLanguageTranslations(settings);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    return {
        // State
        phone,
        password,
        loading,
        showPassword,
        fadeAnim,
        slideAnim,
        t,

        // Setters
        setPhone,
        setPassword,
        setShowPassword,
        setLoading,
    };
};
type PropsState = {
  appSetting: PropsAppSetting;
  selectedSerVer: string;
};

