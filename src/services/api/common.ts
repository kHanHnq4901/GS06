import axios from "axios";
import { API_BASE_URL } from ".";

export const getFireAlarmHistory = async (gatewayId: string | number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/GetFireAlarmHistory`, {
      GatewayId: gatewayId,
      Limit: 50
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getHomesByUserId = (userId: number) => 
    axios.post(`${API_BASE_URL}/GetHomesByUserId`, { UserId: userId })
        .then(r => {
            console.log(`[API] GetHomesByUserId (${userId}):`, r.data);
            return r.data;
        })
        .catch(err => {
            console.error(`[API ERROR] GetHomesByUserId:`, err);
            throw err;
        });

// 2. Log danh sách Gateway trong Nhà
export const getGatewaysByHomeId = (homeId: number) => 
    axios.post(`${API_BASE_URL}/GetGatewaysByHomeId`, { HomeId: homeId })
        .then(r => {
            console.log(`[API] GetGatewaysByHomeId (${homeId}):`, r.data);
            return r.data;
        })
        .catch(err => {
            console.error(`[API ERROR] GetGatewaysByHomeId:`, err);
            throw err;
        });
export const getGatewayHeartbeatHistory = (gatewayId: number, limit = 1) => {
  const url = `${API_BASE_URL}/GetGatewayHeartbeatHistory`;
  
  return axios.post(url, {
    GatewayId: gatewayId,
    Limit: limit
  })
  .then(r => {
    // Log data trả về để check các trường (int?) như POWER, BATTERY, TEMERATURE
    console.log(`✅ [DATA] Heartbeat GW ${gatewayId}:`, r.data);
    return r.data;
  })
  .catch(err => {
    console.error(`❌ [ERROR] Tại URL: ${url}`);
    console.error('Chi tiết lỗi:', err.response?.data || err.message);
    throw err;
  });
};
// 3. Log trạng thái mới nhất của Gateway (RSSI, Online...)
export const getGatewayStatusHistory = (gatewayId: number, limit = 1) => 
    axios.post(`${API_BASE_URL}/GetGatewayStatusHistory`, { GatewayId: gatewayId, Limit: limit })
        .then(r => {
            console.log(`[API] GetGatewayStatusHistory (GW: ${gatewayId}):`, r.data);
            return r.data;
        })
        .catch(err => {
            console.error(`[API ERROR] GetGatewayStatusHistory:`, err);
            throw err;
        });
export const createHome = (UserId: number, HomeName: string) => 
    axios.post(`${API_BASE_URL}/CreateHome`, { UserId, HomeName });

export const editHome = (HomeId: number, UserId: number, NewName: string) => 
    axios.post(`${API_BASE_URL}/EditHome`, { HomeId, UserId, NewName });

export const deleteHome = (HomeId: number, UserId: number) => 
    axios.post(`${API_BASE_URL}/DeleteHome`, { HomeId, UserId });

export const renameGateway = async (gatewayId: number, newName: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/RenameGateway`, {
            GatewayId: gatewayId,
            NewName: newName
        });
        return response.data;
    } catch (error) {
        console.error('Rename Gateway Error:', error);
        return { CODE: -1, MESSAGE_VI: 'Lỗi kết nối' };
    }
};
export const removeGatewayFromHome = async (gatewayId: number, homeId: number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/RemoveGatewayFromHome`, {
            GatewayId: gatewayId,
            HomeId: homeId
        });
        return response.data;
    } catch (error) {
        return { CODE: -1, MESSAGE_VI: 'Lỗi kết nối hệ thống' };
    }
};