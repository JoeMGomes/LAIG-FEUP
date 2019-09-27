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
    var stackIncX = (this.top - this.base) / (this.stacks + 1);
    var stackIncY = this.height / this.stacks;

    for (var i = 0; i < this.stacks + 1; i++) {
      for (var j = 0; j < this.slices; j++) {
        var sa = Math.sin(ang);
        var saa = Math.sin(ang + alphaAng);
        var ca = Math.cos(ang);
        var caa = Math.cos(ang + alphaAng);

        var normal = [ca, -sa, -Math.tan((this.top-this.base) / this.height)];

        // normalization
        var nsize = Math.sqrt(
          normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]
        );
        normal[0] /= nsize;
        normal[1] /= nsize;
        normal[2] /= nsize;

        // push normal once for each vertex
        this.normals.push(...normal);

        //Vertices
        this.vertices.push(
          ca * (this.base + stackX),
          -sa * (this.base + stackX),
          stackY
        );

        ang += alphaAng;
      }
      stackX += stackIncX;
      stackY += stackIncY;
    }

    for (var i = 0; i < this.stacks; i++) {
      for (var j = 0; j < this.slices; j++) {
        if (i == 0) {
          this.indices.push(j,  this.slices + j,(j + 1) % this.slices);
          this.indices.push(
            (j + 1) % this.slices,
            this.slices + j,
            this.slices + ((j + 1) % this.slices)
          );
        } else {
          this.indices.push(
            j + this.slices * i,
            this.slices + j + this.slices * i,
            ((j + 1) % this.slices) + this.slices * i
          );
          this.indices.push(
            ((j + 1) % this.slices) + this.slices * i,
            this.slices + j + this.slices * i,
            this.slices + ((j + 1) % this.slices) + this.slices * i
          );
        }
      }
    }


    //TODO: Texture Coord
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
