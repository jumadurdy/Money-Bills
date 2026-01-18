<template> burası sılınecek
  <q-page>
    <div class="q-pa-md">
      <!-- LOADING GÖSTER -->
      <q-linear-progress v-if="loading" indeterminate color="primary" />

      <!-- ERROR GÖSTER -->
      <q-banner v-if="error" class="bg-negative text-white q-mb-md">
        {{ error }}
      </q-banner>

      <QList ref="qlistRef">
        <draggable
          v-if="transactionStore.isReordering"
          v-model="draggableItems"
          item-key="id"
          :key="transactionStore.isReordering"
          tag="q-list"
          class="q-list q-list--separator q-list--bordered"
        >
          <template #item="{ element: enter }">
            <q-item>
              <q-item-section>{{ enter.name}}</q-item-section>
              
              <q-item-section side>{{ enter.amount }}</q-item-section>
              <q-item-section side>
                <q-icon name="menu" class="cursor-pointer" />
              </q-item-section>
            </q-item>
          </template>
        </draggable>

        <q-slide-item
          v-for="enter in enteries"
          :key="enter.id"
          @left="onEnterySlideLeft($event, enter)"
          @right="onEnterySlideRight($event, enter)"
          :id="'entry-' + enter.id"
        >
          <template v-slot:right>
            <q-icon name="delete" />
          </template>
          <template v-slot:left>
            <q-icon name="done" />
          </template>

          <q-item :class="{'completed-item': enter.completed}">
            <q-item-section
              class="text-weight-bold"
              :class="useAmountColorText(enter.amount)"
              @click="handleEditStart(enter)"
            >
              <template v-if="editingId === enter.id">
                <q-input
                  dense
                  v-model="description"
                  @keyup.enter="handleSave(enter.id)"
                  @blur="handleSave(enter.id)"
                />
              </template>
              <template v-else>
                <span class="format">{{ enter.name }}</span>
                <span class="formatdate" id="format">Oluşturma tarihi: {{ formatDate(enter.createdAt) }} |
                                                     Güncellendi: {{  formatDate(enter.updatedAt) }} </span>
              </template>
            </q-item-section>

            <q-item-section
              side
              top
              class="text-weight-bold"
              :class="useAmountColorText(enter.amount)"
              @click="handleEditStart(enter)"
            >
              <template v-if="editingId === enter.id">
                <q-input
                  dense
                  v-model="amount"
                  type="number"
                  @keyup.enter="editingId = null; handleSave(enter.id)  "
                  @blur="handleSave(enter.id)"
                />
              </template>
              <template v-else>
                {{ formatCurrency(enter.amount) }}
                <div
                  class="q-mr-md q-pa-sm"
                  :style="{
                    border: '1px solid',
                    borderRadius: '6px',
                    borderColor: useAmountColorText(enter.amount)
                  }"
                >
                  anlık net tutar: {{ formatCurrency(enter.amount) }}
                </div>
              </template>
            </q-item-section>
          </q-item>
          <q-separator spaced inset />
        </q-slide-item>
      </QList>
    </div>

    <q-footer class="bg-white">
      <div class="row q-px-md q-py-sm q-pb-md shadow-up-3">
        <div class="col text-h6" :class="useAmountColorText(balance)">Balance :</div>
        <div class="col text-h6 text-right" :class="useAmountColorText(balance)">
          {{ formatCurrency(balance) }}
        </div>
      </div>
      <q-form @submit="addEntery" class="row q-px-sm q-col-gutter-sm bg-primary">
        <div class="col">
          <q-input
            v-model="addEnteryFrom.name"
            ref="nameRef"
            input-class="text-left"
            outlined
            placeholder="Name"
            bg-color="white"
            input-style="color: var(--q-dark);"
          />
        </div>
        <div class="col">
          <q-input
            v-model="addEnteryFrom.amount"
            ref="amountRef"
            input-class="text-right"
            outlined
            type="number"
            step="0.01"
            placeholder="Amount"
            bg-color="white"
            input-style="color: var(--q-dark);"
          />
        </div>
        <div class="col col-auto">
          <q-btn round color="primary" icon="add" type="submit" />
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup>
/* IMPORT */
import { ref, computed, reactive, nextTick, onMounted, watch } from "vue";
import { uid, useQuasar } from "quasar";
import { useCurrency } from "src/useCurrencify/useCurrencify.js";
import { useAmountColorText } from "src/useCurrencify/useAmountColorText";
import { useEditEntry, scrollToEntry } from "src/useCurrencify/edit-format";
import { useTransactionStore } from "src/stores/transactions.js";
import { useEntries } from "src/composable/useApi";
import draggable from 'vuedraggable';
import { useDebounce } from "src/composable/useDebounce";

