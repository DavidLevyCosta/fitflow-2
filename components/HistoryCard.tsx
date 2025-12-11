import { Repeat, Timer, Weight } from "@tamagui/lucide-icons";
import { ExerciseHistoryWithName } from "database/useExercisesDatabase";
import { useEffect } from "react";
import { Card, Stack, Text, XStack, YStack } from "tamagui";

export function HistoryCard(history: ExerciseHistoryWithName) {

  useEffect(() => {

  }, [history])

  return (
    <Card elevate bordered width="100%">
      <YStack p="$5" gap="$4">
        <XStack justify="space-between" items="center">
          <Text fontSize="$6"> {history.name} </Text>
          <Text fontSize="$3" opacity={0.8}>
            {history.executionDateTime.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </XStack>
        <XStack justify="space-between" items="center" flexWrap="wrap">
          <Stack flexWrap="wrap" justify="center" items="center" flexDirection="row">
            <Repeat size="$1" />
            <Text fontSize="$3"> ~ {Math.round(history.executionRepetition)} </Text>
          </Stack>
          <Stack flexWrap="wrap" justify="center" items="center" flexDirection="row">
            <Weight size="$1" />
            <Text fontSize="$3"> ~ {Math.round(history.executionWeight)} </Text>
          </Stack>
          <Stack flexWrap="wrap" justify="center" items="center" flexDirection="row">
            <Timer size="$1" />
            <Text fontSize="$3"> ~ {Math.round(history.executionTime / 1000)} </Text>
          </Stack>
        </XStack>
      </YStack>
    </Card>
  )
}
