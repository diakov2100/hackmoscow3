
import States from 'core/States';
import * as pages from 'core/pages';
import { createDOM } from 'utils/dom';
import { visible } from 'core/decorators';

import template from './buttons.tpl.html';
import './buttons.scss';
import { autobind } from 'core-decorators';


@visible()
export default class DesktopButtonsView {
  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );


    this._ui = {
      works: this._el.querySelector('.register'),
      experiments: this._el.querySelector('.moreInfo'),
    };

    this._addEvents();
  }

   _addEvents() {
    this._ui.works.addEventListener('click', this._onRegisterClick);
    this._ui.experiments.addEventListener('click', this._onMoreInfoClick);
  }

  // State ---------------------------------------------------------------------

  show() {
    this._el.style.display = 'block';
  }

  hide() {
    this._el.style.display = 'none';
  }


  // Events ------------------------------------

  //@autobind
  _onRegisterClick() {
    States.router.navigateTo(pages.ABOUT);
  }

  //@autobind
  _onMoreInfoClick() {
    States.router.navigateTo(pages.INFO);
  }

}