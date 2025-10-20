//@ts-nocheck for removing ts related errors
import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { createUser, getUserByEmail, getUserByUsername } from '@/db/user';

const AuthContext = createContext<{
  signIn: (username: string, email?: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: async (username: string, email?: string) => {
          // Try finding an existing user by email or username, else create one
          const existing = email
            ? await getUserByEmail(email)
            : await getUserByUsername(username);

          if (existing) {
            setSession(existing.id.toString());
            return;
          }

          const newUserId = await createUser({
            username,
            email: email ?? undefined,
            profile_pic: null,
          });
          setSession(newUserId.toString());
        },
        signOut: async () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
