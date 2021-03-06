import './yo-paper-cropper-styles.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {PolymerElement} from '@polymer/polymer/polymer-element.js';

import "./yo-paper-cropper-styles"
/**
 * `yo-paper-cropper`
 * An element to wrap Cropper.js
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class YoPaperCropper extends PolymerElement {
  static get template() {
    return html`
        <style include="yo-paper-cropper-styles"></style>
        <style>
            :host {
                display: block;
            }

            #wrapper {
                margin: auto;
                display: block;
                position: relative;
                height: var(--yo-paper-cropper-height, 300px);
                width: auto;
            }

            .image {
                display: block;
                max-width: 100%;
                max-height: 100%;
                height: 100%;
                width: auto;
            }
        </style>
        <div id="wrapper">
            <img id="image" class="image" src="[[src]]" on-load="_imageLoaded">
        </div>
`;
  }

  static get is() { return 'yo-paper-cropper'; }
  static get properties() {
      return {
          src: {
              type: String,
              reflectToAttribute: true
          },
          options: {
              type: Object,
              value: {},
              observer: '_optionsChanged'
          }
      };
  }

  _optionsChanged() {
      if (this._cropper) {
          this._renderCrop();
      }
  }

  _imageLoaded() {
      const cancelled = !this.dispatchEvent(new CustomEvent('image-loaded', { cancelable: true }));
      if (!cancelled) this._renderCrop();
  }

  constructor() {
    super();
    console.log("construct yo-cropped");
  }

  _renderCrop() {
      if (!window.Cropper)
          return console.error('Cropper has not been initialized');

      if (this._cropper) {
          this.$.wrapper.removeAttribute('style');
          this._cropper.destroy();
      }

      this.$.wrapper.setAttribute('style', 'max-width: ' + this.$.image.offsetWidth + 'px');

      const _ready = this.options.ready;
      this.options.ready = (e) => {
          if (_ready) _ready(e);
          this.dispatchEvent(new CustomEvent('cropper-ready'));
      }

      this._cropper = new window.Cropper(this.$.image, this.options);
  }
}

window.customElements.define(YoPaperCropper.is, YoPaperCropper);
