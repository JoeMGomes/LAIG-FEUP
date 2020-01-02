/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
  constructor(scene, id, RTTexture) {
    super(scene);
    this.id = id;
    this.shader =  new CGFshader(scene.gl, "shaders/security.vert", "shaders/security.frag")
    this.rect = new MyRectangle(scene,id,0,1,0,1);
    this.RTTexture = RTTexture;
  }
  display() {

    this.scene.setActiveShader(this.shader)
    this.RTTexture.bind(0);
    this.rect.display();
  }
  updateTexCoords() {}
}
