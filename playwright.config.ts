import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./e2e',timeout:45000,use:{baseURL:'http://localhost:5173',channel:'chrome',headless:true},reporter:'list'});
