import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { sampleTagBase64DataUrl } from '../assets/images/sample-tag-base64.data-url';
import { ABSOLUTE_PATH } from './absolute-path.token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'micro-app';
  sampleTagBase64DataUrl = sampleTagBase64DataUrl;

  constructor(
    @Inject(ABSOLUTE_PATH) public absolutePath: string
  ) {}
}
