// Helper for Weekly Leaderboard calculations

export function getCurrentWeekKey() {
  const now = new Date();
  const year = now.getFullYear();
  // Compute approximate week of year
  const firstJan = new Date(year, 0, 1);
  const days = Math.floor((now - firstJan) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + firstJan.getDay() + 1) / 7);
  return `${year}-W${weekNumber}`;
}

export function getTimeUntilNextMonday() {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday...
  const daysUntilMonday = ((1 - day + 7) % 7) || 7;

  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);

  const diffMs = nextMonday - now;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days} ${days === 1 ? 'ημέρα' : 'ημέρες'} και ${hours} ώρες`;
  }
  return `${hours} ώρες`;
}
