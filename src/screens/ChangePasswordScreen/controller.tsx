import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { handleUpdatePassword } from './handleButton';

export const useChangePasswordController = (navigation: any) => {
  const user = useAppSelector(state => state.smartHome.auth.user);

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  const onPressSave = () => {
    handleUpdatePassword({
      user,
      oldPass,
      newPass,
      confirmPass,
      navigation,
      setLoading
    });
  };

  return {
    oldPass,
    setOldPass,
    newPass,
    setNewPass,
    confirmPass,
    setConfirmPass,
    loading,
    onPressSave
  };
};