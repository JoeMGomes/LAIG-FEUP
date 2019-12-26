/**
 * Cylinder2
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Cylinder2 extends CGFobject {
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

    initBuffers(){

        var controlvertexes = [
          // U = 0
          [
            // V = 0..1;
            [-this.top, 0.0, this.height, 1],
            [-this.base, 0.0, 0.0, 1]
          ],
          
          [
            // V = 0..1
            [-this.top, this.top/ 0.75, this.height, 1],
            [-this.base, this.base/ 0.75, 0.0, 1]
          ],
         
          [
            // V = 0..1;
            [this.top, this.top/ 0.75, this.height, 1],
            [this.base, this.base/ 0.75, 0.0, 1]
          ],
          [
            // V = 0..1;
            [this.top, 0.0, this.height, 1],
            [this.base, 0.0, 0.0, 1]
          ],
          ]
        ;
	      var nurbsSurface = new CGFnurbsSurface(3, 1, controlvertexes);

        this.obj = new CGFnurbsObject(scene,this.slices, this.stacks, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }
    
    display(){
      this.obj.display();

      this.scene.pushMatrix();
      this.scene.rotate(Math.PI,0,0,1);
      this.obj.display();
      this.scene.popMatrix();
    }
    updateTexCoords(){
        
    }
    
}