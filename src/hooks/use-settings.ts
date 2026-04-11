import { useSyncExternalStore } from 'react';
import { settingsStore } from '@/lib/settings-store';

export function useSettings() {
  const workplaces = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getWorkplaces,
    settingsStore.getWorkplaces,
  );
  const weeklyGoal = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getWeeklyGoal,
    settingsStore.getWeeklyGoal,
  );
  const monthlyGoal = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getMonthlyGoal,
    settingsStore.getMonthlyGoal,
  );

  return {
    workplaces,
    addWorkplace: settingsStore.addWorkplace,
    removeWorkplace: settingsStore.removeWorkplace,
    weeklyGoal,
    monthlyGoal,
    setWeeklyGoal: settingsStore.setWeeklyGoal,
    setMonthlyGoal: settingsStore.setMonthlyGoal,
  };
}
