import mqtt from 'mqtt';

const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const topic = process.env.MQTT_TOPIC || 'habits/completed';

let client: mqtt.MqttClient | null = null;

export function connect(): void {
  try {
    client = mqtt.connect(brokerUrl, { reconnectPeriod: 5000 });
    client.on('connect', () => console.log('MQTT connected'));
    client.on('error', (err) => console.error('MQTT error', err));
  } catch (err) {
    console.warn('MQTT not available, continuing without it:', (err as Error).message);
  }
}

export function publishCompletion(data: {
  habit_id: number;
  title: string;
  category: string | null;
  timestamp: string;
}): void {
  if (client?.connected) {
    client.publish(topic, JSON.stringify(data), { qos: 1 });
  }
}
