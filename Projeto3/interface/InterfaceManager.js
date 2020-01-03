class InterfaceManager {
    constructor(scene, game) {
        this.scene = scene;
        this.game = game;
        this.init();
        this.initElements();
    }
    init() {
        this.defaultShader = this.scene.activeShader;
        this.interfaceShader = new CGFshader(
            this.scene.gl,
            "shaders/interface.vert",
            "shaders/interface.frag"
        );

        //Setup Event Listener
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

    initElements(){
        this.elements = [];
        
        this.elements["squex"] = new InterfaceComp( this.scene, [-0.98, 0.98], 0.2, 0.2, "squex.png", null);

        this.elements["play"] = new InterfaceComp( this.scene, [-0.15, 0.15], 0.3, 0.3, "play.png", this.game.initGame.bind(this.game));
        
        this.elements["reset"] = new InterfaceComp( this.scene, [-0.98, -.78], 0.2, 0.15, "reset.png", this.game.initGame.bind(this.game));

        this.elements["undo"] = new InterfaceComp( this.scene, [-0.98, -.58], 0.2, 0.15, "undo.png", /*this.game.undo.bind(this.game)*/);
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
