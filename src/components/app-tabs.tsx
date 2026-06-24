import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';
import { useCart } from '@/features/cart/model';

export default function AppTabs() {
  const colors = Colors.dark;
  const cart = useCart();

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
        {cart.summary.itemCount > 0 && (
          <NativeTabs.Trigger.Badge>{String(cart.summary.itemCount)}</NativeTabs.Trigger.Badge>
        )}
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

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>프로필</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="person"
          sf={{ default: 'person', selected: 'person.fill' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
