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
  
  addGroups(lights, views) {
    this.groupLight = this.gui.addFolder("Lights");
    this.groupLight.open();

    for (var key in lights) {
      if (lights.hasOwnProperty(key)) {
        this.scene.lightValues[key] = lights[key][0];
        this.groupLight.add(this.scene.lightValues, key);
      }
    }

    this.groupCam = this.gui.addFolder("Views");
    this.groupCam.open();
    const cameraIdArray = Object.keys(views);
    this.currentCameraId = this.scene.graph.default;

    this.groupCam.add(this, 'currentCameraId', cameraIdArray).name('Camera').onChange(val => this.scene.selectView(val));

  }

  updateLights(lights){
    for(var i = this.groupLight.__controllers.length - 1; i >= 0;i--){
        this.groupLight.__controllers[i].remove();
    }

    for (var key in lights) {
      if (lights.hasOwnProperty(key)) {
        this.scene.lightValues[key] = lights[key][0];
        this.groupLight.add(this.scene.lightValues, key);
      }
    }
  }

  updateViews(views){
    for(var i = this.groupCam.__controllers.length - 1; i >= 0;i--){
        this.groupCam.__controllers[i].remove();
    }

    const cameraIdArray = Object.keys(views);
    this.currentCameraId = this.scene.graph.default;

    this.groupCam.add(this, 'currentCameraId', cameraIdArray).name('Camera').onChange(val => this.scene.selectView(val));
  }



  addThemeGroup(){
    let themes = ['classicRoom.xml','beachMode.xml'];

    var themeGroup = this.gui.addFolder("Themes");
    themeGroup.open();
    themeGroup.add(this.scene,'currentScene',themes).name("Current Theme").onChange(val => this.scene.changeScene(val));
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
