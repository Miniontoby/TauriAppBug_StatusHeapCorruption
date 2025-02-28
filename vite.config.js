import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { internalIpV4Sync } from 'internal-ip';  // Use v7 instead of v8!!!

// @ts-expect-error process is a nodejs global
let host = process.env.TAURI_DEV_HOST ?? !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);
let ip = internalIpV4Sync();
if (host !== false && host !== true) ip = host;
else if (ip?.endsWith('.0')) console.error('[vite.config.js] It looks like you didn\'t install internal-ip v7! Please fix!');

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [sveltekit()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    host: host ? '0.0.0.0' : false,
    port: 1420,
    strictPort: true,
    hmr: host
      ? {
          protocol: 'ws',
          host: ip,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**', '**/.svelte-kit/**', '**/build/**'],
    },
  },
}));