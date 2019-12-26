/**
 * Plane
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Patch extends CGFobject {
    constructor(scene, id, npointsU, npointsV, npartsU, npartsV, controlvertexes) {
        super(scene);
        this.id = id;
		var nurbsSurface = new CGFnurbsSurface( npointsU-1, npointsV-1, controlvertexes);

        this.obj = new CGFnurbsObject(scene, npartsU, npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }
    
    display(){
		this.obj.display();
    }
    
    updateTexCoords(){
        
    }
}