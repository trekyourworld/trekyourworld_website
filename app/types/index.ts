export interface StatisticItem {
    id: number;
    label: string;
    value: string;
    change: string;
}

export interface AnalysisItem {
    category: string;
    description: string;
}

export interface Trek {
    id: number;
    name: string;
    location: string;
    difficulty: 'Easy' | 'Moderate' | 'Difficult' | 'Extreme';
    duration: number; // in days
    distance: number; // in kilometers
    elevation: number; // in meters
    season: string[];
    price: number;
    rating: number;
    imageUrl: string;
    description: string;
  }