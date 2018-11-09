import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { hmrBootstrap } from './hmr';
import { environment } from '../environments/environment';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.hmr && module['hot']) {
  hmrBootstrap(module, bootstrap);
} else {
  bootstrap().catch(err => console.log(err));
}