/* CONSTANTS */
const formatCurrency = useCurrency();
const transactionStore = useTransactionStore();
const $q = useQuasar();

/* API HOOK */
//  EKLE: API fonksiyonlarını import et
const { getEntries, createEntry, updateEntry, deleteEntry: deleteEntryApi } = useEntries();


/* STATE */
//  EKLE: Loading ve error state'leri
const loading = ref(false);
const error = ref("");

//  KORU: entries ref'i API'den gelecek veriler için
const enteries = ref([]);

//date format function
const formatDate = (dataString) => {
  if(!dataString) return "";
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit' };
  return new Date(dataString).toLocaleDateString('tr-TR', options);
};

//  KORU: Draggable items
const draggableItems = computed({
  get() {
    return transactionStore.items;
  },
  set(newValue) {
    transactionStore.updateItemOrder(newValue);
  },
});

const qlistRef = ref(null);

/* EDIT OPERATIONS */
const { editingId, description, amount, handleEditStart,  } = useEditEntry(
  enteries,
  scrollToEntry
);
// ← EKLE: Debounced değerler
const debouncedDescription = useDebounce(description, 1000);
const debouncedAmount = useDebounce(amount, 1000);
// ← EKLE: Watch ile otomatik kaydet
watch([debouncedDescription, debouncedAmount], async () => {
  if (editingId.value) {
    await handleSave(editingId.value);
  }
});

//  EKLE: API'ye bağlı save işlemi
const handleSave = async (entryId) => {
  const entry = enteries.value.find(e => e.id === entryId);
  if (!entry) return;
    {loading.value = true;
    try {
      await updateEntry(entryId, {
        name: description.value,
        amount: parseFloat(amount.value),
        updatedAt: new Date().toISOString()
      });

      entry.name = description.value;
      entry.amount = amount.value;
      entry.updatedAt = new Date().toISOString();
      editingId.value = null;

      $q.notify({
        message: "Entry Updated",
        position: "top",
        color: "positive"
      });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      error.value = "Failed to update entry";
      $q.notify({
        message: "Update Failed",
        position: "top",
        color: "negative"
      });
    } finally {
      loading.value = false;
    }
  }
};

/* BALANCE CALCULATION */
const balance = computed(() => {
  let total = 0;
  enteries.value.forEach((entry) => {
    total = total + Number(entry.amount);
  });
  return total.toFixed(2);
});

/* ADD ENTRY FORM */
const nameRef = ref(null);
const addEnteryFrom = reactive({
  name: "",
  amount: null,
});

//  DÜZELT: addEntery fonksiyonunu async yap ve API'ye gönder
const addEntery = async () => {
  if (addEnteryFrom.name.trim().length === 0) {
    alert("name is required");
    return;
  }
  if ((addEnteryFrom.amount || "").toString().trim().length === 0) {
    alert("amount is required");
    return;
  }

  //  EKLE: API'ye gönder
  loading.value = true;
  try {
    const response = await createEntry({
      name: addEnteryFrom.name,
      amount: parseFloat(addEnteryFrom.amount)
    });

    //  EKLE: Başarılı ise local state'e ekle
    const newEntry = {
      id: response.id || uid(),
      name: addEnteryFrom.name,
      amount: addEnteryFrom.amount,
      completed: false,
      createdAt: response.createdAt || new Date().toISOString(),
      updatedAt: response.updatedAt || new Date().toISOString(),
    };

    enteries.value.push(newEntry);

    //  KORU: Input'ları temizle
    addEnteryFrom.name = "";
    addEnteryFrom.amount = null;
    if (nameRef.value) {
      nameRef.value.focus();
    }

    nextTick(() => {
      scrollToEntry(newEntry.id);
    });

    $q.notify({
      message: "Entry Added",
      position: "top",
      color: "positive"
    });
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    error.value = "Failed to add entry";
    $q.notify({
      message: "Add Failed",
      position: "top",
      color: "negative"
    });
  } finally {
    loading.value = false;
  }
};

