import { useSQLiteContext } from "expo-sqlite";

export interface Exercise {
  id: number;
  name: string;
  series: number;
  repetitions: number;
  weight: number | undefined;
  time: number | undefined;
}

interface ExerciseRow {
  id: number;
  name: string;
  series: number;
  repetitions: number;
  weight: string | null;
  time: string | null;
}

export interface ExerciseHistory {
  id: number;
  exerciseId: number;
  executionDateTime: Date;
  executionTime: number;
  executionWeight: number;
  executionRepetition: number;
}

interface ExerciseHistoryRow {
  id: number;
  exercise_id: number;
  execution_datetime: string;
  execution_time: string;
  execution_weight: string;
  execution_repetition: string;
}

export interface ExerciseHistoryWithName extends ExerciseHistory {
  name: string;
}

export function useExercisesDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<Exercise, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO exercises (name, series, repetitions, weight, time) VALUES ($name, $series, $repetitions, $weight, $time)",
    );
    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $series: data.series,
        $repetitions: data.repetitions,
        $weight: data.weight ?? 0,
        $time: data.time ?? null
      });
      const insertedRowId = result.lastInsertRowId.toLocaleString();
      return { insertedRowId };
    } catch (e) {
      console.error("Error creating exercise:", e);
      return null;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function saveHistory(data: Omit<ExerciseHistory, 'id' | 'executionDateTime'>): Promise<void> {
    const statement = await database.prepareAsync(
      "INSERT INTO exercise_history (exercise_id, execution_time, execution_weight, execution_repetition) VALUES ($exerciseId, $executionTime, $executionWeight, $executionRepetition)"
    );
    try {
      await statement.executeAsync({
        $exerciseId: data.exerciseId,
        $executionTime: data.executionTime,
        $executionWeight: data.executionWeight,
        $executionRepetition: data.executionRepetition
      });
    } catch (e) {
      console.error("Error saving exercise history:", e);
      throw e;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function getAll(): Promise<Exercise[] | null> {
    try {
      const query = "SELECT * FROM exercises";
      const response = await database.getAllAsync<ExerciseRow>(query);
      return response.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        series: exercise.series,
        repetitions: exercise.repetitions,
        weight: exercise.weight ? parseFloat(exercise.weight) : undefined,
        time: exercise.time ? parseInt(exercise.time) : undefined,
      }));
    } catch (e) {
      console.error("Error getting all exercises:", e);
      return null;
    }
  }

  async function getAllHistory(): Promise<ExerciseHistoryWithName[] | null> {
    try {
      const query = `
        SELECT 
          eh.id,
          eh.exercise_id,
          eh.execution_datetime,
          eh.execution_time,
          eh.execution_weight,
          eh.execution_repetition,
          e.name
        FROM exercise_history eh
        INNER JOIN exercises e ON eh.exercise_id = e.id
        ORDER BY eh.execution_datetime DESC
      `;
      const response = await database.getAllAsync<ExerciseHistoryRow & { name: string }>(query);

      return response.map((row) => ({
        id: row.id,
        exerciseId: row.exercise_id,
        executionDateTime: new Date(row.execution_datetime),
        executionTime: parseFloat(row.execution_time),
        executionWeight: parseFloat(row.execution_weight),
        executionRepetition: parseFloat(row.execution_repetition),
        name: row.name
      }));
    } catch (e) {
      console.error("Error getting exercise history:", e);
      return null;
    }
  }

  async function getHistoryByExercise(exerciseId: number): Promise<ExerciseHistory[] | null> {
    try {
      const query = `
        SELECT * FROM exercise_history 
        WHERE exercise_id = ? 
        ORDER BY execution_datetime DESC
      `;
      const response = await database.getAllAsync<ExerciseHistoryRow>(query, [exerciseId]);

      return response.map((row) => ({
        id: row.id,
        exerciseId: row.exercise_id,
        executionDateTime: new Date(row.execution_datetime),
        executionTime: parseFloat(row.execution_time),
        executionWeight: parseFloat(row.execution_weight),
        executionRepetition: parseFloat(row.execution_repetition)
      }));
    } catch (e) {
      console.error("Error getting exercise history by ID:", e);
      return null;
    }
  }

  return {
    create,
    getAll,
    saveHistory,
    getAllHistory,
    getHistoryByExercise
  };
}
