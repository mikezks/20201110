import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';
import { ABSOLUTE_PATH } from './absolute-path.token';

/**
 * Returns wrong value, if used inside a callback.
 *
 * Use import.meta for modern JavaScript Modules
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta
 *
 */
const absolutePath = (document.currentScript as HTMLScriptElement).src.split('/').slice(0, 3).join('/') + '/';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    { provide: ABSOLUTE_PATH, useValue: absolutePath }
  ],
  bootstrap: []
})
export class AppModule {
  absolutePath: string;

  constructor(private injector: Injector) {
    this.absolutePath = absolutePath;
    console.log(this.absolutePath);
    this.addMicrofrontendExternalCss();
    this.addMicroFrontendStylesJs();
    this.setAbsolutePathAsCssVariable();
  }

  ngDoBootstrap(): void {
    customElements.define(
      'ce-micro-app',
      createCustomElement(
        AppComponent,
        { injector: this.injector }
      )
    );
  }

  addMicrofrontendExternalCss(): void {
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = this.absolutePath + 'assets/styles/styles.css';
    document.head.appendChild(styles);
  }

  addMicroFrontendStylesJs(): void {
    const stylesScript = document.createElement('script');
    stylesScript.src = this.absolutePath + 'styles.js';
    document.body.appendChild(stylesScript);
  }

  setAbsolutePathAsCssVariable(): void {
    const root = document.documentElement;

    root.style.setProperty(
      '--absolute-path',
      this.absolutePath
    );

    setTimeout(() => {
      const imgSampleCompCss = getComputedStyle(root).getPropertyValue('--img-sample-comp-css-var').trim();
      const imgSampleCompCssUrl = [
        'url("',
        this.absolutePath,
        imgSampleCompCss,
        '")'
      ].join('');

      root.style.setProperty(
        '--img-sample-comp-css-var',
        imgSampleCompCssUrl
      );
    }, 0);
  }
}
