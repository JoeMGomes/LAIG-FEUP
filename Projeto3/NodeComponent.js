/**
 * NodeComponent class.
 */
class GraphNode {

    /**
     * @constructor
     */
    constructor(nodeID) {
        this.nodeID = nodeID;
        this.children = [];
        this.leafs = [];
        this.materialsID = [];  
        this.materialsIndex = 0;
        this.animation;
        this.textureID = null;
        this.xTex = null;
        this.yTex = null;
        this.transform = mat4.create();
    }


    nextMaterial() {
        this.materialsIndex++;
        this.materialsIndex = this.materialsIndex % this.materialsID.length;
    }

}