export type HomeBanner = {
  id: string;
  badge: string;
  headline: string;
  highlightLine: string;
  subtitle: string;
  gradientStart: string;
  gradientEnd: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomeEvent = {
  id: string;
  day: string;
  month: string;
  title: string;
  location: string;
  attendees: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomeCourse = {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  duration: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomeCommunity = {
  id: string;
  name: string;
  memberCount: string;
  color: string;
  initial: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomeLeaderEntry = {
  id: string;
  rank: number;
  name: string;
  sector: string;
  valuation: string;
  growth: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomeFundingCard = {
  id: string;
  company: string;
  stage: string;
  amount: string;
  sector: string;
  color: string;
  initial: string;
  isActive: boolean;
  sortOrder: number;
};
