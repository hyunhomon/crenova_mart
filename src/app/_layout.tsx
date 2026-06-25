import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useColorScheme } from 'react-native';

import { CartProvider } from '@/features/cart/model/cart-provider';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <Stack
          screenOptions={{
            headerBackButtonDisplayMode: 'minimal',
            headerShadowVisible: false,
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[productId]" options={{ title: '상품' }} />
          <Stack.Screen name="checkout" options={{ title: '주문서' }} />
        </Stack>
      </CartProvider>
    </ThemeProvider>
  );
}
