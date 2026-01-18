<template>
  <q-page class="q-pa-md">

    <div class="text-h6 q-mb-md">Entries</div>

    <q-list bordered separator>

        <q-item tag="label" v-ripple>
            <q-item-section>
                <q-item-label>Prompt to Delete</q-item-label>
            </q-item-section>
            <q-item-section side>
                <q-toggle v-model="settingsStore.promptToDelete" />
            </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
            <q-item-section>
                <q-item-label>Show Running Balance</q-item-label>
            </q-item-section>
            <q-item-section side>
                <q-toggle v-model="settingsStore.showRunningBalance" />
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section>
                <q-select
                    v-model="settingsStore.currencySymbol"
                    :options="settingsStore.availableCurrencySembols"
                    label="Currency Symbol"
                    dense
                    outlined

                    emit-value
                    map-options
                    @update:model-value="settingsStore.setCurrencySymbol"
                />
            </q-item-section>
        </q-item>

    </q-list>

    <div class="text-h6 q-mt-lg q-mb-md">Appearance</div>

    <q-list bordered separator>
        <q-item tag="label" v-ripple>
            <q-item-section avatar>
                <q-radio
                    v-model="themeStore.theme"
                    val="light"
                    label="Light"
                    @update:model-value="themeStore.setTheme "
                />
            </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
            <q-item-section avatar>
                <q-radio
                    v-model="themeStore.theme"
                    val="dark"
                    label="Dark"
                    @update:model-value="themeStore.setTheme "
                />
            </q-item-section>
        </q-item>


    </q-list>

  </q-page>
</template>

<script setup>
import { useSettingsStore } from 'src/stores/settings.js';
import { useThemeStore } from 'src/stores/theme_stores';



const settingsStore = useSettingsStore();
const themeStore = useThemeStore();

// Sayfa yüklendiğinde temayı Pinia Store'daki değere ayarla
themeStore.setTheme(themeStore.theme);

// kullanılacak quasar özellikleri
   //- Q-list mantıksal gruplara ayırmak için
   //- Q-İtem her bir ayar satırı için
   //- V-Model (Q-Toggle, Q-Input, Q-Radio)
   //-  useQuasar  -- temayı yonetme (light/Dark)

</script>




