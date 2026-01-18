<template>
  <q-layout view="hHr lpR lFr">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="absolute-center">
            <q-icon name="savings" />
            Moneyballs
          </div>
        </q-toolbar-title>
        <q-btn flat @click="transactionSort()">{{ buttonText }}</q-btn>
        <!-- <div>Quasar v{{ $q.version }}</div>  --- quasar versiyonunu gösterir-->
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-primary fixed"
      :width="250"
      :breakpoint="767"
      show-if-above
      bordered
    >
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item-label class="text-white" header clickable v-ripple>
            Navigation
          </q-item-label>

          <NavLink v-for="link in navLinks" :key="link.title" v-bind="link" />
          <q-separator spaced inset color="white" />
         <NavLink v-for="link in login"  :key="link.title" v-bind="link"/>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { ref , computed } from "vue";
import NavLink from "src/components/NavLink.vue";
//import useTransAction from "src/stores/transactions.js";
import { useTransactionStore } from "src/stores/transactions";
import { useAuthStore } from "src/stores/auth.js";


const navLinks = [
  {
    title: "Enteries",
    icon: "savings",
    link: "/",
  },
  {
    title: "Settings",
    icon: "settings",
    link: "/settings",
  },
  {
    title:"Error",
    icon :"error",
    link:"/error"
  },

];
const authStore = useAuthStore();
const login = computed(() => [
  {
    title: authStore.isAuthenticated ? "Logout" : "Login",
    icon: authStore.isAuthenticated ? "logout" : "login",
    link: authStore.isAuthenticated ? "/logout" : "/login",
    subtitle: authStore.isAuthenticated ? authStore.userEmail : "",
  },
]);



const leftDrawerOpen = ref(false); // ref  leftDrawerOpen degerini reacktif yapmasını sağlar yani buna baglı degerlerdekı degişiklikler sonucuda anında degişrireecek

const transactionStore = useTransactionStore();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
const buttonText = computed (()=>{
  return transactionStore.isReordering ? 'SORT': 'DONE'
})
function transactionSort() {
  transactionStore.toggleReordering();
}
</script>
<style></style>
