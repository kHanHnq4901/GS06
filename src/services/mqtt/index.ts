// mqtt.ts
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

type MessageHandler = (topic: string, message: string) => void;

class MQTTService {
  private client: MqttClient | null = null;
  private isConnected = false;
  private messageHandler: MessageHandler | null = null;

  connect(
    brokerUrl: string,
    options?: IClientOptions,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client && this.isConnected) {
        resolve();
        return;
      }

      this.client = mqtt.connect(brokerUrl, {
        clientId: `safefire_${Date.now()}`,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 3000,
        ...options,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('[MQTT] Connected');
        resolve();
      });

      this.client.on('reconnect', () => {
        console.log('[MQTT] Reconnecting...');
      });

      this.client.on('close', () => {
        this.isConnected = false;
        console.log('[MQTT] Disconnected');
      });

      this.client.on('error', error => {
        console.log('[MQTT] Error', error);
        reject(error);
      });

      this.client.on('message', (topic, message) => {
        if (this.messageHandler) {
          this.messageHandler(topic, message.toString());
        }
      });
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end(true);
      this.client = null;
      this.isConnected = false;
      console.log('[MQTT] Disconnected manually');
    }
  }

  subscribe(topic: string, qos: 0 | 1 | 2 = 0) {
    if (!this.client || !this.isConnected) {
      console.warn('[MQTT] Cannot subscribe, not connected');
      return;
    }

    this.client.subscribe(topic, { qos }, err => {
      if (err) {
        console.log('[MQTT] Subscribe error', err);
      } else {
        console.log(`[MQTT] Subscribed: ${topic}`);
      }
    });
  }

  unsubscribe(topic: string) {
    if (!this.client) return;

    this.client.unsubscribe(topic, err => {
      if (err) {
        console.log('[MQTT] Unsubscribe error', err);
      } else {
        console.log(`[MQTT] Unsubscribed: ${topic}`);
      }
    });
  }

  publish(
    topic: string,
    payload: any,
    qos: 0 | 1 | 2 = 0,
    retain = false,
  ) {
    if (!this.client || !this.isConnected) {
      console.warn('[MQTT] Cannot publish, not connected');
      return;
    }

    const message =
      typeof payload === 'string' ? payload : JSON.stringify(payload);

    this.client.publish(topic, message, { qos, retain }, err => {
      if (err) {
        console.log('[MQTT] Publish error', err);
      }
    });
  }

  // ===============================
  // REGISTER MESSAGE HANDLER
  // ===============================
  onMessage(handler: MessageHandler) {
    this.messageHandler = handler;
  }

  isMQTTConnected(): boolean {
    return this.isConnected;
  }
}

const MQTT = new MQTTService();
export default MQTT;
