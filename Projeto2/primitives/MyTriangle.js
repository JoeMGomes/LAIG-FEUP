/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
    constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        super(scene);

        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [
            this.x1, this.y1, this.z1, //0
            this.x2, this.y2, this.z2, //1
            this.x3, this.y3, this.z3, //2
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
        ];
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }



    updateTexCoords(sTex, tTex) {
        this.texCoords = [];

        var a = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.y1, 2));
        var b = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2) + Math.pow(this.z3 - this.y2, 2));
        var c = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.y3, 2));


        cosAng = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * c * a);
        sinang = Math.sqrt(1 - Math.pow(cosAng, 2));

        this.texCoords.push(0, 0);
        this.texCoords.push(a / sTex, 0);
        this.texCoords.push((c * cosAng) / sTex, (c * sinang) / tTex);


        this.updateTexCoordsGLBuffers();
    }
}