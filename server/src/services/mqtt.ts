import mqtt from 'mqtt';

const brokerUrl = process.env.MQTT_BROKER_URL;
const topic = process.env.MQTT_TOPIC || 'habits/completed';

let client: mqtt.MqttClient | null = null;

export function connect(): void {
  if (!brokerUrl || brokerUrl === 'disabled') {
    console.log('MQTT disabled or no broker URL provided, skipping connection');
    return;
  }

  try {
    client = mqtt.connect(brokerUrl, { reconnectPeriod: 5000 });
    client.on('connect', () => console.log('MQTT connected to', brokerUrl));
    client.on('error', (err) => {
      if ((err as any).code === 'ENOTFOUND') {
        console.warn('MQTT broker not found, will retry...');
      } else {
        console.error('MQTT error:', err.message);
      }
    });
  } catch (err) {
    console.warn('MQTT connection failed, continuing without it:', (err as Error).message);
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
