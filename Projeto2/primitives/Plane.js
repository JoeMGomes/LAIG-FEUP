/**
 * Plane
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Plane extends CGFobject {
    constructor(scene, id, npartsU, npartsV) {
        super(scene);
        this.id = id;
        var controlvertexes = 	 [	// U = 0
            [ // V = 0..1;
                [-0.5, 0.0, -0.5, 1 ],
                [0.5,  0.0, -0.5, 1 ]
                
            ],
            // U = 1
            [ // V = 0..1
                [ -0.5, 0.0, 0.5, 1 ],
                [ 0.5,  0.0, 0.5, 1 ]							 
            ]
        ];
		var nurbsSurface = new CGFnurbsSurface(1, 1, controlvertexes);

        this.obj = new CGFnurbsObject(scene,npartsU, npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }
    
    display(){
		this.obj.display();
    }
    updateTexCoords(){
        
    }
    
}