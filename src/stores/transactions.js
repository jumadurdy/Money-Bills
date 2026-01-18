import {   } from "vue";
import { defineStore } from "pinia";

export const useTransactionStore = defineStore('transaction',{
  state:()=>({
    items:[

    ],
    isReordering: true,

  }),

actions: {
    toggleReordering() {
      this.isReordering = !this.isReordering;
      if (!this.isReordering) {
         // Eğer Done (Bitti) butonuna basıldıysa, burada sıralamayı kaydetme mantığı olur.
         console.log("Sıralama kaydedildi. (Şimdilik)");
      }
    },
    updateItemOrder(newOrder) {
      this.items = newOrder;
    },
  },
});
