import { Session, User } from "next-auth";

// Auth provider types
export type AuthProvider = "google" | "email" | "github";

// Auth status
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// Extended session type
export interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// Extended user type
export interface ExtendedUser extends User {
  id: string;
}

// Auth error types
export type AuthError =
  | "CredentialsSignin"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "SessionRequired"
  | "Default";

// Auth state
export interface AuthState {
  user: ExtendedUser | null;
  session: ExtendedSession | null;
  status: AuthStatus;
  error: string | null;
}

// Form states
export interface FormState<T = any> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

// API response types
export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Mutation result types
export interface MutationResult<TData = any, TError = any> {
  data?: TData;
  error?: TError;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

// Social auth provider config
export interface SocialProvider {
  id: AuthProvider;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}
