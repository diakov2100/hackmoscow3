import States from 'core/States';
import raf from 'raf';
import { createDOM } from 'utils/dom';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import LoaderCanvas from './LoaderCanvas';
import template from './loader.tpl.html';
import './loader.scss';


@visible()
export default class LoaderView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      canvasContainer: this.el.querySelector('.js-loader__canvasContainer'),
      counter: this.el.querySelector('.js-loader__counter'),
    };

    this._loaderCanvas = new LoaderCanvas({
      parent: this._ui.canvasContainer,
    });

    this._callsColorsStocked = 0;
    this._previousDate = null;

    this._values = [];

    this._assetsLoaded = false;
    this._activateCheck = false;

    this.setupEvents();

    this.show();

    this._update();
  }

  setupEvents() {
    Signals.onAssetLoaded.add(this.onAssetLoaded);
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
    Signals.onColorStocked.add(this._onColorStocked);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';
  }

  hide({ delay = 0 } = {}) {

    TweenLite.to(
      this.el,
      2,
      {
        delay,
        opacity: 0,
        onComplete: () => { this.el.style.display = 'none'; },
      },
    );
  }

  // Events --------------------------------------------------------------------
  @autobind
  _onColorStocked() {
    if (this._assetsLoaded && this._callsColorsStocked === 1) {
      TweenLite.delayedCall(0.8, this._checkFPS );
    }

    this._callsColorsStocked++;
  }

  @autobind
  onAssetLoaded(percent) {
    const value = `${Math.floor( Math.min( 85, percent ) )}%`;

    this._ui.counter.innerHTML = value;

    this._loaderCanvas.updateValue(percent / 100);
  }
  @autobind
  onAssetsLoaded(percent) {

    const value = `${Math.floor( Math.min( 85, percent ) )}%`;

    this._ui.counter.innerHTML = value;

    this._assetsLoaded = true;
  }

  // Update -----------

  @autobind
  _update() {
    this._raf = raf(this._update);

    this._loaderCanvas.update();

    if (this._activateCheck) {
      const date = Date.now();

      if (!this._previousDate) {
        this._previousDate = date;
        return;
      }

      this._values.push(date - this._previousDate);

      if (this._values.length >= 150) {
        this._stopCheckFPS();

        return;
      }

      this._previousDate = date;
    }
  }

  @autobind
  _checkFPS() {
    this._activateCheck = true;
  }

  _stopCheckFPS() {

    let sum = 0;
    for (let i = 0; i < this._values.length; i++) {
      sum += this._values[i];
    }

    const average = sum / this._values.length;

    if (average > 22.22222222) {
      Signals.onSetLowMode.dispatch();
    }

    console.log('hide loader');
    // this.hide();

    raf.cancel(this._raf);
  }

}
