/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCylinder extends CGFobject {
  constructor(scene, id, base, top, height, slices, stacks) {
    super(scene);
    this.scene = scene;
    this.id = id;
    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;
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

    //Vertices & Normals & Textcoords

    var ang = 0;
    var alphaAng = (2 * Math.PI) / this.slices;
    var stackY = 0;
    var stackX = 0;
    var stackIncX = Math.abs(this.top - this.base) / this.stacks;
    var stackIncY = this.height / this.stacks;

    for (var i = 0; i < this.stacks; i++) {
      for (var j = 0; j < this.slices; j++) {
        var sa = Math.sin(ang);
        var saa = Math.sin(ang + alphaAng);
        var ca = Math.cos(ang);
        var caa = Math.cos(ang + alphaAng);

        var normal = [saa - sa, ca * saa - sa * caa, caa - ca];

        /*// normalization
			var nsize = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
			normal[0] /= nsize;
			normal[1] /= nsize;
			normal[2] /= nsize;*/

        //Vertices
        this.vertices.push(
          ca * (this.base + stackX),
          stackY,
          -sa * (this.base + stackX)
        );

        stackX += stackIncX;
        stackIncY += stackIncY;
        ang += alphaAng;
      }
    }

    for (var i = 0; i < this.stacks; i++) {
      for (var j = 0; j < this.slices; j++) {
        if (i == 0) {
          this.indices.push(j, j + 1, this.slices + j);
          this.indices.push(j + 1, this.slices + j + 1, this.slices + j);
        } else {
          this.indices.push(i * j, i * j + 1, (i + 1) * j);
          this.indices.push(i*j + 1, (i + 1) * j +1, (i + 1) * j);
        }
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

    console.log(this.indices);
  }
}
