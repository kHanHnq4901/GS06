import MQTT from 'sp-react-native-mqtt';

const BROKER_HOST = '222.252.14.147';
const BROKER_PORT = 2883;

export type CommandName = 
  | 'ADD_NODE' | 'RM_NODE' | 'ADD_GW' | 'RM_GATEWAY' 
  | 'TEST_NODE' | 'SIREN_ON' | 'SIREN_OFF' 
  | 'SET_PERIOD' | 'RESET';

class MqttProtocol {
  private client: any = null;

async executeCommand(gatewayId: string, command: CommandName, params?: any): Promise<any> {
    const downTopic = `safety/01/${gatewayId}/down/cmd`;
    const upTopic = `safety/01/${gatewayId}/up/status`;
    const msgId = `cmd-${Date.now()}-${command.toLowerCase()}`;

    return new Promise(async (resolve, reject) => {
      try {
        this.client = await MQTT.createClient({
          uri: `mqtt://${BROKER_HOST}:${BROKER_PORT}`,
          clientId: `safefire_${Math.random().toString(16).slice(2, 10)}`,
          user: 'emicappgs06',
          pass: 'emicappgs06@0126',
          auth: true,
          keepalive: 60
        });

        const timeout = setTimeout(() => {
          this.cleanup();
          reject(new Error(`TIMEOUT: Gateway ${gatewayId} không phản hồi`));
        }, 15000);

        // --- LẮNG NGHE CÁC SỰ KIỆN LOG ---

        // 1. Log khi Subscribe thành công
        this.client.on('subscribed', (topic: string) => {
          console.log(`✅ [MQTT] Đã Subscribe thành công topic: ${topic}`);
        });

        // 2. Log khi nhận tin nhắn (kèm topic nguồn)
        this.client.on('message', (msg: any) => {
          console.log(`📩 [MQTT] Nhận tin nhắn từ topic: ${msg.topic}`);
          try {
            const data = JSON.parse(msg.data);
            if (data.msgId === msgId || data.type === 'wifi_result') {
              console.log('🎯 [MQTT] Khớp MsgID, đang xử lý dữ liệu...');
              clearTimeout(timeout);
              this.cleanup();
              resolve(data);
            }
          } catch (e) {
            console.log('[MQTT] Nội dung không phải JSON:', msg.data);
          }
        });

        this.client.on('connect', () => {
          console.log('[MQTT] Kết nối Broker thành công!');
          
          // Thực hiện subscribe
          console.log(`[MQTT] Đang gửi yêu cầu subscribe: ${upTopic}`);
          this.client.subscribe(upTopic, 1);
          
          const payload = JSON.stringify({
            type: 'cmd',
            msgId: msgId,
            timestamp: Math.floor(Date.now() / 1000),
            data: { command, ...(params || {}) }
          });

          // Thực hiện publish
          console.log(`[MQTT] Đang gửi lệnh tới: ${downTopic}`);
          this.client.publish(downTopic, payload, 1, false);
        });

        this.client.on('error', (msg: string) => {
          console.log('[MQTT] Lỗi kết nối:', msg);
          clearTimeout(timeout);
          this.cleanup();
          reject(new Error(msg));
        });

        this.client.connect();

      } catch (error) {
        reject(error);
      }
    });
  }

  private cleanup() {
    if (this.client) {
      console.log('🔌 [MQTT] Đang ngắt kết nối và dọn dẹp...');
      this.client.disconnect();
      this.client = null;
    }
  }


  async addNode(gatewayId: string) {
    return this.executeCommand(gatewayId, 'ADD_NODE');
  }

  async removeNode(gatewayId: string, nodeId: string) {
    return this.executeCommand(gatewayId, 'RM_NODE', { nodeId });
  }

  async addLinkGateway(gatewayId: string, targetGatewayId: string) {
    return this.executeCommand(gatewayId, 'ADD_GW', { GatewayId: targetGatewayId });
  }

  async removeLinkGateway(gatewayId: string, targetGatewayId: string) {
    return this.executeCommand(gatewayId, 'RM_GATEWAY', { GatewayId: targetGatewayId });
  }

  async testDevice(gatewayId: string, scope: 0 | 1, nodeId?: string) {
    return this.executeCommand(gatewayId, 'TEST_NODE', { scope, nodeId: nodeId || "" });
  }

  async sirenOff(gatewayId: string) {
    return this.executeCommand(gatewayId, 'SIREN_OFF');
  }

  async sirenOn(gatewayId: string) {
    return this.executeCommand(gatewayId, 'SIREN_ON');
  }

  async setPeriod(gatewayId: string, heartbeat: number, nodeStatus: number, linkStatus: number) {
    return this.executeCommand(gatewayId, 'SET_PERIOD', {
      heartbeat,
      nodeStatus,
      linkStatus
    });
  }

  async resetDevice(gatewayId: string) {
    return this.executeCommand(gatewayId, 'RESET');
  }
}

export const MqttProtocolService = new MqttProtocol();