import { useFonts } from 'expo-font';
import { DarkTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';

import { CartProvider } from '@/features/cart/model/cart-provider';
import { OrdersProvider } from '@/features/orders/model';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-Regular': require('@/assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-SemiBold': require('@/assets/fonts/Pretendard-SemiBold.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <OrdersProvider>
        <CartProvider>
          <Stack
            screenOptions={{
              headerShadowVisible: false,
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="product/[productId]" options={{ headerShown: false }} />
            <Stack.Screen name="checkout" options={{ headerShown: false }} />
            <Stack.Screen name="checkout/success" options={{ headerShown: false }} />
            <Stack.Screen name="checkout/fail" options={{ headerShown: false }} />
            <Stack.Screen name="orders/[orderId]" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
          </Stack>
        </CartProvider>
      </OrdersProvider>
    </ThemeProvider>
  );
}
