import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { useAuth } from '@/features/auth/model';
import { Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppText, BrandLogo, Button, TextField } from '@/shared/ui';

type AuthMode = 'login' | 'signup';
type SocialProvider = 'naver' | 'kakao' | 'google';

const socialProviders = [
  { label: '네이버', value: 'naver' },
  { label: '카카오', value: 'kakao' },
  { label: '구글', value: 'google' },
] as const satisfies readonly { label: string; value: SocialProvider }[];

export default function AuthPage() {
  const auth = useAuth();
  const theme = useTheme();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [recoveryValue, setRecoveryValue] = useState('');
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);
  const canSubmit = email.trim().length > 0;

  function submit() {
    if (!canSubmit) {
      return;
    }

    const input = {
      email,
    };

    if (mode === 'signup') {
      void auth.signUp(input);
      return;
    }

    void auth.signIn(input);
  }

  function signInWithSocial(provider: SocialProvider) {
    void auth.signIn({
      email: `${provider}@fandom-and.mock`,
    });
  }

  function openPasswordRecovery() {
    setShowPasswordRecovery(true);
    setRecoverySubmitted(false);
    setRecoveryValue('');
  }

  function closeRecovery() {
    setShowPasswordRecovery(false);
    setRecoverySubmitted(false);
    setRecoveryValue('');
  }

  function openSignup() {
    setMode('signup');
    setPassword('');
    setPasswordConfirm('');
  }

  function closeSignup() {
    setMode('login');
    setPassword('');
    setPasswordConfirm('');
  }

  if (showPasswordRecovery) {
    return (
      <AuthShell>
        <View style={styles.recoveryScreen}>
          <Pressable
            accessibilityRole="button"
            hitSlop={Spacing.two}
            style={styles.backButton}
            onPress={closeRecovery}>
            <AppText selectable={false} style={styles.backIcon}>
              ‹
            </AppText>
          </Pressable>

          <View style={styles.recoveryHeader}>
            <AppText style={styles.recoveryTitle} variant="h1">
              비밀번호 찾기
            </AppText>
            <AppText color="textSecondary" style={styles.heroCaption} variant="body">
              가입한 이메일을 입력해 주세요.
            </AppText>
          </View>

          <View style={styles.form}>
            <TextField
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="이메일 입력"
              style={styles.input}
              textContentType="emailAddress"
              value={recoveryValue}
              onChangeText={(nextValue) => {
                setRecoveryValue(nextValue);
                setRecoverySubmitted(false);
              }}
            />

            <Button
              fullWidth
              size="lg"
              style={styles.submitButton}
              variant="inverted"
              onPress={() => setRecoverySubmitted(true)}>
              재설정 링크 받기
            </Button>

            {recoverySubmitted && (
              <View style={[styles.recoveryResult, { backgroundColor: theme.backgroundElement }]}>
                <AppText variant="label">입력한 이메일로 안내를 보냈어요.</AppText>
              </View>
            )}
          </View>
        </View>
      </AuthShell>
    );
  }

  if (mode === 'signup') {
    return (
      <AuthShell>
        <View style={styles.signupScreen}>
          <Pressable
            accessibilityRole="button"
            hitSlop={Spacing.two}
            style={styles.backButton}
            onPress={closeSignup}>
            <AppText selectable={false} style={styles.backIcon}>
              ‹
            </AppText>
          </Pressable>

          <View style={styles.signupHeader}>
            <AppText style={styles.recoveryTitle} variant="h1">
              회원가입
            </AppText>
            <AppText color="textSecondary" style={styles.heroCaption} variant="body">
              이메일로 팬덤& 계정을 만들어요.
            </AppText>
          </View>

          <View style={styles.form}>
            <View style={styles.fields}>
              <TextField
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="이메일 입력"
                style={styles.input}
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
              />
              <TextField
                autoCapitalize="none"
                placeholder="비밀번호 입력"
                secureTextEntry
                style={styles.input}
                textContentType="newPassword"
                value={password}
                onChangeText={setPassword}
              />
              <TextField
                autoCapitalize="none"
                placeholder="비밀번호 재확인"
                secureTextEntry
                style={styles.input}
                textContentType="newPassword"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
              />
            </View>

            <Button
              disabled={!canSubmit}
              fullWidth
              size="lg"
              style={styles.submitButton}
              variant="inverted"
              onPress={submit}>
              회원가입
            </Button>
          </View>
        </View>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <View style={styles.inner}>
        <View style={styles.hero}>
          <BrandLogo height={31} width={112} />
          <AppText style={styles.heroTitle} variant="h1">
            환영합니다.
          </AppText>
          <AppText color="textSecondary" style={styles.heroCaption} variant="body">
            로그인하고 팬덤&의 상품을 만나보세요.
          </AppText>
        </View>

        <View style={styles.form}>
          <View style={styles.fields}>
            <TextField
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="이메일 입력"
              style={styles.input}
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />
            <TextField
              autoCapitalize="none"
              placeholder="비밀번호 입력"
              secureTextEntry
              style={styles.input}
              textContentType="password"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Button
            disabled={!canSubmit}
            fullWidth
            size="lg"
            style={styles.submitButton}
            variant="inverted"
            onPress={submit}>
            로그인
          </Button>

          <View style={styles.textActions}>
            <TextAction label="회원가입" onPress={openSignup} />
            <View style={[styles.actionDivider, { backgroundColor: theme.lineStrong }]} />
            <TextAction label="비밀번호 찾기" onPress={openPasswordRecovery} />
          </View>
        </View>

        <View style={styles.socialSection}>
          <View style={styles.socialLabelRow}>
            <View style={[styles.socialLine, { backgroundColor: theme.lineStrong }]} />
            <AppText color="textTertiary" style={styles.socialLabel} variant="body">
              SNS 계정으로 로그인
            </AppText>
            <View style={[styles.socialLine, { backgroundColor: theme.lineStrong }]} />
          </View>

          <View style={styles.socialButtons}>
            {socialProviders.map((provider) => (
              <SocialLoginButton
                key={provider.value}
                label={provider.label}
                provider={provider.value}
                onPress={() => signInWithSocial(provider.value)}
              />
            ))}
          </View>
        </View>
      </View>
    </AuthShell>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + Spacing.eight,
            paddingTop: insets.top + Spacing.twenty,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

function TextAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" hitSlop={Spacing.two} onPress={onPress}>
      <AppText selectable={false} variant="body">
        {label}
      </AppText>
    </Pressable>
  );
}

