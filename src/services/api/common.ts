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
    console.log(`✅ [DATA] Heartbeat GW ${gatewayId}:`, r.data);
    return r.data;
  })
  .catch(err => {
    console.error(`❌ [ERROR] Tại URL: ${url}`);
    console.error('Chi tiết lỗi:', err.response?.data || err.message);
    throw err;
  });
};
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

// Lấy danh sách cảm biến thuộc Gateway
export const getSensorsByGateway = (gatewayId: number) => 
    axios.post(`${API_BASE_URL}/GetSensorsByGateway`, { GatewayId: gatewayId }).then(r => r.data);

// Lấy lịch sử kết nối liên gia
export const getLinkGatewayStatus = (gatewayId: number, limit = 20) => 
    axios.post(`${API_BASE_URL}/GetLinkGatewayStatus`, { GatewayId: gatewayId, Limit: limit }).then(r => r.data);

// Lấy trạng thái mới nhất của một Node (Sensor)
export const getNodeStatusHistory = (nodeId: number, limit = 1) => 
    axios.post(`${API_BASE_URL}/GetNodeStatusHistory`, { NodeId: nodeId, Limit: limit }).then(r => r.data);


export const getSensorsByHomeId = async (homeId: number) => {
  const res = await axios.post(`${API_BASE_URL}/GetSensorsByHomeId`, null, {
    params: { HomeId: homeId }
  });
  return res.data;
};

// Lấy toàn bộ lịch sử Liên gia trong 1 nhà (chỉ 1 request)
export const getLinkStatusByHomeId = async (homeId: number) => {
  const res = await axios.post(`${API_BASE_URL}/GetLinkStatusByHomeId`, null, {
    params: { HomeId: homeId }
  });
  return res.data;
};

export const renameSensor = async (sensorId: number, newName: string) => {
  const res = await axios.post(`${API_BASE_URL}/RenameSensor`, null, {
    params: { SensorId: sensorId, NewName: newName }
  });
  return res.data;
};

export const removeSensor = async (sensorId: number) => {
  const res = await axios.post(`${API_BASE_URL}/RemoveSensor`, null, {
    params: { SensorId: sensorId }
  });
  return res.data;
};

export const clearLinkGatewayStatus = async (gatewayId: number) => {
  const res = await axios.post(`${API_BASE_URL}/ClearLinkGatewayStatus`, null, {
    params: { GatewayId: gatewayId }
  });
  return res.data;
};
export const declareGateway = async (gatewayId: number, homeId: number) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/DeclareGateway`, null, {
      params: { 
        GatewayId: gatewayId, 
        HomeId: homeId 
      }
    });
    return res.data;
  } catch (error) {
    console.error("Declare Gateway Error:", error);
    return { 
      CODE: -1, 
      MESSAGE_VI: "Lỗi kết nối máy chủ", 
      MESSAGE_EN: "Server connection error" 
    };
  }
};