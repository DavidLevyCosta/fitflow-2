import { createContext, useContext, useState, ReactNode } from 'react';
import { Exercise } from 'database/useExercisesDatabase';

interface ExerciseContextType {
  currentExercise: Exercise | null;
  startExercise: (exercise: Exercise) => void;
  stopExercise: () => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
  };

  const stopExercise = () => {
    setCurrentExercise(null);
  };

  return (
    <ExerciseContext.Provider value={{ currentExercise, startExercise, stopExercise }}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercise() {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within ExerciseProvider');
  }
  return context;
}
