import { supabase } from '../lib/supabase';
export type PeriodType = 'week' | 'month' | 'all';
export type LeaderboardEntry = {
  position: number;
  userId: number;
  name: string;
  avatar?: string | null;
  level?: number;
  xp: number;
  signsLearned: number;
  modulesCompleted: number;
  isSelf?: boolean;
};
export type LeaderboardResponse = {
  groupId: number;
  groupName: string;
  period: PeriodType;
  myPosition: number | null;
  entries: LeaderboardEntry[];
  selfEntry?: LeaderboardEntry;
};

export async function fetchGroupLeaderboard(period: PeriodType, groupId: number, selfUserId: number): Promise<LeaderboardResponse> {
  try {
    const { data: group } = await supabase.from('groups').select('name').eq('id', groupId).maybeSingle();
    const groupName = group?.name ?? `Grupo ${groupId}`;
    return { groupId, groupName, period, myPosition: null, entries: [] };
  } catch {
    return { groupId, groupName: `Grupo ${groupId}`, period, myPosition: null, entries: [] };
  }
}
