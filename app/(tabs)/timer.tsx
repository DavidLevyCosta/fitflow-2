import { ArrowLeftToLine, ArrowRightToLine, Check, Pause, Play, Repeat, Repeat2, TimerReset, Weight } from "@tamagui/lucide-icons";
import { NumberSelector } from "components/NumberSelector";
import { useExercise } from "context/ExerciseContext";
import { useExercisesDatabase } from "database/useExercisesDatabase";
import { router } from "expo-router";
import { useState, useRef, useEffect } from "react"
import { View, Text, Button, XStack, YStack, XGroup, H2 } from "tamagui"
import { calculateArrayAverage, sumArray } from "utils/array";
import { formatTime } from "utils/formatting";


export default function TimerScreen() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [currentSeries, setCurrentSeries] = useState<number>(1);
  const [seriesWeight, setSeriesWeight] = useState<number[]>([]);
  const [seriesRepetition, setSeriesRepetition] = useState<number[]>([]);
  const [seriesTime, setSeriesTime] = useState<number[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);

  const { currentExercise, stopExercise } = useExercise();
  const exerciseDatabase = useExercisesDatabase();

  useEffect(() => {
    if (currentExercise) {
      const seriesCount = currentExercise.series;
      const defaultWeight = currentExercise.weight || 0;
      const defaultReps = currentExercise.repetitions || 0;

      setSeriesWeight(new Array(seriesCount).fill(defaultWeight));
      setSeriesRepetition(new Array(seriesCount).fill(defaultReps));
      setSeriesTime(new Array(seriesCount).fill(0));
      setCurrentSeries(1);
      resetTimer();
    }
  }, [currentExercise])


  function playTimer(): void {
    if (isRunning) return;

    setIsRunning(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setTimer(accumulatedTimeRef.current + elapsed);
    }, 10);
  }

  function stopTimer(): void {
    if (!isRunning) return;

    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    accumulatedTimeRef.current = timer;
  }

  function resetTimer(): void {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimer(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
  }

  function finishExercise(): void {
    try {
      if (currentExercise) {
        exerciseDatabase.saveHistory({
          exerciseId: currentExercise.id,
          executionTime: sumArray(seriesTime),
          executionWeight: calculateArrayAverage(seriesWeight),
          executionRepetition: calculateArrayAverage(seriesRepetition)
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      stopExercise();
      router.push('/selector')
    }
  }

  function nextSeries(): void {
    if (!currentExercise) return;

    saveCurrentSeriesData();

    if (currentSeries < currentExercise.series) {
      const nextSeriesIndex = currentSeries;
      setCurrentSeries(currentSeries + 1);

      const savedTimer = seriesTime[nextSeriesIndex] || 0;
      setTimer(savedTimer);
      accumulatedTimeRef.current = savedTimer;
      startTimeRef.current = 0;
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }

  function previousSeries(): void {
    if (currentSeries > 1) {

      saveCurrentSeriesData();

      const prevSeriesIndex = currentSeries - 2;
      setCurrentSeries(currentSeries - 1);

      const savedTimer = seriesTime[prevSeriesIndex] || 0;
      setTimer(savedTimer);
      accumulatedTimeRef.current = savedTimer;
      startTimeRef.current = 0;
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }

  function saveCurrentSeriesData(): void {
    const newTimerArray = [...seriesTime];
    newTimerArray[currentSeries - 1] = timer;
    setSeriesTime(newTimerArray);
  }

  if (!currentExercise) {
    return (
      <View p="$5" flex={1} items="center" justify="center" bg="$background">
        <Text>No exercise selected</Text>
      </View>
    );
  }

  return (
    <View p="$5" flex={1} justify="space-between" bg="$background" gap="$4">
      <H2 self="center"> {currentExercise?.name ?? '?'} </H2>
      <XStack justify="space-evenly">
        <NumberSelector
          Icon={Weight}
          value={seriesWeight[currentSeries - 1] ?? 0}
          onChange={(value) => {
            const newArray = [...seriesWeight];
            newArray[currentSeries - 1] = value;
            setSeriesWeight(newArray);
          }}
          max={500}
        />
        <NumberSelector
          Icon={Repeat}
          value={seriesRepetition[currentSeries - 1] ?? 0}
          onChange={(value) => {
            const newArray = [...seriesRepetition];
            newArray[currentSeries - 1] = value;
            setSeriesRepetition(newArray);
          }}
          max={100}
        />
      </XStack>
      <YStack items="center" justify="center" gap="$2">
        <Text fontSize={48} fontWeight="bold">
          {formatTime(timer)}
        </Text>
        <XStack gap="$2">
          <Button onPress={playTimer} disabled={isRunning} opacity={isRunning ? 0.5 : 1}>
            <Play></Play>
          </Button>
          <Button onPress={stopTimer} disabled={!isRunning} opacity={!isRunning ? 0.5 : 1}>
            <Pause></Pause>
          </Button>
          <Button onPress={resetTimer} disabled={timer === 0} opacity={timer === 0 ? 0.5 : 1}>
            <TimerReset></TimerReset>
          </Button>
        </XStack>
      </YStack>
      <XStack justify="center" items="center">
        <Repeat2 size="$4" />
        <Text fontSize="$9"> {`${currentSeries}-${currentExercise?.series ?? 0}`} </Text>
      </XStack>
      <XGroup width="100%">
        <XGroup.Item>
          <Button
            width="auto"
            size="$6"
            onPress={previousSeries}
            disabled={!currentExercise || currentSeries <= 1}
            opacity={(!currentExercise || currentSeries <= 1) ? 0.5 : 1}
          >
            <ArrowLeftToLine />
          </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button onPress={finishExercise} flex={1} size="$6"> <Check /> </Button>
        </XGroup.Item>
        <XGroup.Item>
          <Button
            width="auto"
            size="$6"
            onPress={nextSeries}
            disabled={!currentExercise || currentSeries >= currentExercise?.series}
            opacity={(!currentExercise || currentSeries >= currentExercise?.series) ? 0.5 : 1}
          >
            <ArrowRightToLine />
          </Button>
        </XGroup.Item>
      </XGroup>
    </View>
  )
}



