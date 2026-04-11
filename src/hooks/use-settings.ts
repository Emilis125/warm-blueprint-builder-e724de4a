import { useSyncExternalStore } from 'react';
import { settingsStore } from '@/lib/settings-store';

export function useSettings() {
  const workplaces = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getWorkplaces,
    settingsStore.getWorkplaces,
  );
  const categories = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getCategories,
    settingsStore.getCategories,
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
    categories,
    addCategory: settingsStore.addCategory,
    removeCategory: settingsStore.removeCategory,
    weeklyGoal,
    monthlyGoal,
    setWeeklyGoal: settingsStore.setWeeklyGoal,
    setMonthlyGoal: settingsStore.setMonthlyGoal,
  };
}
