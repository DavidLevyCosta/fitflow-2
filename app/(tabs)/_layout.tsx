import { Tabs } from 'expo-router'
import { useTheme } from 'tamagui'
import { ClockFading, Hourglass, Weight } from '@tamagui/lucide-icons'
import { useExercise } from 'context/ExerciseContext'

export default function TabLayout() {
  const theme = useTheme()
  const currentExercise = useExercise();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <ClockFading color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="selector"
        options={{
          title: 'Selector',
          tabBarIcon: ({ color }) => <Weight color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => <Hourglass color={color as any} />,
          href: currentExercise ? '/timer' : null,
        }}
      />
    </Tabs>
  )
}
