/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
  /**
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Initializes the interface.
   * @param {CGFapplication} application
   */
  init(application) {
    super.init(application);
    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    // add a group of controls (and open/expand by defult)

    this.initKeys();

    return true;
  }

  addGroups(lights, views, securityCams) {
    var groupLight = this.gui.addFolder("Lights");
    groupLight.open();

    for (var key in lights) {
      if (lights.hasOwnProperty(key)) {
        this.scene.lightValues[key] = lights[key][0];
        groupLight.add(this.scene.lightValues, key);
      }
    }

    var groupCam = this.gui.addFolder("Views");
    groupCam.open();
    const cameraIdArray = Object.keys(views);
    const secCamIdArray = Object.keys(securityCams)
    this.currentCameraId = this.scene.graph.default;

    groupCam.add(this, 'currentCameraId', cameraIdArray).name('Camera').onChange(val => this.scene.selectView(val));
    groupCam.add(this, 'currentCameraId', secCamIdArray).name('Security').onChange(val => this.scene.selectSecView(val));

  }

  /**
   * initKeys
   */
  initKeys() {
    this.scene.gui = this;
    this.processKeyboard = function() {};
    this.activeKeys = {};
  }

  processKeyDown(event) {
    this.activeKeys[event.code] = true;
  }

  processKeyUp(event) {
    this.activeKeys[event.code] = false;
    if (event.code == "KeyM") {
      this.scene.updateMaterial();
    }
  }

  isKeyPressed(keyCode) {
    return this.activeKeys[keyCode] || false;
  }
}
