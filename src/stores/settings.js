 import { defineStore } from "pinia";
import { useQuasar } from "quasar";

export const useSettingsStore = defineStore('settings',{
  state:()=>({
    promptToDelete: true,  //enteries:silme uyarısı,
    showRunningBalance: false,   //enteries: bakiye göstermesi,
    currencySymbol: '$',
    availableCurrencySembols:[
      '$', // USD/Various
      '€', // Euro
      '£', // Pound Sterling
      '₺', // Turkish Lira (based on the comments)

    ],  //enteries:para birimi,
    theme: 'light, '   // appearance: light,dark ,auto,
  }),
  actions:{
    // 1. Yeni action: Para birimi sembolünü değiştir
    setCurrencySymbol(newSymbol) {
        this.currencySymbol = newSymbol;
    },
    // Tema değişimini hem Store'da hem de Quasar'da uygular
    setTheme(newTheme){
      this.theme = newTheme;
      const $q=useQuasar();
      if (newTheme === 'auto'){
        $q.dark.set('auto');
      }else{
        // 'light' için false, 'dark' için true
        $q.dark.set (newTheme==='dark');
      }
    }
  },
})
