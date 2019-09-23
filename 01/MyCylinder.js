/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyBranch extends CGFobject {
	constructor(scene) {
		super(scene);
		this.slices = 3;
		this.initBuffers();
		this.scene = scene;
	}

	initBuffers() {
		this.vertices = [];
		this.normals = [];
		//Counter-clockwise reference of vertices
		this.indices = [];
		this.texCoords = [];
		
		//It needs at lest 3 slices
		if(this.slices < 3)
			this.slices = 3;

		//Vertices & Normals & Textcoords
		var ang = 2*Math.PI/this.slices;
		for(var i = 0; i < this.slices; i++) {
			//Vertices
			this.vertices.push(Math.cos(ang*i),0,Math.sin(ang*i));
			this.vertices.push(Math.cos(ang*i),1,Math.sin(ang*i));
			//Normals
			this.normals.push(Math.cos(ang*i),0,Math.sin(ang*i));
			this.normals.push(Math.cos(ang*i),0,Math.sin(ang*i));
			//TextCoords
			this.texCoords.push(i/(this.slices-1),1);
			this.texCoords.push(i/(this.slices-1),0);
		}

		//Indice
		for(var i = 0; i < (this.slices*2); i++) {
			this.indices.push( (i % (this.slices*2)) , (i+1 % (this.slices*2)) , (i+2 % (this.slices*2)) );
			this.indices.push( (i+2 % (this.slices*2)) , (i+1 % (this.slices*2)) , (i % (this.slices*2)) );
		}

		//More Vertices & Normals
		for(var i = 0; i < this.slices; i++) {
			//Vertices
			this.vertices.push(Math.cos(ang*i),0,Math.sin(ang*i));
			this.vertices.push(Math.cos(ang*i),1,Math.sin(ang*i));
			//Normals
			this.normals.push(Math.cos(ang*i),0,Math.sin(ang*i));
			this.normals.push(Math.cos(ang*i),0,Math.sin(ang*i));
			//TextCoords
			this.texCoords.push(i/(this.slices-1),1);
			this.texCoords.push(i/(this.slices-1),0);
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();

		//materials
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(133/255, 64/255, 0, 1.0);
        this.material.setDiffuse(133/255, 64/255, 0, 1.0);
        this.material.setSpecular(133/255, 64/255, 0, 0.2);
        this.material.setShininess(10.0);
	}

	Display () {
		this.material.apply();
		this.scene.pushMatrix();
        this.scene.scale(0.5, 1, 0.5);
        this.display();
        this.scene.popMatrix();
	}
}
