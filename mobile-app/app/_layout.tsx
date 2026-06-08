import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const COLORS = {
  brown: '#5C3D2E',
  orange: '#F97316',
  cream: '#FAF6F1',
};

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.brown },
          headerTintColor: COLORS.cream,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: COLORS.cream },
        }}
      />
    </>
  );
}
