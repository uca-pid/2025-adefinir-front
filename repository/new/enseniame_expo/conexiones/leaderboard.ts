import { supabase } from '@/lib/supabase';
import type { PeriodType, LeaderboardResponse, LeaderboardEntry } from '@/components/leaderboard/types';


const mockGenerate = (period: PeriodType, groupId: number, selfUserId: number): LeaderboardResponse => {
  const base: LeaderboardEntry[] = Array.from({ length: 10 }).map((_, i) => ({
    position: i + 1,
    userId: 1000 + i,
    name: `Alumno ${i + 1}`,
    avatar: null,
    level: 1 + Math.floor(Math.random() * 5),
    xp: 200 - i * 10,
    signsLearned: 40 - i * 3,
    modulesCompleted: 5 - Math.floor(i / 2),
  }));
  const selfIndex = base.findIndex(e => e.userId === selfUserId);
  let selfEntry: LeaderboardEntry | undefined = undefined;
  if (selfIndex === -1) {
    selfEntry = {
      position: 17,
      userId: selfUserId,
      name: 'Yo',
      avatar: null,
      level: 3,
      xp: 95,
      signsLearned: 12,
      modulesCompleted: 1,
      isSelf: true,
    };
  } else {
    base[selfIndex].isSelf = true;
    selfEntry = base[selfIndex];
  }
  return {
    groupId,
    groupName: 'Grupo Lectura (Mock)',
    period,
    myPosition: selfEntry?.position ?? null,
    entries: base,
    selfEntry,
  };
};

export async function fetchGroupLeaderboard(period: PeriodType, groupId: number, selfUserId: number): Promise<LeaderboardResponse> {
  return mockGenerate(period, groupId, selfUserId);
}
