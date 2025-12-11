import { Play, Repeat, Repeat2, Timer, Weight } from "@tamagui/lucide-icons";
import { Exercise } from "database/useExercisesDatabase";
import { Button, Card, SizableText, XStack, YStack, useTheme } from "tamagui";
import TextTicker from 'react-native-text-ticker'
import { router } from "expo-router";
import { useExercise } from "context/ExerciseContext";

export function ExerciseCard(exercise: Exercise) {
  const theme = useTheme();
  const { startExercise } = useExercise();

  const handleStart = () => {
    startExercise(exercise);
    router.push('/timer');
  };

  return (
    <Card elevate bordered width="100%">
      <XStack>
        <Button onPress={handleStart} borderTopLeftRadius="$2" borderTopRightRadius="$2" borderBottomLeftRadius="$2" borderBottomRightRadius="$2" size="$6" height="100%">
          <Play />
        </Button>
        <YStack justify="space-between" pt="$3" pb="$3" pr="$5" pl="$5" gap="$2" flex={1}>
          <TextTicker
            style={{
              fontSize: 24,
              color: theme.color.get()
            }}
            bounce
            loop
            bounceSpeed={200}
            scrollSpeed={50}
            bounceDelay={2000}
            repeatSpacer={50}
            marqueeDelay={2000}
          >
            {exercise.name}
          </TextTicker>
          <XStack pl="$1.5" gap="$1" justify="space-between">
            <XStack>
              <Repeat2 size="$1" />
              <SizableText size="$2"> {exercise.series} </SizableText>
            </XStack>
            <XStack>
              <Repeat size="$1" />
              <SizableText size="$2"> {exercise.repetitions} </SizableText>
            </XStack>
            <XStack>
              <Weight size="$1" />
              <SizableText size="$2"> {exercise.weight ?? '?'} </SizableText>
            </XStack>
            <XStack>
              <Timer size="$1" />
              <SizableText size="$2"> {exercise.time ? `${+exercise.time / 1000}s` : '?'} </SizableText>
            </XStack>

          </XStack>
        </YStack>
      </XStack>
    </Card>
  )
}
