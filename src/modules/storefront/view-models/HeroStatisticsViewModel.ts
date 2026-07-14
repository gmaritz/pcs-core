export interface HeroStatisticItemViewModel {
  label: string;
  value: number;
  formattedValue: string;
  description: string;
}

export interface HeroStatisticsViewModel {
  items: HeroStatisticItemViewModel[];
}
