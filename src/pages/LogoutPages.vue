<template>
  <div class="q-pa-lg fullscreen flex flex-center">
    <q-card class="my-card bg-primary" flat bordered>
      <q-card-section>
        <div style="color: aliceblue;" class="text-h6 text-center">
          <q-icon name="savings" size="sm" class="q-mr-sm" />
          Money Balls
        </div>
      </q-card-section>

      <div style="width: 100%" class="flex flex-center">
        <q-form
          style="width: 80%"
          class="flex flex-center"
          @submit.prevent="handleSubmit"
        >
          <div class="q-mb-lg">
            <q-tabs v-model="tab" class="text-teal">
              <q-tab label="Login" name="one" style="color: aliceblue;" />
              <q-tab label="Register" name="two" style="color: aliceblue;" />
            </q-tabs>
          </div>
          <q-separator />

          <q-tab-panels
            v-model="tab"
            animated
            style="background: none; width: 100%"
          >
            <!-- LOGIN TAB -->
            <q-tab-panel name="one" class="q-pa-none">
              <q-input
                outlined
                v-model="email"
                type="email"
                label="Email"
                class="q-mb-lg"
                bg-color="white"
                :rules="[val => !!val || 'Email is required']"
              />
              <q-input
                v-model="password"
                filled
                :type="isPwd ? 'password' : 'text'"
                class="q-mb-lg"
                bg-color="white"
                :rules="[val => !!val || 'Password is required']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <div v-if="errorMessage" class="q-mb-lg text-negative">
                {{ errorMessage }}
              </div>

              <div class="text-center">
                <q-btn
                  label="LOGIN"
                  type="submit"
                  color="primary"
                  text-color="white"
                  class="btn full-width"
                  :loading="isLoading"
                  :disable="isLoading"
                />
              </div>
            </q-tab-panel>

            <!-- REGISTER TAB -->
            <q-tab-panel name="two" class="q-pa-none">
              <q-input
                outlined
                v-model="name"
                type="text"
                label="İsim"
                class="q-mb-lg"
                bg-color="white"
                :rules="[val => !!val || 'İsim zorunlu']"
              />
              <q-input
                outlined
                v-model="surname"
                type="text"
                label="Soyisim"
                class="q-mb-lg"
                bg-color="white"
                :rules="[val => !!val || 'Soyisim zorunlu']"
              />
              <q-input
                outlined
                v-model="email"
                type="email"
                label="Email"
                class="q-mb-lg"
                bg-color="white"
                :rules="[val => !!val || 'Email zorunlu']"
              />
              <q-input
                v-model="password"
                filled
                :type="isPwd ? 'password' : 'text'"
                class="q-mb-lg"
                bg-color="white"
                label="Şifre"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div v-if="errorMessage" class="q-mb-lg text-negative">
                {{ errorMessage }}
              </div>

              <div class="text-center">
                <q-btn
                  label="Register"
                  type="submit"
                  color="primary"
                  text-color="white"
                  class="btn full-width"
                  :loading="isLoading"
                  :disable="isLoading"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-form>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// ===== EKLENEN SATIRLAR START =====
// api instance'ını doğru şekilde import et
// ===== EKLENEN SATIRLAR END =====
import { api } from 'src/boot/axios'

const router = useRouter()

// Form state
const tab = ref('one')
const name = ref('')
const surname = ref('')
const email = ref('')
const password = ref('')
const isPwd = ref(true)

const isLoading = ref(false)
const errorMessage = ref('')

// ===== EKLENEN SATIRLAR START =====
// Form submit handler
// api instance'ını kullan (baseURL zaten tanımlanmış)
// ===== EKLENEN SATIRLAR END =====
const handleSubmit = async () => {
  errorMessage.value = ''

  // Validasyon
  if (!email.value || !password.value) {
    errorMessage.value = 'Email ve şifre zorunludur'
    return
  }

  isLoading.value = true

  try {
    let response

    if (tab.value === 'one') {
      // ===== EKLENEN SATIRLAR START =====
      // LOGIN - api.post kullan
      // ===== EKLENEN SATIRLAR END =====
      response = await api.post('/users/login', {
        email: email.value,
        password: password.value,
      })
    }
    //  SADECE SUCCESS DURUMUNDA TOKEN KAYDETİN
      if (response?.data?.data?.access_token) {
      const token = response.data.data.access_token
      console.log("🔑 Backend'den gelen token:", token)
        localStorage.setItem('accessToken', token)
        localStorage.setItem('refreshToken', response.data.data.refresh_token || '')
        console.log(" localStorage'e kaydedildi:",
        localStorage.getItem('accessToken'))  //
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        router.push('/dashboard')
      }
    else {
      // ===== EKLENEN SATIRLAR START =====
      // REGISTER - api.post kullan
      // ===== EKLENEN SATIRLAR END =====
      if (!name.value || !surname.value) {
        errorMessage.value = 'İsim ve soyisim zorunludur!!'
        isLoading.value = false
        return
      }

      response = await api.post('/users/register', {
        name: name.value,
        surname: surname.value,
        email: email.value,
        password: password.value,
      })
    }
      // Token kaydet - REGISTER başarılı
      if (response?.data?.data?.access_token) {
        //uyarı mesajı ekle
        errorMessage.value = 'kayıt başarılı giriş yapınız.'
        ////formu temizle
        name.value = ''
        surname.value = ''
        email.value = ''
        password.value = ''
        //login sekmesine geç
        tab.value = 'one'
        //2 saniye sonra logın tabına focus et
        setTimeout(() => {
          errorMessage.value = ''
        }, 2000);

        /*localStorage.setItem('auth_token', response.data.data.access_token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        router.push('/dashboard')*/
      }
    }


   catch (error) {
    // ===== EKLENEN SATIRLAR START =====
    // Error handling
    // ===== EKLENEN SATIRLAR END =====
    console.log(' Error object:', error);
    console.log(' Error response:', error.response?.data);
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else if (error.response?.status === 0) {
      errorMessage.value = 'Backend server bağlanılamıyor (localhost:3002)'
    } else {
      errorMessage.value = 'Bir hata oluştu. Lütfen tekrar deneyin.'
    }
    console.error('Auth error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 32%
  height: 70%

.btn
  border: 1px solid white
</style>
