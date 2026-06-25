import { Stack } from 'expo-router/stack';

export const unstable_settings = {
  anchor: 'search',
};

export default function SearchStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
