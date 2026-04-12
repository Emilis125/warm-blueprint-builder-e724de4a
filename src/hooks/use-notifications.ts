import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

const VAPID_PUBLIC_KEY = 'BFvPFieasRoGbMtZOCeK5D_8msAn-GUR6xLgj2CbUmfFIVnr_q54BjcQIiGzshHns0aSimAUjUwetomkEm-hsEA';

interface NotificationPrefs {
  enabled: boolean;
  reminder_time: string;
  timezone: string;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function useNotifications() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPrefs>({ enabled: false, reminder_time: '21:00', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const [loading, setLoading] = useState(true);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  // Load preferences
  useEffect(() => {
    if (!user) return;
    
    const load = async () => {
      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        setPrefs({
          enabled: data.enabled,
          reminder_time: data.reminder_time,
          timezone: data.timezone,
        });
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const subscribeToPush = useCallback(async (): Promise<PushSubscription | null> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast.error('Push notifications are not supported in this browser');
      return null;
    }

    const permission = await Notification.requestPermission();
    setPermissionState(permission);
    
    if (permission !== 'granted') {
      toast.error('Notification permission denied');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    return subscription;
  }, []);

  const savePreferences = useCallback(async (newPrefs: NotificationPrefs) => {
    if (!user) return;

    let pushSubscription: PushSubscription | null = null;

    if (newPrefs.enabled) {
      pushSubscription = await subscribeToPush();
      if (!pushSubscription) {
        toast.error('Could not enable push notifications');
        return;
      }
    }

    const record = {
      user_id: user.id,
      enabled: newPrefs.enabled,
      reminder_time: newPrefs.reminder_time,
      timezone: newPrefs.enabled ? Intl.DateTimeFormat().resolvedOptions().timeZone : newPrefs.timezone,
      ...(pushSubscription ? { push_subscription: JSON.parse(JSON.stringify(pushSubscription)) } : {}),
    };

    const { error } = await supabase
      .from('notification_preferences')
      .upsert(record, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving notification prefs:', error);
      toast.error('Failed to save notification settings');
      return;
    }

    setPrefs(newPrefs);
    toast.success(newPrefs.enabled ? 'Notifications enabled!' : 'Notifications disabled');
  }, [user, subscribeToPush]);

  return { prefs, loading, permissionState, savePreferences };
}
