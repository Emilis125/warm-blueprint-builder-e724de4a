import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export function useSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['user_settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: { workplaces?: string[]; categories?: string[]; weekly_goal?: number; monthly_goal?: number }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_settings'] });
    },
  });

  const workplaces: string[] = data?.workplaces || ['Main Job'];
  const categories: string[] = data?.categories || ['Tips', 'Service Charge', 'Bonus', 'Overtime'];
  const weeklyGoal = Number(data?.weekly_goal) || 700;
  const monthlyGoal = Number(data?.monthly_goal) || 3000;

  return {
    workplaces,
    categories,
    weeklyGoal,
    monthlyGoal,
    addWorkplace: (name: string) => {
      if (!workplaces.includes(name)) {
        updateMutation.mutate({ workplaces: [...workplaces, name] });
      }
    },
    removeWorkplace: (name: string) => {
      const filtered = workplaces.filter(w => w !== name);
      updateMutation.mutate({ workplaces: filtered.length > 0 ? filtered : ['Main Job'] });
    },
    addCategory: (name: string) => {
      if (!categories.includes(name)) {
        updateMutation.mutate({ categories: [...categories, name] });
      }
    },
    removeCategory: (name: string) => {
      updateMutation.mutate({ categories: categories.filter(c => c !== name) });
    },
    setWeeklyGoal: (val: number) => updateMutation.mutate({ weekly_goal: val }),
    setMonthlyGoal: (val: number) => updateMutation.mutate({ monthly_goal: val }),
  };
}
