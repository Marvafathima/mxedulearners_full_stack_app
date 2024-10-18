// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from "path"
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     proxy: {
//       '/media': 'http://localhost:8000'
//     }
//   }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',  // Allow connections from all hosts
    port: 5173,       // Specify the port
    proxy: {
      '/media': 'http://backend:8000'  // Updated to use the service name 'backend'
    }
  }
})