import { type SQLiteDatabase } from "expo-sqlite"

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      series INTEGER NOT NULL,
      repetitions INTEGER NOT NULL,
      weight REAL DEFAULT 0,
      time INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS exercise_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      execution_datetime TEXT NOT NULL DEFAULT (datetime('now')),
      execution_time TEXT NOT NULL,
      execution_weight TEXT NOT NULL,
      execution_repetition TEXT NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );
    
    INSERT OR IGNORE INTO exercises (name, series, repetitions, weight, time) VALUES
      ('Flexões', 3, 15, 0, 45000),
      ('Barras', 3, 8, 0, 30000),
      ('Agachamentos', 4, 20, 0, 60000),
      ('Prancha', 3, 1, 0, 60000),
      ('Supino Reto', 4, 10, 60.00, 120000),
      ('Levantamento Terra', 3, 8, 80.00, 90000),
      ('Afundos', 3, 12, 20.00, 75000),
      ('Remada com Halteres', 4, 12, 25.00, 90000),
      ('Abdominal Bicicleta', 3, 20, 0, 45000),
      ('Burpees', 3, 10, 0, 60000);
  `)
}
