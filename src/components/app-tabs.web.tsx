import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import {
  House,
  PackageCheck,
  Search,
  ShoppingCart,
  UserRound,
} from 'lucide-react-native';
import { type ComponentType } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { AppText, Card } from '@/shared/ui';
import { useTheme } from '@/hooks/use-theme';

type TabIcon = ComponentType<{
  color?: string;
  fill?: string;
  fillOpacity?: number;
  size?: number;
  strokeWidth?: number;
}>;

const tabs = [
  {
    href: '/',
    icon: House,
    label: '홈',
    name: 'home',
  },
  {
    href: '/search',
    icon: Search,
    label: '검색',
    name: 'search',
  },
  {
    href: '/cart',
    icon: ShoppingCart,
    label: '장바구니',
    name: 'cart',
  },
  {
    href: '/orders',
    icon: PackageCheck,
    label: '주문',
    name: 'orders',
  },
  {
    href: '/profile',
    icon: UserRound,
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
              <TabButton icon={item.icon}>
                {item.label}
              </TabButton>
            </TabTrigger>
          ))}
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  icon: TabIcon;
};

export function TabButton({
  children,
  icon,
  isFocused,
  ...props
}: TabButtonProps) {
  const theme = useTheme();
  const Icon = icon;
  const tintColor = isFocused ? theme.text : theme.textTertiary;
  const fillColor = isFocused ? theme.text : theme.textTertiary;

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <Icon
        color={tintColor}
        fill={fillColor}
        fillOpacity={isFocused ? 0.22 : 0.1}
        size={22}
        strokeWidth={isFocused ? 2.6 : 2.2}
      />
      <View style={styles.tabLabelView}>
        <AppText color={isFocused ? 'text' : 'textSecondary'} selectable={false} variant="caption">
          {children}
        </AppText>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <Card padded={false} style={styles.innerContainer} variant="muted">
        {props.children}
      </Card>
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
    left: 0,
    right: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    minHeight: 78,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.two,
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexGrow: 1,
    gap: Spacing.one,
    width: '100%',
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
