// In-memory workplace & settings store
let workplaces = ['Main Job'];
let weeklyGoal = 700;
let monthlyGoal = 3000;

const listeners = new Set<() => void>();
function notify() { listeners.forEach(fn => fn()); }

export const settingsStore = {
  subscribe: (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn); },

  // Workplaces
  getWorkplaces: () => workplaces,
  addWorkplace: (name: string) => { if (!workplaces.includes(name)) { workplaces = [...workplaces, name]; notify(); } },
  removeWorkplace: (name: string) => { workplaces = workplaces.filter(w => w !== name); if (workplaces.length === 0) workplaces = ['Main Job']; notify(); },

  // Goals
  getWeeklyGoal: () => weeklyGoal,
  getMonthlyGoal: () => monthlyGoal,
  setWeeklyGoal: (val: number) => { weeklyGoal = val; notify(); },
  setMonthlyGoal: (val: number) => { monthlyGoal = val; notify(); },
};
