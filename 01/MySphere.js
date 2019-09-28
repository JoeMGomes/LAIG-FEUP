/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySphere extends CGFobject {
    constructor(scene, id, radius, slices, stacks) {
        super(scene);
        this.scene = scene;
        this.id = id;
        this.radius = radius;
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
        if (this.stacks < 3) this.stacks = 3;

        //Vertices & Normals & Textcoords
        var vert_ang = 0;
        var hor_ang = 0;
        var aphaAng = 2 * Math.PI / this.slices;

        for (var i = 0; i <= this.stacks; i++) {
            for (var j = 0; j <= this.slices; j++) {
                this.vertices.push(this.radius * Math.sin(vert_ang) * Math.sin(hor_ang), this.radius * Math.sin(vert_ang) * Math.cos(hor_ang), this.radius * Math.cos(vert_ang));
                this.normals.push(this.radius * Math.sin(vert_ang) * Math.sin(hor_ang), this.radius * Math.sin(vert_ang) * Math.cos(hor_ang), this.radius * Math.cos(vert_ang));
                hor_ang += aphaAng;
            }
            hor_ang = 0;
            vert_ang += Math.PI / this.stacks;
        }

        for (var i = 0; i < this.stacks; i++) {
            for (var j = 0; j < this.slices; j++) {
                this.indices.push(j + (i + 1) * (this.slices + 1) + 1, j + (i + 1) * (this.slices + 1), j + i * (this.slices + 1));
                this.indices.push(j + i * (this.slices + 1), j + i * (this.slices + 1) + 1, j + (i + 1) * (this.slices + 1) + 1);
            }
        }

        //TODO: Texture Coord
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
