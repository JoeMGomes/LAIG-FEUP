/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
class TriFan extends CGFobject {
  constructor(scene, id, radius, slices) {
    super(scene);
    this.scene = scene;
    this.id = id;
    this.radius = radius;
    this.slices = slices;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    //Counter-clockwise reference of vertices
    this.indices = [];
    this.texCoords = [];

    //It needs at lest 3 slices
    if (this.slices < 3) this.slices = 3;

    //Colocar TOPOS
    var ang = 0;
    var alphaAng = (2 * Math.PI) / this.slices;

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    for (let j = 0; j < this.slices; j++) {
      var ca = Math.cos(ang);
      var sa = Math.sin(ang);

      this.vertices.push(ca * this.radius, -sa * this.radius, 0);

      this.normals.push(0, 0, 1);
      this.texCoords.push(sa+0.5,ca+0.5);
      ang += alphaAng;
    }

    for(let i = 0 ; i < this.slices ; i ++){
        
        this.indices.push(0, i == this.slices-1 ? 1 : (i+2) % (this.slices + 1) ,(i+1) % (this.slices+1));
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  updateTexCoords(sTex, tTex) {
    this.updateTexCoordsGLBuffers();
  }
}
