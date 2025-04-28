import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideNgxMask } from 'ngx-mask';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideCloudinaryLoader } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
    }),
    provideNgxMask(),
    provideRouter(routes, withRouterConfig({
      urlUpdateStrategy: 'eager'
    }), withInMemoryScrolling({
      scrollPositionRestoration: 'top'
    })),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideCloudinaryLoader("https://res.cloudinary.com/di2rpmtzc/"),
  ]
};
