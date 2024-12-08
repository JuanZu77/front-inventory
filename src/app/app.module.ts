import { NgModule, APP_INITIALIZER, PLATFORM_ID, Inject } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './modules/shared/material.module';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { KeycloakOnLoad, KeycloakFlow } from 'keycloak-js';
import { isPlatformBrowser } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';

function initializeKeycloak(keycloak: KeycloakService, platformId: Object) {
  return () => {
    
    const isBrowser = isPlatformBrowser(platformId);
    
    if (!isBrowser) {
      return Promise.resolve();
    }

    const initOptions = {
      onLoad: 'login-required' as KeycloakOnLoad,
      flow: 'standard' as KeycloakFlow,
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
    };

    return keycloak.init({
      config: {
        url: 'http://localhost:8082/',
        realm: 'inventory',
        clientId: 'angular-client'
      },
      initOptions: initOptions,
      loadUserProfileAtStartUp: true
    });
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule,
    MaterialModule,
    KeycloakAngularModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideClientHydration(),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, PLATFORM_ID]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
