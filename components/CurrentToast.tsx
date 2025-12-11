import { Toast, useToastController, useToastState } from '@tamagui/toast'
import { YStack, isWeb } from 'tamagui'

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

export function CurrentToast() {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null

  // Determine theme based on custom data or title
  const isError = currentToast.customData?.type === 'error' || currentToast.title === 'Error'
  const theme = isError ? 'red' : 'green'

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={isWeb ? '$12' : 0}
      theme={theme}
      rounded="$6"
      animation="quick"
    >
      <YStack items="center" p="$2" gap="$2">
        <Toast.Title fontWeight="bold">{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}

export function ToastControl({ type, message }: ToastMessage) {
  const toast = useToastController()

  switch (type) {
    case 'success':
      toast.show('Success', {
        message,
        customData: { type: 'success' }
      })
      break
    case 'error':
      toast.show('Error', {
        message,
        customData: { type: 'error' }
      })
      break
  }
}


