/**
 * LeafPrimitive class.
 */
class GraphLeaf {

    /**
     * @constructor
     */
    constructor(scene, prim_type, args_array) {
        this.scene = scene;
        this.prim_type = prim_type;
        this.args_array = args_array;
        this.primitive = null;

        switch (this.prim_type) {
            case 't':
                this.initializeTriangle();
                break;
            case 'r':
                this.initializeRectangle();
                break;    
            case 'c':
                this.initializeCylinder();
                break;
            case 's':
                this.initializeSphere();
                break;
            case 'o':
                this.initializeTorus();
                break;    
        }

    };

}