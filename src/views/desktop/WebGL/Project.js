import * as pages from 'core/pages';
import { visible, focused } from 'core/decorators';
import Points from './meshes/Points';

@visible()
@focused()
export default class Project {
  constructor(options) {

    this._raycaster = options.raycaster;

    this._page = null;
    var t = Date.now() 
    console.log(11, Date.now() - t)
    this._setupPoints();
    console.log(11, Date.now() - t)

  }

  _setupPoints() {
    this._points = new Points({
      type: 'project',
    });
  }



  // Getters / Setters --------------------

  getPoints() {
    return this._points;
  }



  // State --------------------

  show({ delay = 0 } = {}) {
    this._points.show({ delay });
  }

  hide() {

    this._points.hide();
  }

  focus() {

  }

  blur() {

  }

  deselect() {
    this._points.deselect();

  }

  select() {
    this._points.select();
  }

  showDescription() {

  }

  updateDescription(project) {

  }

  updateState(page) {
    switch (page) {
      case pages.HOME:
        const delay = this._page ? 0 : 2.5;
        this.show({ delay });
        break;
      case pages.ABOUT:
        this.hide();
        break;
      case pages.INFO:
        this.hide();
        break;
      default:
    }

    this._page = page;
  }

  // Events --------------------

  mousedown() {
    this._points.mousedown();
  }

  mouseup() {
    this._points.mouseup();
  }

  mousemove(mouse) {
    this._points.mousemove(mouse);
  }

  resize(camera) {
    this._points.resize(camera);
  }

  // Update --------------------

  update(time, delta, translation, camera) {

    this._points.update(time, delta, translation);
  }
}
