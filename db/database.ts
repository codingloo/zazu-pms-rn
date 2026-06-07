import * as SQLite from 'expo-sqlite';
import { DailyHealthLog } from '../constants/types';

let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('personal_manager.db');
  }
  return db;
}

export function setupDatabase(): void {
  const database = getDb();
  database.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS health_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      steps_count INTEGER DEFAULT 0,
      walking_distance_km REAL DEFAULT 0,
      calories_burned INTEGER DEFAULT 0,
      workout_done INTEGER DEFAULT 0,
      workout_type TEXT DEFAULT '[]',
      workout_duration_minutes INTEGER DEFAULT 0,
      is_breakfast_taken INTEGER DEFAULT 0,
      breakfast TEXT DEFAULT '',
      is_lunch_taken INTEGER DEFAULT 0,
      lunch TEXT DEFAULT '',
      is_dinner_taken INTEGER DEFAULT 0,
      dinner TEXT DEFAULT '',
      snacks TEXT DEFAULT '[]',
      water_intake_liters REAL DEFAULT 0,
      sleep_hours REAL DEFAULT 0,
      sleep_quality TEXT DEFAULT '',
      weight_kg REAL DEFAULT 0,
      mood INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function rowToLog(row: any): DailyHealthLog {
  return {
    id: row.id,
    date: row.date,
    stepsCount: row.steps_count ?? 0,
    walkingDistanceKm: row.walking_distance_km ?? 0,
    caloriesBurned: row.calories_burned ?? 0,
    workoutDone: row.workout_done === 1,
    workoutType: JSON.parse(row.workout_type || '[]'),
    workoutDurationMinutes: row.workout_duration_minutes ?? 0,
    isBreakfastTaken: row.is_breakfast_taken === 1,
    breakfast: row.breakfast ?? '',
    isLunchTaken: row.is_lunch_taken === 1,
    lunch: row.lunch ?? '',
    isDinnerTaken: row.is_dinner_taken === 1,
    dinner: row.dinner ?? '',
    snacks: JSON.parse(row.snacks || '[]'),
    waterIntakeLiters: row.water_intake_liters ?? 0,
    sleepHours: row.sleep_hours ?? 0,
    sleepQuality: row.sleep_quality ?? '',
    weightKg: row.weight_kg ?? 0,
    mood: row.mood ?? 0,
  };
}

export function saveHealthLog(log: DailyHealthLog): void {
  const database = getDb();
  database.runSync(
    `INSERT INTO health_logs (
      date, steps_count, walking_distance_km, calories_burned,
      workout_done, workout_type, workout_duration_minutes,
      is_breakfast_taken, breakfast, is_lunch_taken, lunch,
      is_dinner_taken, dinner, snacks, water_intake_liters,
      sleep_hours, sleep_quality, weight_kg, mood, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
    ON CONFLICT(date) DO UPDATE SET
      steps_count=excluded.steps_count,
      walking_distance_km=excluded.walking_distance_km,
      calories_burned=excluded.calories_burned,
      workout_done=excluded.workout_done,
      workout_type=excluded.workout_type,
      workout_duration_minutes=excluded.workout_duration_minutes,
      is_breakfast_taken=excluded.is_breakfast_taken,
      breakfast=excluded.breakfast,
      is_lunch_taken=excluded.is_lunch_taken,
      lunch=excluded.lunch,
      is_dinner_taken=excluded.is_dinner_taken,
      dinner=excluded.dinner,
      snacks=excluded.snacks,
      water_intake_liters=excluded.water_intake_liters,
      sleep_hours=excluded.sleep_hours,
      sleep_quality=excluded.sleep_quality,
      weight_kg=excluded.weight_kg,
      mood=excluded.mood,
      updated_at=datetime('now')`,
    [
      log.date, log.stepsCount, log.walkingDistanceKm, log.caloriesBurned,
      log.workoutDone ? 1 : 0, JSON.stringify(log.workoutType), log.workoutDurationMinutes,
      log.isBreakfastTaken ? 1 : 0, log.breakfast,
      log.isLunchTaken ? 1 : 0, log.lunch,
      log.isDinnerTaken ? 1 : 0, log.dinner,
      JSON.stringify(log.snacks), log.waterIntakeLiters,
      log.sleepHours, log.sleepQuality, log.weightKg, log.mood,
    ]
  );
}

export function getLogByDate(date: string): DailyHealthLog | null {
  const row = getDb().getFirstSync<any>(`SELECT * FROM health_logs WHERE date = ?`, [date]);
  return row ? rowToLog(row) : null;
}

export function getRecentLogs(days: number = 7): DailyHealthLog[] {
  const rows = getDb().getAllSync<any>(
    `SELECT * FROM health_logs WHERE date >= date('now', '-${days} days') ORDER BY date ASC`
  );
  return rows.map(rowToLog);
}

export function getAllLogs(): DailyHealthLog[] {
  const rows = getDb().getAllSync<any>(`SELECT * FROM health_logs ORDER BY date DESC`);
  return rows.map(rowToLog);
}

export function getLogCount(): number {
  const result = getDb().getFirstSync<any>(`SELECT COUNT(*) as count FROM health_logs`);
  return result?.count ?? 0;
}

export function getWeeklyStats(days: number = 7) {
  const logs = getRecentLogs(days);
  if (logs.length === 0) return null;
  const avgSteps = Math.round(logs.reduce((s, l) => s + l.stepsCount, 0) / logs.length);
  const avgSleep = logs.reduce((s, l) => s + l.sleepHours, 0) / logs.length;
  const avgWater = logs.reduce((s, l) => s + l.waterIntakeLiters, 0) / logs.length;
  const avgMood  = logs.reduce((s, l) => s + l.mood, 0) / logs.length;
  const workoutDays = logs.filter(l => l.workoutDone).length;
  const latestWeight = [...logs].reverse().find(l => l.weightKg > 0)?.weightKg ?? 0;
  return { avgSteps, avgSleep, avgWater, avgMood, workoutDays, latestWeight, totalDays: logs.length };
}
