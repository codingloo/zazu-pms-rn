export interface DailyHealthLog {
  id?: number;
  date: string; // YYYY-MM-DD

  // Activity
  stepsCount: number;
  walkingDistanceKm: number;
  caloriesBurned: number;

  // Workout
  workoutDone: boolean;
  workoutType: string[];
  workoutDurationMinutes: number;

  // Nutrition
  isBreakfastTaken: boolean;
  breakfast: string;
  isLunchTaken: boolean;
  lunch: string;
  isDinnerTaken: boolean;
  dinner: string;
  snacks: string[];
  waterIntakeLiters: number;

  // Sleep
  sleepHours: number;
  sleepQuality: string;

  // Health
  weightKg: number;
  mood: number;
}

export interface UserProfile {
  name: string;
  avatarInitials: string;
  pinEnabled: boolean;
  biometricEnabled: boolean;
  stepGoal: number;
  waterGoal: number;
  sleepGoal: number;
  weightGoal: number;
  createdAt: string;
}

export const defaultLog = (): DailyHealthLog => ({
  date: new Date().toISOString().split('T')[0],
  stepsCount: 0,
  walkingDistanceKm: 0,
  caloriesBurned: 0,
  workoutDone: false,
  workoutType: [],
  workoutDurationMinutes: 0,
  isBreakfastTaken: false,
  breakfast: '',
  isLunchTaken: false,
  lunch: '',
  isDinnerTaken: false,
  dinner: '',
  snacks: [],
  waterIntakeLiters: 0,
  sleepHours: 0,
  sleepQuality: '',
  weightKg: 0,
  mood: 0,
});

export const defaultProfile = (): UserProfile => ({
  name: '',
  avatarInitials: '',
  pinEnabled: false,
  biometricEnabled: false,
  stepGoal: 8000,
  waterGoal: 2.0,
  sleepGoal: 8,
  weightGoal: 70,
  createdAt: new Date().toISOString(),
});
