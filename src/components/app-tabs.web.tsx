import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Radius, Spacing } from '@/constants/theme';
import { AppText, Card } from '@/shared/ui';
import { useTheme } from '@/hooks/use-theme';

const tabIconPaths = {
  cart:
    'M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM1 2v2h2l3.6 7.59-1.35 2.45C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21 4H5.21l-.94-2H1Zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z',
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5Z',
  orders:
    'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4ZM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5Zm12 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5ZM17 12V9.5h2.5l1.96 2.5H17Z',
  profile:
    'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z',
  search:
    'M9.5 3C5.91 3 3 5.91 3 9.5S5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57L19.29 20l1.41-1.41-5.56-5.56A6.471 6.471 0 0 0 16 9.5C16 5.91 13.09 3 9.5 3Zm0 2C11.99 5 14 7.01 14 9.5S11.99 14 9.5 14 5 11.99 5 9.5 7.01 5 9.5 5Z',
} as const;

type TabIconName = keyof typeof tabIconPaths;

const tabs = [
  {
    href: '/',
    icon: 'home',
    label: '홈',
    name: 'home',
  },
  {
    href: '/search',
    icon: 'search',
    label: '검색',
    name: 'search',
  },
  {
    href: '/cart',
    icon: 'cart',
    label: '장바구니',
    name: 'cart',
  },
  {
    href: '/orders',
    icon: 'orders',
    label: '주문',
    name: 'orders',
  },
  {
    href: '/profile',
    icon: 'profile',
    label: '프로필',
    name: 'profile',
  },
] as const satisfies readonly {
  href: string;
  icon: TabIconName;
  label: string;
  name: string;
}[];

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
  icon: TabIconName;
};

export function TabButton({
  children,
  icon,
  isFocused,
  ...props
}: TabButtonProps) {
  const theme = useTheme();
  const tintColor = isFocused ? theme.text : theme.textTertiary;

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <FilledTabIcon color={tintColor} name={icon} />
      <View style={styles.tabLabelView}>
        <AppText color={isFocused ? 'text' : 'textSecondary'} selectable={false} variant="caption">
          {children}
        </AppText>
      </View>
    </Pressable>
  );
}

function FilledTabIcon({ color, name }: { color: string; name: TabIconName }) {
  return (
    <Svg height={23} viewBox="0 0 24 24" width={23}>
      <Path d={tabIconPaths[name]} fill={color} fillRule="evenodd" />
    </Svg>
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
