import States from 'core/States';
import projectList from 'config/project-list';
import { createDOM } from 'utils/dom';
import { map, randomFloat } from 'utils/math';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './project_view.tpl.html';
import './project_view.scss';


@visible()
export default class DesktopProjectView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      mediaContainer: this._el.querySelector('.js-project__medias'),
      title: this._el.querySelector('.js-project__viewTitle'),
      description: this._el.querySelector('.js-project__viewDescription'),
      date: this._el.querySelector('.js-project__date'),
      link: this._el.querySelector('.js-project__link'),
      medias: [],
    };

    this._rotations = [];

    this._deltaY = 0;
    this._deltaTargetY = 0;

    this._needsUpdate = false;

    this._setupEvents();
  }

  _setupEvents() {
    Signals.onResize.add(this._onResize);
    Signals.onScrollWheel.add(this._onScrollWheel);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this._el.style.display = 'block';

    this._deltaY = 0;
    this._deltaTargetY = 0;
  }

  hide({ delay = 0 } = {}) {
    this._el.style.display = 'none';

    while (this._ui.mediaContainer.firstChild) {
      this._ui.mediaContainer.removeChild(this._ui.mediaContainer.firstChild);
    }

    this._deltaY = 0;
    this._deltaTargetY = 0;
  }

  updateProject() {
    const project = projectList.getProject(States.router.getLastRouteResolved().params.id);

    this._ui.title.innerHTML = project.title;
    this._ui.description.innerHTML = project.description;
    this._ui.date.innerHTML = project.date;
    this._ui.link.innerHTML = `<a href="${project.url}">${project.link}</a>`;

    while (this._ui.mediaContainer.firstChild) {
      this._ui.mediaContainer.removeChild(this._ui.mediaContainer.firstChild);
    }

    this._rotations = [];

    for (let i = 0; i < project.medias.length; i++) {
      const media = project.medias[i];

      if (media.type === 'image') {
        const img = new Image();
        img.classList.add('js-project__viewImg');
        img.classList.add('js-project__viewMedia');
        img.classList.add('project__viewImg');
        img.src = media.url;

        this._ui.mediaContainer.appendChild(img);
      } else {
        const video = document.createElement('video');
        video.loop = true;
        video.classList.add('js-project__viewVideo');
        video.classList.add('js-project__viewMedia');
        video.classList.add('project__viewVideo');
        video.src = media.url;

        this._ui.mediaContainer.appendChild(video);
      }

      this._rotations.push({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });
    }

    this._ui.medias = this._ui.mediaContainer.querySelectorAll('.js-project__viewMedia');
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    this._vh = vh;
  }

  @autobind
  _onScrollWheel(event) {
    const mediaContainerRect = this._ui.mediaContainer.getBoundingClientRect();
    const height = mediaContainerRect.height;
    this._deltaTargetY -= event.deltaY * 0.5;
    this._deltaTargetY = Math.max( -height, Math.min( 0, this._deltaTargetY ) );

    this._needsUpdate = true;
  }

  // Update --------------------------------------------------------------------
  update() {

    if (this._needsUpdate) {
      this._updateMediaContainer();
      this._updateMedias();
    }
  }

  _updateMediaContainer() {
    this._deltaY += (this._deltaTargetY - this._deltaY) * 0.2;
    if (Math.abs(this._deltaTargetY - this._deltaY) < 0.1) {
      this._deltaY = this._deltaTargetY;
      this._needsUpdate = false;
    }

    this._ui.mediaContainer.style.transform = `translate3d(0,${this._deltaY}px,0)`;
  }

  _updateMedias() {
    for (let i = 0; i < this._ui.medias.length; i++) {
      this._ui.medias[i].style.transform = 'perspective(500px) translate3d(0, 0, 0)';
      const mediaRect = this._ui.medias[i].getBoundingClientRect();
      const minValue = -400;
      const maxValue = 0;
      const opacity = i === this._ui.medias.length - 1 ? 1 : Math.abs( map( Math.max( minValue, Math.min( maxValue, mediaRect.top ) ), minValue, maxValue, 0, 1) );
      const translate = i === this._ui.medias.length - 1 ? 0 : Math.abs( opacity - 1 ) * -300;
      const rotation = i === this._ui.medias.length - 1 ? 0 : Math.abs( opacity - 1 ) * 60;

      if (this._ui.medias[i].paused !== undefined && mediaRect.top > -mediaRect.height && mediaRect.top <= this._vh) {
        this._ui.medias[i].play();
      } else if (this._ui.medias[i].paused !== undefined) {
        this._ui.medias[i].pause();
      }

      this._ui.medias[i].style.opacity = opacity;
      this._ui.medias[i].style.transform = `perspective(500px) translate3d(0, 0, ${translate}px) rotate3d(${this._rotations[i].x}, ${this._rotations[i].y}, 0, ${rotation}deg)`;
    }
  }

}