/* SLIDE OPERATIONS */
//  DÜZELT: Silme işlemini API'ye bağla
const onEnterySlideRight = ({ reset }, enter) => {
  $q.dialog({
    title: "Delete Entry",
    message: `
    Delete this entry?
    <div style="margin-top: 16px; font-weight: bold;">
        ${enter.name} : ${formatCurrency(enter.amount)}
    </div>`,
    cancel: true,
    persistent: true,
    html: true,
    ok: {
      label: "Delete",
      color: "negative",
      noCaps: true,
    },
    // eslint-disable-next-line no-dupe-keys
    cancel: {
      color: "positive",
      noCaps: true,
    },
  })
    .onOk(async () => {
      loading.value = true;
      try {
        //  EKLE: API'ye sil isteği gönder
        await deleteEntryApi(enter.id);

        //  EKLE: Başarılı ise local state'ten sil
        const index = enteries.value.findIndex(e => e.id === enter.id);
        if (index !== -1) {
          enteries.value.splice(index, 1);
        }

        $q.notify({
          message: "Entry Deleted",
          position: "top",
          color: "positive"
        });
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        error.value = "Failed to delete entry";
        $q.notify({
          message: "Delete Failed",
          position: "top",
          color: "negative"
        });
      } finally {
        loading.value = false;
      }
    })
    .onCancel(() => {
      reset();
    });
};

//  DÜZELT: Tamamla işlemini API'ye bağla
const onEnterySlideLeft = ({ reset }, enter) => {
  $q.dialog({
    title: "Ödeme bilgilendirmesi!",
    message: `Ödeme yapıldı olarak işaretlenecektir.
    <div style="margin-top: 16px; font-weight: bold;">
       ${enter.name} : ${formatCurrency(enter.amount)}
    </div>`,
    cancel: true,
    persistent: true,
    html: true,
    ok: {
      label: "Ödeme Yapıldı.",
      color: "negative",
      noCaps: true,
    },
    // eslint-disable-next-line no-dupe-keys
    cancel: {
      color: "positive",
      noCaps: true,
    },
  })
    .onOk(async () => {
      const index = enteries.value.findIndex((e) => e.id === enter.id);
      if (index !== -1) {
        enteries.value[index].completed = !enteries.value[index].completed;

        //  EKLE: API'ye güncelle
        try {
          await updateEntry(enter.id, {
            completed: enteries.value[index].completed
          });
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
          console.error("Failed to update completion status");
        }

        $q.notify({
          message: "Ödeme Yapıldı Olarak İşaretlendi!",
          position: "top",
        });
      }
      reset();
    })
    .onCancel(() => {
      reset();
    });
};

/* LIFECYCLE */
//  EKLE: Sayfa yüklenirken veri çek
onMounted(async () => {

  loading.value = true;
  try {
    console.log("Fetching entries...");
    const data = await getEntries();

    console.log('Raw data:', data);

    //  API response'u kontrol et ve doğru array'i çıkar
    let entriesArray = [];

    if (Array.isArray(data)) {
      entriesArray = data;
    } else if (data && Array.isArray(data.data)) {
      entriesArray = data.data;  // {data: [...]} format
    } else if (data && Array.isArray(data.entries)) {
      entriesArray = data.entries;  // {entries: [...]} format
    }

    console.log('Final entries:', entriesArray);
    enteries.value = entriesArray;

  } catch (err) {
    console.error('Error:', err);
    error.value = "Failed to load entries";
    enteries.value = [];  // Hata durumunda boş array
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
:deep(.completed-item .text-weight-bold) {
  text-decoration: line-through !important;
  opacity: 1 !important;
  text-decoration-color: black !important;
}
.format{
  font-size: 20px;
  margin-right: 10px;
}
#format {
  font-size: 10px;
}
</style>
