import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

const tabs = [
  {
    href: '/',
    icon: { android: 'home', ios: 'house', web: 'home' },
    iconSelected: { android: 'home', ios: 'house.fill', web: 'home' },
    label: '홈',
    name: 'home',
  },
  {
    href: '/search',
    icon: { android: 'search', ios: 'magnifyingglass', web: 'search' },
    iconSelected: { android: 'search', ios: 'magnifyingglass', web: 'search' },
    label: '검색',
    name: 'search',
  },
  {
    href: '/cart',
    icon: { android: 'shopping_cart', ios: 'cart', web: 'shopping_cart' },
    iconSelected: { android: 'shopping_cart', ios: 'cart.fill', web: 'shopping_cart' },
    label: '장바구니',
    name: 'cart',
  },
  {
    href: '/orders',
    icon: { android: 'local_shipping', ios: 'shippingbox', web: 'local_shipping' },
    iconSelected: { android: 'local_shipping', ios: 'shippingbox.fill', web: 'local_shipping' },
    label: '주문',
    name: 'orders',
  },
  {
    href: '/profile',
    icon: { android: 'person', ios: 'person', web: 'person' },
    iconSelected: { android: 'person', ios: 'person.fill', web: 'person' },
    label: '프로필',
    name: 'profile',
  },
] as const;

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <CustomTabList>
          {tabs.map((item) => (
            <TabTrigger key={item.name} name={item.name} href={item.href} asChild>
              <TabButton icon={item.icon} iconSelected={item.iconSelected}>
                {item.label}
              </TabButton>
            </TabTrigger>
          ))}
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

type TabIconName = (typeof tabs)[number]['icon'] | (typeof tabs)[number]['iconSelected'];

type TabButtonProps = TabTriggerSlotProps & {
  icon: TabIconName;
  iconSelected: TabIconName;
};

export function TabButton({
  children,
  icon,
  iconSelected,
  isFocused,
  ...props
}: TabButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const tintColor = isFocused ? colors.brand : colors.textTertiary;

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <SymbolView
        name={isFocused ? iconSelected : icon}
        size={22}
        tintColor={tintColor}
        weight={isFocused ? 'semibold' : 'regular'}
      />
      <ThemedView type="background" style={styles.tabLabelView}>
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView
        type="backgroundElement"
        style={[styles.innerContainer, { borderColor: colors.line }]}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    height: '100%',
  },
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    minHeight: 72,
    paddingBottom: Spacing.two,
    paddingHorizontal: Spacing.one,
    paddingTop: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexGrow: 1,
    gap: Spacing.one,
    maxWidth: MaxContentWidth,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButton: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    flex: 1,
    gap: Spacing.one,
    justifyContent: 'center',
    minHeight: 56,
  },
  tabLabelView: {
    backgroundColor: 'transparent',
  },
});
