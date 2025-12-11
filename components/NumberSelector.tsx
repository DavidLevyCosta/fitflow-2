import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import { JSX } from "react";
import { YStack, XGroup, Button, Text, View } from "tamagui";
import type { IconProps } from "@tamagui/helpers-icon";

type IconComponent = (props: IconProps) => JSX.Element;

export function NumberSelector({
  max,
  min = 0,
  value,
  Icon,
  onChange
}: {
  max?: number,
  min?: number,
  value: number,
  Icon: IconComponent
  onChange: (value: number) => void
}) {

  const increase = () => {
    if (max && value > max) return;
    onChange(value + 1);
  }

  const decrease = () => {
    if (value >= min) onChange(value - 1);
  }

  return (
    <YStack items="center" justify="center" gap="$4">
      <Icon />
      <XGroup>
        <XGroup.Item>
          <Button onPress={decrease} width="$2" height="$4"><ChevronLeft /></Button>
        </XGroup.Item>
        <XGroup.Item>
          <View bg="$color2" height="auto" pr="$4" pl="$4" items="center" justify="center">
            <Text fontSize="$6">{value}</Text>
          </View>
        </XGroup.Item>
        <XGroup.Item>
          <Button onPress={increase} width="$2" height="$4"><ChevronRight /></Button>
        </XGroup.Item>
      </XGroup>
    </YStack>
  )
}
