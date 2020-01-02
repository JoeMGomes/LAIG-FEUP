class InterfaceManager {
    constructor(scene, game) {
        this.scene = scene;
        this.game = game;
        this.init();
    }
    init() {
        this.defaultShader = this.scene.activeShader;
        this.interfaceShader = new CGFshader(
            this.scene.gl,
            "shaders/interface.vert",
            "shaders/interface.frag"
        );
        this.elements = [];
        
        // this.elements["button"] = new InterfaceComp( this.scene, [-0.25, 0.2], 0.5, 0.3, "blackmarble.png", function() {
        //     console.log("aee");
        // });
        
        // this.elements["aa"] = new InterfaceComp( this.scene, [-0.5, 0.5], 0.5, 0.3, "tiledWood.png",  function() {
        //     console.log("wood");
        // });

        //Init events
        let thisObj = this;
        let canvas = document.getElementsByTagName("canvas")[0];

        canvas.addEventListener("click", function(event) {
            let x = event.pageX - canvas.offsetLeft;
            let y = event.pageY - canvas.offsetTop;
        
            for(var element in thisObj.elements){
                if (thisObj.elements[element].isInside(x, y, canvas.width, canvas.height))
                    if(thisObj.elements[element].isActive())
                        thisObj.elements[element].onClick()
            }

        });
    }

    display() {
        this.scene.setActiveShader(this.interfaceShader);
        this.scene.gl.disable(this.scene.gl.DEPTH_TEST);

        for(var element in this.elements){
            if(this.elements[element].isActive())
                this.elements[element].display();
        }

        this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
        this.scene.setActiveShader(this.defaultShader);
    }
}
