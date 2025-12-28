import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. 일반 API 요청 (예: axios.get('/api/users') -> localhost:3000/api/users)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // 2. OAuth 로그인 요청 (예: window.location.href='/oauth2/...' -> localhost:3000/oauth2/...)
      '/oauth2': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
