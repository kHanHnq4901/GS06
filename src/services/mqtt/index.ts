import { Alert } from 'react-native';
import MQTT from 'sp-react-native-mqtt';

const BROKER_HOST = '222.252.14.147';
const BROKER_PORT = 2883;

export type CommandName = 
  | 'ADD_NODE' | 'RM_NODE' | 'ADD_GW' | 'RM_GATEWAY' 
  | 'TEST_NODE' | 'SIREN_ON' | 'SIREN_OFF' 
  | 'SET_PERIOD' | 'RESET' | 'EOP' | 'OTA_START';

class MqttProtocol {
  private client: any = null;

  async executeCommand(gatewayId: string, command: CommandName, params?: any): Promise<any> {
    const downTopic = `safety/01/${gatewayId}/down/command`;
    const upAckTopic = `safety/01/${gatewayId}/up/ack`;
    const upStatusTopic = `safety/01/${gatewayId}/up/status`;

    // --- LẤY MSGID TƯƠNG ỨNG VỚI LỆNH ---
    let msgId = '';
    switch (command) {
      case 'ADD_NODE':   msgId = 'cmd-001'; break;
      case 'EOP':        msgId = 'cmd-001'; break; 
      case 'RM_NODE':    msgId = 'cmd-002'; break;
      case 'ADD_GW':     msgId = 'cmd-003'; break;
      case 'RM_GATEWAY': msgId = 'cmd-004'; break; 
      case 'TEST_NODE':  msgId = 'cmd-006'; break;
      case 'SIREN_OFF':  msgId = 'cmd-007'; break;
      case 'SET_PERIOD': msgId = 'cmd-008'; break;
      case 'RESET':      msgId = 'cmd-009'; break;
      case 'OTA_START':  msgId = 'cmd-010'; break;
      default:           msgId = `cmd-${Date.now()}`; 
    }

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
          console.log(`⚠️ [TIMEOUT]: Gateway ${gatewayId} không phản hồi ACK cho ID: ${msgId}`);
          // Alert.alert("Lỗi", "Gateway không phản hồi. Vui lòng thử lại."); // Tùy chọn bật/tắt
          this.cleanup();
          resolve({ status: 'timeout', msgId });
        }, 5000);

        this.client.on('message', (msg: any) => {
          try {
            const json = JSON.parse(msg.data);
            
            // Kiểm tra tin nhắn phản hồi (ACK)
            if (json.type === 'ACK' && json.data?.msgId === msgId) {
              clearTimeout(timeout);
              const result = json.data?.result;

              if (result === 1) {
                console.log(`✅ [MQTT] Gateway xử lý THÀNH CÔNG lệnh ${command} (${msgId})`);
                this.cleanup();
                resolve({ status: 'success', data: json.data });
              } else {
                console.log(`❌ [MQTT] Gateway xử lý THẤT BẠI lệnh ${command} (${msgId})`);
                this.cleanup();
                resolve({ status: 'failure', data: json.data });
              }
            }
          } catch (e) {
            console.log('[MQTT] Error parsing JSON', e);
          }
        });

        this.client.on('connect', () => {
          this.client.subscribe(upAckTopic, 1);
          this.client.subscribe(upStatusTopic, 1);

          const payload = JSON.stringify({
            type: 'cmd',
            msgId: msgId, // Gửi msgId tương ứng (cmd-001, cmd-002...)
            timestamp: Math.floor(Date.now() / 1000),
            data: {
              command: command,
              params: params || {}
            }
          });

          console.log(`📤 [MQTT] Sending ${command} with ID ${msgId}`);
          this.client.publish(downTopic, payload, 1, false);
        });

        this.client.on('error', (msg: string) => {
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
      this.client.disconnect();
      this.client = null;
    }
  }


  async addNode(gatewayId: string) {
    return this.executeCommand(gatewayId, 'ADD_NODE');
  }

  async disconnectPairing(gatewayId: string) {
    return this.executeCommand(gatewayId, 'EOP');
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