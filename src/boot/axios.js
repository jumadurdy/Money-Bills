import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3002'
})

// Request interceptor - Token ekleme
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - 401 hatası handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Login sayfasında değilse logout yap
      const isLogoutPage = window.location.pathname.includes('/logout')
      const isLoginPage = window.location.pathname.includes('/login')

      if (!isLoginPage && !isLogoutPage) {
        // Diğer sayfalarda logout yap
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default ({ app }) => {
  app.config.globalProperties.$api = api
}

export { api }
