import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import 'dotenv/config';
import fs from 'fs';

const commitHash = fs.readFileSync('REVISION', 'utf-8').trim();

export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __CTS_KEY__: JSON.stringify(process.env.CTS_KEY),
    __CTSCAM_API_URL__: JSON.stringify(process.env.CTSCAM_API_URL),
  },
  plugins: [react()],
});
