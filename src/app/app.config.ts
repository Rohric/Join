import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

/**
 * Angular Application Configuration
 *
 * Central configuration for the entire Angular application. Initializes Firebase backend,
 * configures routing, and sets up change detection strategy. This config is passed to the
 * bootstrapApplication() function during application startup.
 *
 * Configuration Includes:
 * - Firebase initialization with project credentials
 * - Authentication (Auth) provider
 * - Firestore database provider
 * - Application routing with lazy-loaded routes
 * - Global error listening for unhandled errors
 * - Zoneless change detection for optimal performance
 *
 * Firebase Project: join-593b3
 *
 * @constant
 * @type {ApplicationConfig}
 *
 * @example
 * // Used in main.ts
 * bootstrapApplication(App, appConfig)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'join-593b3',
        appId: '1:390589623561:web:4df3c1d39b3387740e77d8',
        storageBucket: 'join-593b3.firebasestorage.app',
        apiKey: 'AIzaSyCdR4LqlOvdOP5vWlXxD-1IEMOihWovqfo',
        authDomain: 'join-593b3.firebaseapp.com',
        messagingSenderId: '390589623561',
      }),
    ),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};
