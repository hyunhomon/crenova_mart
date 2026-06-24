import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      iconColor={{ default: colors.textTertiary, selected: colors.brand }}
      indicatorColor={colors.brandWeak}
      labelStyle={{
        default: { color: colors.textTertiary },
        selected: { color: colors.text },
      }}
      minimizeBehavior="onScrollDown"
      tintColor={colors.brand}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>홈</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="home"
          sf={{ default: 'house', selected: 'house.fill' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>검색</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="search"
          sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cart">
        <NativeTabs.Trigger.Label>장바구니</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="shopping_cart"
          sf={{ default: 'cart', selected: 'cart.fill' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="orders">
        <NativeTabs.Trigger.Label>주문</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="local_shipping"
          sf={{ default: 'shippingbox', selected: 'shippingbox.fill' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
