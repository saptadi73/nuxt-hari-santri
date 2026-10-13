export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();
  if (import.meta.client) auth.syncTokensFromCookies();
  else auth.hydrateUserFromToken();

  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login');
  }

  if (!auth.isAdminOrOrganizer) {
    return navigateTo('/dashboard');
  }

});
