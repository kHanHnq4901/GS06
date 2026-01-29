// services/api.ts
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';


export const getFireAlarmHistory = async (gatewayId: string | number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/GetFireAlarmHistory`, {
      GatewayId: gatewayId,
      Limit: 50
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};