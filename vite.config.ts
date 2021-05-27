// @ts-nocheck

import fs from 'fs';

import { defineConfig, loadEnv } from 'vite';
import dotenv from 'dotenv';
import reactRefresh from '@vitejs/plugin-react-refresh';


// 怪解法...
dotenv.config();

const { NODE_KEY_PATH, NODE_CERT_PATH } = { ...loadEnv('', process.cwd(), 'NODE_') };

console.log(NODE_KEY_PATH);
console.log(NODE_CERT_PATH);

const options = {
  key: fs.readFileSync(NODE_KEY_PATH),
  cert: fs.readFileSync(NODE_CERT_PATH)
};


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    open: true,
    port: 7777,
    https: options
  }
})
