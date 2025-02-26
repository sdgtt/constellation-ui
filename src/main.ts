import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  // if (window.location.protocol === 'http:') {
  //   window.location.href = window.location.href.replace('http:', 'https:');
  // }
  
