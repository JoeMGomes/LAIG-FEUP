/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
  constructor(scene, id, RTTexture) {
    super(scene);
    this.id = id;
    this.rect = new MyRectangle(scene,id,0,3,0,3);
    this.RTTexture = RTTexture;
  }
  display() {

    this.RTTexture.bind(0);

    this.rect.display();
  }
  updateTexCoords() {}
}
