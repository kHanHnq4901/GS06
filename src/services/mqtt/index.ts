import mqtt, { MqttClient, IClientOptions } from 'mqtt';

// Cấu hình từ thông tin bạn cung cấp
const BROKER_HOST = '222.252.14.147';
const BROKER_PORT = 2883;
const BROKER_URL = `tcp://${BROKER_HOST}:${BROKER_PORT}`;

export type CommandName = 
  | 'ADD_NODE' | 'RM_NODE' | 'ADD_GW' | 'RM_GATEWAY' 
  | 'TEST_NODE' | 'SIREN_ON' | 'SIREN_OFF' 
  | 'SET_PERIOD' | 'RESET';

class MqttProtocol {
  private client: MqttClient | null = null;

  private getOptions(): IClientOptions {
    return {
      username: 'emicappgs06',
      password: 'emicappgs06@0126',
      protocol: 'tcp',
      port: BROKER_PORT,
      host: BROKER_HOST,
      clientId: `safefire_${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
      connectTimeout: 10000,
      reconnectPeriod: 0, 
    };
  }

  private generateMsgId(command: string): string {
    return `cmd-${Date.now()}-${command.toLowerCase()}`;
  }

  /**
   * Quy trình: Connect -> Subscribe -> Publish -> Wait Response -> Disconnect
   */
  async executeCommand(gatewayId: string, command: CommandName, params?: any): Promise<any> {
    const downTopic = `safety/01/${gatewayId}/down/command`;
    const upTopic = `safety/01/${gatewayId}/up/status`;
    const msgId = this.generateMsgId(command);

    return new Promise((resolve, reject) => {
      console.log(`[MQTT] Đang thử kết nối TCP tới ${BROKER_URL}...`);
      
      // Khởi tạo kết nối trực tiếp từ thư viện mqtt
      this.client = mqtt.connect(BROKER_URL, this.getOptions());

      const cleanup = () => {
        if (this.client) {
          console.log('[MQTT] Đang đóng kết nối...');
          this.client.end(true);
          this.client = null;
        }
      };

      // Timeout sau 15 giây nếu Gateway không phản hồi
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error(`TIMEOUT: Gateway ${gatewayId} không phản hồi (${msgId})`));
      }, 15000);

      // 1. Khi kết nối thành công
      this.client.on('connect', () => {
        console.log('[MQTT] Kết nối thành công!');
        
        // 2. Subscribe topic phản hồi trước khi gửi lệnh
        this.client?.subscribe(upTopic, { qos: 1 }, (err) => {
          if (err) {
            clearTimeout(timeout);
            cleanup();
            return reject(new Error('Lỗi Subscribe: ' + err.message));
          }

          // 3. Publish lệnh
          const payload = JSON.stringify({
            type: 'cmd',
            msgId: msgId,
            timestamp: Math.floor(Date.now() / 1000),
            data: { command, ...(params || {}) }
          });

          this.client?.publish(downTopic, payload, { qos: 1 }, (pErr) => {
            if (pErr) {
              clearTimeout(timeout);
              cleanup();
              reject(new Error('Lỗi Publish: ' + pErr.message));
            } else {
              console.log(`[MQTT] Đã gửi lệnh tới: ${downTopic}`);
            }
          });
        });
      });

      // 4. Lắng nghe tin nhắn trả về
      this.client.on('message', (topic, message) => {
        const raw = message.toString();
        console.log(`[MQTT] Nhận phản hồi:`, raw);
        
        try {
          const data = JSON.parse(raw);
          // Khớp msgId để xác nhận đúng phản hồi của lệnh vừa gửi
          if (data.msgId === msgId || data.type === 'wifi_result' || data.type === 'scan_resp') {
            clearTimeout(timeout);
            cleanup();
            resolve(data);
          }
        } catch (e) {
          console.log('[MQTT] Phản hồi không phải JSON hợp lệ');
        }
      });

      // 5. Xử lý lỗi
      this.client.on('error', (err) => {
        console.log('[MQTT] Lỗi kết nối:', err.message);
        clearTimeout(timeout);
        cleanup();
        reject(err);
      });
    });
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