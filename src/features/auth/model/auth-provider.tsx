import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getPreference, removePreference, setPreference } from '@/shared/lib/storage';

const AUTH_SESSION_KEY = 'fandom-and:auth-session';

export type MockAuthSession = {
  address: string;
  email: string;
};

type AuthInput = {
  address?: string;
  email?: string;
};

type AuthStore = {
  isReady: boolean;
  session: MockAuthSession | null;
  signIn: (input: AuthInput) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (input: AuthInput) => Promise<void>;
};

const AuthContext = createContext<AuthStore | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

const fallbackSession: MockAuthSession = {
  address: '서울시 강남구 테헤란로',
  email: 'mail@example.com',
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isReady, setReady] = useState(false);
  const [session, setSession] = useState<MockAuthSession | null>(null);

  useEffect(() => {
    let mounted = true;

    getPreference<MockAuthSession | null>(AUTH_SESSION_KEY, null)
      .then((storedSession) => {
        if (mounted) {
          setSession(storedSession);
        }
      })
      .catch((error) => {
        console.error('Failed to load auth session.', error);
      })
      .finally(() => {
        if (mounted) {
          setReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const saveSession = useCallback((input: AuthInput) => {
    const nextSession = normalizeSession(input);

    if (!nextSession) {
      return Promise.resolve();
    }

    setSession(nextSession);
    void setPreference(AUTH_SESSION_KEY, nextSession).catch((error) => {
      console.error('Failed to save auth session.', error);
    });

    return Promise.resolve();
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    void removePreference(AUTH_SESSION_KEY).catch((error) => {
      console.error('Failed to remove auth session.', error);
    });

    return Promise.resolve();
  }, []);

  const store = useMemo<AuthStore>(
    () => ({
      isReady,
      session,
      signIn: saveSession,
      signOut,
      signUp: saveSession,
    }),
    [isReady, saveSession, session, signOut]
  );

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const store = use(AuthContext);

  if (!store) {
    throw new Error('AuthProvider is missing.');
  }

  return store;
}

function normalizeSession(input: AuthInput): MockAuthSession | null {
  const email = input.email?.trim();

  if (!email) {
    return null;
  }

  return {
    address: input.address?.trim() || fallbackSession.address,
    email,
  };
}