function SocialLoginButton({
  label,
  onPress,
  provider,
}: {
  label: string;
  onPress: () => void;
  provider: SocialProvider;
}) {
  const theme = useTheme();
  const isGoogle = provider === 'google';
  const backgroundColor =
    provider === 'naver' ? '#03C75A' : provider === 'kakao' ? '#FEE500' : theme.surface;
  const borderColor = isGoogle ? theme.lineStrong : backgroundColor;

  return (
    <Pressable
      accessibilityLabel={`${label}로 로그인`}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.socialButton,
        {
          backgroundColor,
          borderColor,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      onPress={onPress}>
      <SocialIcon provider={provider} />
    </Pressable>
  );
}

function SocialIcon({ provider }: { provider: SocialProvider }) {
  if (provider === 'naver') {
    return (
      <Svg height={21} viewBox="0 0 24 24" width={21}>
        <Path
          d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"
          fill="#FFFFFF"
        />
      </Svg>
    );
  }

  if (provider === 'kakao') {
    return (
      <Svg height={28} viewBox="0 0 122.88 122.88" width={28}>
        <Path
          d="M61.44 17.28c-27.57 0-49.92 17.62-49.92 39.36 0 14.05 9.34 26.39 23.4 33.35-.76 2.64-4.91 16.97-5.08 18.09 0 0-.1.85.45 1.17.55.32 1.19.07 1.19.07 1.57-.22 18.21-11.91 21.09-13.94 2.88.41 5.84.62 8.87.62 27.57 0 49.92-17.62 49.92-39.36 0-21.74-22.35-39.36-49.92-39.36Z"
          fill="#181600"
        />
      </Svg>
    );
  }

  return (
    <Svg height={24} viewBox="0 0 118 120" width={24}>
      <Path
        d="M117.6 61.3636C117.6 57.1091 117.2182 53.0182 116.5091 49.0909H60V72.3H92.2909C90.9 79.8 86.6727 86.1545 80.3182 90.4091V105.4636H99.7091C111.0545 95.0182 117.6 79.6364 117.6 61.3636Z"
        fill="#4285F4"
      />
      <Path
        d="M60 120C76.2 120 89.7818 114.6273 99.7091 105.4636L80.3182 90.4091C74.9455 94.0091 68.0727 96.1364 60 96.1364C44.3727 96.1364 31.1455 85.5818 26.4273 71.4H6.3818V86.9455C16.2545 106.5545 36.5455 120 60 120Z"
        fill="#34A853"
      />
      <Path
        d="M26.4273 71.4C25.2273 67.8 24.5455 63.9545 24.5455 60C24.5455 56.0455 25.2273 52.2 26.4273 48.6V33.0545H6.3818C2.3182 41.1545 0 50.3182 0 60C0 69.6818 2.3182 78.8455 6.3818 86.9455L26.4273 71.4Z"
        fill="#FBBC05"
      />
      <Path
        d="M60 23.8636C68.8091 23.8636 76.7182 26.8909 82.9364 32.8364L100.1455 15.6273C89.7545 5.9455 76.1727 0 60 0C36.5455 0 16.2545 13.4455 6.3818 33.0545L26.4273 48.6C31.1455 34.4182 44.3727 23.8636 60 23.8636Z"
        fill="#EA4335"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  actionDivider: {
    height: 14,
    width: StyleSheet.hairlineWidth,
  },
  backButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  backIcon: {
    fontSize: 34,
    lineHeight: 38,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.six,
  },
  fields: {
    gap: Spacing.four,
  },
  form: {
    gap: Spacing.five,
  },
  hero: {
    gap: Spacing.three,
  },
  heroCaption: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 38,
    marginTop: Spacing.two,
  },
  inner: {
    alignSelf: 'center',
    gap: Spacing.twelve,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: Radius.md,
    fontSize: 16,
    minHeight: 64,
    paddingHorizontal: Spacing.five,
  },
  root: {
    flex: 1,
  },
  recoveryHeader: {
    gap: Spacing.three,
  },
  recoveryResult: {
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    padding: Spacing.four,
  },
  recoveryScreen: {
    alignSelf: 'center',
    gap: Spacing.twelve,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  recoveryTitle: {
    fontSize: 30,
    lineHeight: 38,
  },
  signupHeader: {
    gap: Spacing.three,
  },
  signupScreen: {
    alignSelf: 'center',
    gap: Spacing.twelve,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  socialButton: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.full,
    borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: Spacing.four,
    justifyContent: 'center',
  },
  socialLabel: {
    fontFamily: Fonts.sans,
    textAlign: 'center',
  },
  socialLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.four,
  },
  socialLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  socialSection: {
    gap: Spacing.six,
    paddingTop: Spacing.twelve,
  },
  submitButton: {
    minHeight: 58,
  },
  textActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.four,
    justifyContent: 'center',
    paddingTop: Spacing.one,
  },
});
