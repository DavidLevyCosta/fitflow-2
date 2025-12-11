import { ExerciseCard } from 'components/ExerciseCard';
import { Exercise, useExercisesDatabase } from 'database/useExercisesDatabase'
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { View } from 'tamagui'


export default function SelectorScreen() {
  const [exercises, setExercises] = useState<Exercise[] | null>([]);
  const exerciseDatabase = useExercisesDatabase();

  async function list() {
    try {
      const response = await exerciseDatabase.getAll();
      setExercises(response);
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
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        style={{ width: "100%" }}
        contentContainerStyle={{
          gap: 16,
          paddingRight: 32,
          paddingLeft: 32,
          width: "100%"
        }}
        renderItem={({ item }) =>
          <ExerciseCard {...item} />
        }
      />
    </View>
  )
}
