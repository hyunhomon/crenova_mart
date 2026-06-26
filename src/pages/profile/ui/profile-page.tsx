import { Pressable, StyleSheet, View } from 'react-native';
import {
  FileText,
  Headphones,
  LogOut,
  MapPin,
  ShieldCheck,
  UserCog,
} from 'lucide-react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/model';
import { useCart } from '@/features/cart/model';
import { useOrders } from '@/features/orders/model';
import { useTheme } from '@/hooks/use-theme';
import { AppText, Card, Screen } from '@/shared/ui';

const supportRows = [
  { icon: Headphones, label: '고객센터' },
  { icon: ShieldCheck, label: '개인정보 처리방침' },
  { icon: FileText, label: '이용약관' },
] as const;

const accountRows = [
  { icon: UserCog, label: '계정 설정' },
  { icon: MapPin, label: '주소지 설정' },
  { icon: LogOut, label: '로그아웃' },
] as const;

const businessFooterLines = [
  '팬덤& | 대표 장원석 | 사업자등록번호 187-56-00809',
  '주소 대전광역시 서구 계룡로568번길 15-4, 101호(괴정동)',
  '서비스업 | 쇼핑대행',
] as const;

export default function ProfilePage() {
  const auth = useAuth();
  const theme = useTheme();
  const cart = useCart();
  const orders = useOrders();
  const stats = [
    [formatStatCount(cart.summary.itemCount), '장바구니'],
    [formatStatCount(orders.getOrdersByStatus('active').length), '진행중'],
    [formatStatCount(orders.getOrdersByStatus('delivered').length), '배송 완료'],
  ] as const;

  return (
    <Screen contentContainerStyle={styles.content}>
      <Card padded={false} style={styles.identityCard} variant="ghost">
        <AppText style={styles.email} variant="title">
          {auth.session?.email ?? 'mail@example.com'}
        </AppText>
        <AppText color="textSecondary" variant="caption">
          {auth.session?.address ?? '서울시 강남구 테헤란로'}
        </AppText>
      </Card>

      <Card style={styles.statsCard} variant="muted">
        {stats.map(([value, label], index) => (
          <View key={label} style={styles.statItem}>
            <AppText style={styles.statValue} variant="title">
              {value}
            </AppText>
            <AppText color="textSecondary" variant="caption">
              {label}
            </AppText>
            {index < stats.length - 1 && (
              <View style={[styles.statDivider, { backgroundColor: theme.line }]} />
            )}
          </View>
        ))}
      </Card>

      <Card style={styles.menuCard} variant="muted">
        {supportRows.map(({ icon: Icon, label }) => (
          <View key={label} style={styles.menuRow}>
            <Icon color={theme.textTertiary} size={17} strokeWidth={2.3} />
            <AppText color="textSecondary" variant="label">
              {label}
            </AppText>
          </View>
        ))}
      </Card>

      <Card style={styles.menuCard} variant="muted">
        {accountRows.map(({ icon: Icon, label }) => (
          <Pressable
            key={label}
            style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}
            onPress={() => {
              if (label === '로그아웃') {
                void auth.signOut();
              }
            }}>
            <Icon color={theme.textTertiary} size={17} strokeWidth={2.3} />
            <AppText color="textSecondary" variant="label">
              {label}
            </AppText>
          </Pressable>
        ))}
      </Card>

      <Card padded={false} style={styles.businessFooter} variant="ghost">
        {businessFooterLines.map((line) => (
          <AppText key={line} color="textTertiary" style={styles.businessText} variant="caption">
            {line}
          </AppText>
        ))}
      </Card>
    </Screen>
  );
}

function formatStatCount(count: number) {
  return count >= 10000 ? `${Math.floor(count / 10000)}만` : String(count);
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.four,
  },
  email: {
    fontSize: 18,
    lineHeight: 24,
  },
  identityCard: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  menuCard: {
    gap: Spacing.five,
    paddingVertical: Spacing.five,
  },
  menuRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 24,
  },
  pressed: {
    opacity: 0.72,
  },
  statDivider: {
    bottom: Spacing.two,
    position: 'absolute',
    right: 0,
    top: Spacing.two,
    width: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.one,
    justifyContent: 'center',
    minHeight: 56,
    position: 'relative',
  },
  statsCard: {
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: 0,
    paddingHorizontal: 0,
    paddingVertical: Spacing.three,
  },
  statValue: {
    fontVariant: ['tabular-nums'],
  },
  businessFooter: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingTop: Spacing.two,
  },
  businessText: {
    lineHeight: 15,
  },
});
