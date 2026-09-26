import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./deployment-tests',timeout:45000,use:{baseURL:'https://owfarisz.github.io/servenow-recovery-console/',channel:'chrome',headless:true},reporter:'list'});
