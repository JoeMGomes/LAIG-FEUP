/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
class TriFan extends CGFobject {
    constructor(scene, id, radius, slices) {
    super(scene);
    this.slices = slices;
    this.radius = radius;
    this.id = id;
    this.scene = scene;
    this.initBuffers();
  }
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var ang = 0;
    var alphaAng = 2*Math.PI/this.slices;

    for(var i = 0; i < this.slices; i++){

      this.vertices.push(Math.cos(ang) *this.radius, -Math.sin(ang)*this.radius,0);
      this.indices.push(i, this.slices, (i+1) % this.slices);
      this.normals.push(0, 1, 0);
      ang+=alphaAng;

      this.texCoords.push(ang/(Math.PI*2), 1);  
    }

    this.vertices.push(0,0,0);
    this.normals.push(0,1,0);
    this.texCoords.push(.5, 0);


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  updateTexCoords(sTex, tTex) {

  }
}
