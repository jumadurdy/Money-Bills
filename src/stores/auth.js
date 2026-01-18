import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = computed(() => localStorage.getItem("accessToken") !== null);
  const userEmail = computed(() => localStorage.getItem("userEmail") || "");
  function login(email) {

    userEmail.value = email;
    localStorage.setItem("userEmail", email);
  }

  function logout() {
   localStorage.removeItem("accessToken");
   localStorage.removeItem("userEmail");
   localStorage.removeItem("refreshToken");
   localStorage.removeItem("userId");
  }

  return {
    isAuthenticated,
    userEmail,
    login,
    logout
  };
});
