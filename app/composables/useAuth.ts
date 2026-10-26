import type { useApi, ApiResponse } from '~/composables/useApi';
import { useRegistrationFlow } from '~/composables/useRegistrationFlow';
import type { RegistrationFlowState } from '~/composables/useRegistrationFlow';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  full_name: string;
  country?: string;
  province_code?: string;
  regency_code?: string;
  district_code?: string;
  village_code?: string;
  phone: string;
  password: string;
  preferred_locale?: 'id';
}

interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
  confirm_password: string;
}

interface AuthUserPayload {
  id?: string;
  email: string;
  full_name?: string;
  role?: string;
  preferred_locale?: 'id';
}

type LoginResponse = RegistrationFlowState & {
  user: AuthUserPayload;
  access_token: string;
  refresh_token: string;
};

export function useAuth() {
  const authStore = useAuthStore();
  const { setLocale } = useI18n();
  const registrationFlow = useRegistrationFlow();
  const api = useNuxtApp().$api as ReturnType<typeof useApi>;

  const login = async (payload: LoginPayload) => {
    const result = await api<ApiResponse<LoginResponse>>(
      '/auth/login',
      { method: 'POST', body: payload }
    );

    if (result.success) {
      authStore.setTokens({
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token
      });
      authStore.setUser(result.data.user);
      authStore.hydrateUserFromToken();
      await setLocale('id');
      registrationFlow.primeFlow(result.data);
    }
    return result;
  };

  const register = async (payload: RegisterPayload) => {
    const result = await api<ApiResponse<{ user: AuthUserPayload; access_token: string; refresh_token: string }>>(
      '/auth/register',
      { method: 'POST', body: payload }
    );

    if (result.success) {
      authStore.setTokens({
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token
      });
      authStore.setUser(result.data.user);
      authStore.hydrateUserFromToken();
    }
    return result;
  };

  const logout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } finally {
      authStore.clearToken();
    }
  };

  const changePassword = (payload: ChangePasswordPayload) =>
    api<ApiResponse<Record<string, unknown>>>('/auth/password', { method: 'PUT', body: payload });

  const forgotPassword = (email: string) =>
    api<ApiResponse<Record<string, unknown>>>('/auth/forgot-password', {
      method: 'POST',
      body: { email }
    });

  const resetPassword = (payload: ResetPasswordPayload) =>
    api<ApiResponse<Record<string, unknown>>>('/auth/reset-password', {
      method: 'POST',
      body: payload
    });

  const updatePreferredLocale = async (_preferredLocale: 'id' = 'id') => {
    const result = await api<ApiResponse<AuthUserPayload>>('/auth/me', {
      method: 'PUT',
      body: { preferred_locale: 'id' }
    });
    if (result.success) authStore.setUser(result.data);
    return result;
  };

  return { login, register, logout, changePassword, forgotPassword, resetPassword, updatePreferredLocale, authStore };
}
