import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideCloudinaryLoader } from '@angular/common';
import { blockRequestInterceptor } from './core/interceptors/block-requests.interceptor';
import { ngrokInterceptor } from './core/interceptors/ngrok.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
    }),
    provideRouter(routes, withRouterConfig({
      urlUpdateStrategy: 'eager'
    }), withInMemoryScrolling({
      scrollPositionRestoration: 'top'
    })),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, blockRequestInterceptor, ngrokInterceptor]),
    ),
    provideCloudinaryLoader(`https://res.cloudinary.com/di2rpmtzc/`),
  ]
};
