import * as pages from 'core/pages';
import States from 'core/States';
import projectList from 'config/project-list';
import { autobind } from 'core-decorators';
import { toggle, active } from 'core/decorators';
import { createDOM } from 'utils/dom';
import { randomFloat } from 'utils/math';
import OrbitControls from 'helpers/3d/OrbitControls/OrbitControls'
import PostProcessing from './PostProcessing';
import Project from './Project';
import DecorPoints from './meshes/DecorPoints';
import template from './webgl.tpl.html';

@active()
@toggle('scrolled', 'scroll', 'unscroll', false)
export default class WebGL {

  // Setup ---------------------------------------------------------------------

  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._clock = new THREE.Clock();
    this._mouse = new THREE.Vector2();
    this._raycaster = new THREE.Raycaster();

    this._scrollWheelTimeout = null;
    this._cameraInterval = null;

    this._delta = 0;
    this._deltaTarget = 0;
    this._translation = 0;

    this._setupWebGL(window.innerWidth, window.innerHeight);

    this._setupProject();
    this._setupDecorPoints();
    this._setupPostProcessing();

    this._addEvents();
  }

  _setupWebGL(width, height) {
    this._scene = new THREE.Scene();

    this._camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 10000 );
    this._camera.position.z = 1000;

    // this._controls = new OrbitControls(this._camera);

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize( width, height );
    this._renderer.setClearColor( 0x000000 );

    this._el.appendChild(this._renderer.domElement);
  }

  _setupProject() {
    this._project = new Project({
      raycaster: this._raycaster,
    });
    this._scene.add(this._project.getPoints());
    this._scene.add(this._project.getDescription());
  }

  _setupDecorPoints() {
    this._decorPoints = new DecorPoints();
    this._scene.add(this._decorPoints);
  }

  _setupPostProcessing() {
    this._postProcessing = new PostProcessing({
      scene: this._scene,
      renderer: this._renderer,
      camera: this._camera,
    });
  }

  _addEvents() {
    this._el.addEventListener('click', this._onClick);
    Signals.onResize.add(this._onResize);
    // Signals.onScroll.add(this._onScroll);
    Signals.onScrollWheel.add(this._onScrollWheel);
  }

  // State ---------------------------------------------------------------------

  activate() {}
  deactivate() {}

  scroll() {
    this._project.deselect();
    this._decorPoints.setDirection(this._deltaTarget);
    this._postProcessing.animate(this._deltaTarget);

    this._shakeCamera();
  }

  _shakeCamera() {

    let intervals = 0;

    clearInterval(this._cameraInterval);
    this._cameraInterval = setInterval( () => {

      if (intervals === 10) {
        clearInterval(this._cameraInterval);
        this._camera.position.x = 0;
        this._camera.position.y = 0;
        return false;
      }

      this._camera.position.x = randomFloat(-10, 10);
      this._camera.position.y = randomFloat(-10, 10);

      intervals++;

      return true;
    }, 50);
  }

  unscroll() {
    this._deltaTarget = 0;
    this._delta = 0;
    const remains = this._translation % 10000;
    if (Math.abs(remains) <= 5000) {
      TweenLite.to(
        this,
        1,
        {
          _translation: this._translation - remains,
        },
      );
    } else {
      TweenLite.to(
        this,
        1,
        {
          _translation: this._translation - ( 10000 - Math.abs(remains) ),
        },
      );
    }

    this._project.select();
  }

  updateState(page) {
    this._project.updateState(page);
  }

  // Events --------------------------------------------------------------------

  mousemove(event) {
    this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this._mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
  }

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    this._camera.aspect = vw / vh;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize( vw, vh );
  }

  @autobind
  _onScroll(event) {
    console.log(1);
  }

  @autobind
  _onScrollWheel(event) {
    if (this.active()) {
      TweenLite.killTweensOf(this, { _translation: true });
      this._deltaTarget = event.deltaY;
      this.scroll();

      clearTimeout(this._scrollWheelTimeout);
      this._scrollWheelTimeout = setTimeout(() => {
        this.unscroll();
      }, 50);
    }
  }

  @autobind
  _onClick() {
    if (this._project.focused()) {
      const id = projectList.projects[Math.floor(States.global.progress)].id;
      States.router.navigateTo(pages.PROJECT, { id });
    }
  }

  // Update --------------------------------------------------------------------

  update() {

    const time = this._clock.getElapsedTime();
    const delta = this._clock.getDelta();

    this._updateCamera();
    this._updatePoints(time);
    this._updateDecorPoints(time);

    // this._renderer.render(this._scene, this._camera);
    this._postProcessing.update(delta);
  }

  _updateCamera() {
    this._camera.rotation.x += ( this._mouse.y * 0.1 - this._camera.rotation.x ) * 0.1;
    this._camera.rotation.y += ( this._mouse.x * -0.1 - this._camera.rotation.y ) * 0.1;

    this._raycaster.setFromCamera( this._mouse, this._camera );
    const intersects = this._raycaster.intersectObjects( this._scene.children, true );

    for (let i = 0; i < intersects.length; i++) {
      this._project.focus();
      document.body.style.cursor = 'pointer';
      return;
    }

    document.body.style.cursor = 'inherit';
    this._project.blur();
  }

  _updatePoints(time) {
    this._delta += ( this._deltaTarget - this._delta ) * 0.1;
    this._translation += this._delta;
    this._project.update(time, this._delta, this._translation);
  }

  _updateDecorPoints(time) {
    this._decorPoints.update(time, this._delta);
  }

}
