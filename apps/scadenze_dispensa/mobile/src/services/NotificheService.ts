import notifee, { AndroidImportance, TriggerType, type TimestampTrigger } from '@notifee/react-native';
import { NOTIFICHE_CONFIG } from '@shared/utils/constants';

interface NotificaParams {
  id: string;
  titolo: string;
  testo: string;
  dataNotifica: Date;
}

class NotificheService {
  private static instance: NotificheService;
  private channelCreated = false;

  private constructor() {}

  static getInstance(): NotificheService {
    if (!NotificheService.instance) {
      NotificheService.instance = new NotificheService();
    }
    return NotificheService.instance;
  }

  async init(): Promise<void> {
    try {
      await notifee.requestPermission();
      await this.createChannel();
    } catch (error) {
      console.error('NotificheService init error:', error);
      throw error;
    }
  }

  private async createChannel(): Promise<void> {
    if (this.channelCreated) return;

    try {
      await notifee.createChannel({
        id: NOTIFICHE_CONFIG.CHANNEL_ID,
        name: NOTIFICHE_CONFIG.CHANNEL_NAME,
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#EF4444',
      });
      this.channelCreated = true;
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }

  async scheduleNotifica(params: NotificaParams): Promise<void> {
    try {
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: params.dataNotifica.getTime(),
      };

      await notifee.createTriggerNotification(
        {
          id: params.id,
          title: params.titolo,
          body: params.testo,
          android: {
            channelId: NOTIFICHE_CONFIG.CHANNEL_ID,
          },
        },
        trigger
      );
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async cancelNotifica(id: string): Promise<void> {
    try {
      await notifee.cancelNotification(id);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async cancelAllNotifiche(): Promise<void> {
    try {
      await notifee.cancelAllNotifications();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }
}

export const notificheService = NotificheService.getInstance();
