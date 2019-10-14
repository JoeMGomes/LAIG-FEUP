/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTorus extends CGFobject {
  constructor(scene, id, inner, outer, slices, loops) {
    super(scene);
    this.scene = scene;
    this.id = id;
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    //Counter-clockwise reference of vertices
    this.indices = [];
    this.texCoords = [];

    //Vertices & Normals & Textcoords
    var outerAng = 0;
    var outerInc = (2 * Math.PI) / this.loops;
    var innerAng = 0;
    var alphaAng = (2 * Math.PI) / this.slices;

    for (var i = 0; i < this.loops + 1; i++) {
      for (var j = 0; j < this.slices; j++) {
        var sa = Math.sin(innerAng)* this.inner;
        var ca = Math.cos(innerAng)* this.inner;

        var normal = [ca*Math.cos(outerAng),  Math.sin(outerAng)*ca, -sa];

        // normalization
        var nsize = Math.sqrt(
          normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]
        );
        normal[0] /= nsize;
        normal[1] /= nsize;
        normal[2] /= nsize;

        // push normal once for each vertex
        this.normals.push(...normal);

        // this.vertices.push(ca + this.outer,0,-sa);
        //Vertices
        this.vertices.push(
          (ca + this.outer) * Math.cos(outerAng),
         Math.sin(outerAng)*(ca + this.outer),
          -sa 
        );

        innerAng += alphaAng;
      }
      outerAng += outerInc
    }

    for (var i = 0; i < this.loops; i++) {
      for (var j = 0; j < this.slices; j++) {
        if (i == 0) {
          this.indices.push(j, (j + 1) % this.slices,  this.slices + j);
          this.indices.push(
            (j + 1) % this.slices,
            this.slices + ((j + 1) % this.slices),
            this.slices + j
          );
        } else {
          this.indices.push(
            j + this.slices * i,
            ((j + 1) % this.slices) + this.slices * i,
            this.slices + j + this.slices * i
          );
          this.indices.push(
            ((j + 1) % this.slices) + this.slices * i,
            this.slices + ((j + 1) % this.slices) + this.slices * i,
            this.slices + j + this.slices * i
          );
        }
      }
    }


    //TODO: Texture Coord
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
