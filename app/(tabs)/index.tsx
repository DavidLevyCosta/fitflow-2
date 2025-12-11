import { HistoryCard } from "components/HistoryCard";
import { ExerciseHistoryWithName, useExercisesDatabase } from "database/useExercisesDatabase";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { View } from "tamagui";

export default function HistoryScreen() {
  const [history, setHistory] = useState<ExerciseHistoryWithName[] | null>([]);
  const exerciseDatabase = useExercisesDatabase();

  async function list() {
    try {
      const response = await exerciseDatabase.getAllHistory();
      setHistory(response);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    list();
  }, [])

  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <FlatList
        data={history}
        keyExtractor={(item) => String(item.id)}
        style={{ width: "100%" }}
        contentContainerStyle={{
          gap: 16,
          paddingRight: 32,
          paddingLeft: 32,
          width: "100%"
        }}
        renderItem={({ item }) =>
          <HistoryCard {...item} />
        }
      />
    </View>
  )
}
