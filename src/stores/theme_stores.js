import { defineStore } from "pinia";
import { ref } from "vue";
import { Dark } from "quasar";

// 1. Yeni: Başlangıç teması için localStorage kontrolü ekleniyor
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem('appTheme');
  if (storedTheme) {
    // Kayıtlı bir tema varsa onu kullan
    return storedTheme;
  }
  // Yoksa Quasar'ın anlık durumunu kullan
  return Dark.mode === 'auto' ? 'auto' : (Dark.isActive ? 'dark':'light');
};

export const useThemeStore = defineStore('theme' , ()=>{
  const theme = ref(getInitialTheme());

  // eylem actions
  function setTheme (newTheme){

    //2.quasar modunu ayarlama
    if (newTheme === 'dark'){
      Dark.set(true); // true dark mod
    }else if (newTheme === 'light'){
      Dark.set(false); //false light mod
    }

    localStorage.setItem('appTheme' , newTheme)
  }
  return{
    theme,setTheme
  };
})
