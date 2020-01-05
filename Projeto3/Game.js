
class Game { 
    constructor(scene){
        this.scene = scene;
        this.started = false;
        this.server = new Connection();
        this.updateTurn();
    }

    initGame(){
        this.turn = 0;
        this.end = false;
        this.bot = 0;
        this.moves = [];
        this.blackPieces = [];
        this.whitePieces = [];
        this.squarePieces = [];
        this.turn = 0;
        this.server = new Connection();

        this.inAnimation = false;
        this.animeTime = 0;
        this.cameraTime = 0;
        this.animeCamera = false;
        this.PieceAnimating = [];
        this.started = true;
        let resetRequest = this.server.createRequest('reset');
        this.server.plRequest(resetRequest);
        
        this.scene.interfaceManager.elements['play'].disable();
    }

    playMove(pickID){
        if(this.inAnimation)
            return;
        let row, col;
        if (pickID >= 17 && pickID <= 24){
            row = 0;
            col = pickID - 17;
        }
        else if (pickID >= 33 && pickID <= 40){
            row = 1;
            col = pickID - 33;
        }
        else if (pickID >= 49 && pickID <= 56){
            row = 2;
            col = pickID - 49;
        }
        else if (pickID >= 65 && pickID <= 72){
            row = 3;
            col = pickID - 65;
        }
        else if (pickID >= 81 && pickID <= 88){
            row = 4;
            col = pickID - 81;
        }
        else if (pickID >= 97 && pickID <= 104){
            row = 5;
            col = pickID - 97;
        }
        else if (pickID >= 113 && pickID <= 120){
            row = 6;
            col = pickID - 113;
        }
        else if (pickID >= 129 && pickID <= 136){
            row = 7;
            col = pickID - 129;
        }
        else{
            return null;
        }

        
        let reply = function(data) {
            this.updateTurn();
            if(data["msg"] == "moved"){
                this.addPiece(row, col);

            }
        };
        let request1 = this.server.createRequest('move', [row, col], reply.bind(this));
        this.server.plRequest(request1);
        
    }





    updateTurn(){
        let reply = function(data) {
            if ((this.turn > 0 && data < 0) || (this.turn < 0 && data > 0)){
                console.log("what");
                this.animeCamera = true;
            }
            this.turn = data;
        };
        let request = this.server.createRequest('turn', null, reply.bind(this));
        this.server.plRequest(request);
    }


    animecamera(t, camera){
        t /= 1000;  
        if(this.animeCamera){
            if(this.cameraTime == 0){
                this.cameraTime = t;
                this.lastT = 0;
            }else {
                let percentage = (t - this.cameraTime)/2;
                if (percentage > 1){
                    this.cameraTime = 0;
                    this.animeCamera = false;
                    if (this.turn < 0)
                    camera.setPosition([0, 3.6, 1.2]);
                    else
                    camera.setPosition([0, 3.6, -1.2]);
                    return;
                }
                if(this.turn > 0){
                    let newZ = Math.cos(Math.PI*percentage) * 1.2;
                    let newX = (Math.sin(Math.PI*percentage) * 1.2);
                    camera.setPosition([newX, 3.6, newZ]);
                }else {
                    let newZ = Math.cos(Math.PI*percentage) * -1.2;
                    let newX = (Math.sin(Math.PI*percentage) * 1.2);
                    camera.setPosition([newX, 3.6, newZ]);
                }
                
                this.lastT = t;
            }
        }
    }



    updateSquares(){
        let reply = function(data) {
            for(let i = 0; i < data.length; i++){
                if(data[i][1] == "b"){
                    let blacksquare = this.scene.graph.graphNodes["squarePieceblack"];
                    let newPiece = new GraphNode(blacksquare.nodeID + data[i][0]);
                    /* newPiece.nodeID = blacksquare.nodeID + data[i][0]; */
                    newPiece.children = blacksquare.children;
                    newPiece.leafs = blacksquare.leafs;
                    newPiece.materialsID = blacksquare.materialsID;
                    newPiece.materialsIndex = blacksquare.materialsIndex;
                    newPiece.textureID = blacksquare.textureID;
                    mat4.translate(newPiece.transform, newPiece.transform, [this.getSquareCoords(data[i][0]%7), 2.163, this.getSquareCoords(Math.floor(data[i][0]/7))]);
                    console.log(newPiece);
                    this.scene.graph.graphNodes[this.scene.graph.idRoot].children.push(newPiece.nodeID);
                    this.scene.graph.graphNodes[newPiece.nodeID] = newPiece;
                }
                else if (data[i][1] == "@"){
                    let whitesquare = this.scene.graph.graphNodes["squarePiecewhite"];
                    let newPiece = new GraphNode(whitesquare.nodeID + data[i][0]);
                    /* newPiece.nodeID = whitesquare.nodeID + data[i][0]; */
                    newPiece.children = whitesquare.children;
                    newPiece.leafs = whitesquare.leafs;
                    newPiece.materialsID = whitesquare.materialsID;
                    newPiece.materialsIndex = whitesquare.materialsIndex;
                    newPiece.textureID = whitesquare.textureID;
                    mat4.translate(newPiece.transform, newPiece.transform, [this.getSquareCoords(data[i][0]%7), 2.163, this.getSquareCoords(Math.floor(data[i][0]/7))]);
                    console.log(newPiece);
                    this.scene.graph.graphNodes[this.scene.graph.idRoot].children.push(newPiece.nodeID);
                    this.scene.graph.graphNodes[newPiece.nodeID] = newPiece;
                }

            }
        };
        let request = this.server.createRequest('get_squarelist', null, reply.bind(this));
        this.server.plRequest(request);
    }

    addPiece(row, col){
        console.log("addPiece");
        if(this.turn < 0){
            let pieceName = "black" + (this.blackPieces.length + 1);
            this.blackPieces.push(pieceName);
            let placedPiece = this.scene.graph.graphNodes[pieceName];
            let rowCoords = this.getCoords(row);
            let colCoords = this.getCoords(col);
            this.PieceAnimating.push(placedPiece);
            let finalPosition = [];
            finalPosition.push(colCoords);
            finalPosition.push(rowCoords);
            this.PieceAnimating.push(finalPosition);
            this.PieceAnimating.push(this.getInitialCoords((this.blackPieces.length + 1), 0.82));
            this.inAnimation = true;
            this.animeTime = 0;  
        }
        else{
            let pieceName = "white" + (this.whitePieces.length + 1);
            this.whitePieces.push(pieceName);
            let placedPiece = this.scene.graph.graphNodes[pieceName];
            let rowCoords = this.getCoords(row);
            let colCoords = this.getCoords(col);
            this.PieceAnimating.push(placedPiece);
            let finalPosition = [];
            finalPosition.push(colCoords);
            finalPosition.push(rowCoords);
            this.PieceAnimating.push(finalPosition);
            this.PieceAnimating.push(this.getInitialCoords((this.whitePieces.length + 1), -0.82));
            this.inAnimation = true;
            this.animeTime = 0;
        }

    }



    
    anime(t){
        t /= 1000;  
        if(this.inAnimation){
            if(this.animeTime == 0){
                this.animeTime = t;
            }else {
                let percentage = (t - this.animeTime)/2;
                if (percentage > 1){
                    this.animeTime = 0;
                    this.inAnimation = false;
                    let newMatrix = mat4.create();
                    mat4.translate(newMatrix, newMatrix, [this.PieceAnimating[1][0], 0, this.PieceAnimating[1][1]]);
                    this.PieceAnimating[0].transform = newMatrix;
                    this.PieceAnimating = [];
                    this.updateSquares();
                    return;
                }
                
                let newX = ((1 - percentage) * this.PieceAnimating[2][0]) + (percentage * this.PieceAnimating[1][0]);
                let newZ = ((1 - percentage) * this.PieceAnimating[2][2]) + (percentage * this.PieceAnimating[1][1]);
                let newY = ((1 - percentage) * this.PieceAnimating[2][1]) + Math.sin(Math.PI*percentage);
                let newMatrix = mat4.create();
                mat4.translate(newMatrix, newMatrix, [newX, newY, newZ]);
                this.PieceAnimating[0].transform = newMatrix;
            }
        }
    }


    getCoords(number){
        switch(number){
            case 0:
                return -0.63;
            case 1:
                return -0.45;
            case 2:
                return -0.27;
            case 3: 
                return -0.09;
            case 4:
                return 0.09;
            case 5:
                return 0.27;
            case 6:
                return 0.45;
            case 7:
                return 0.63;
        }

    }

    getSquareCoords(number){
        console.log(number);
        switch(number){
            case 0:
                return -0.54;
            case 1:
                return -0.36;
            case 2:
                return -0.18;
            case 3:
                return 0;
            case 4:
                return 0.18;
            case 5:
                return 0.36;
            case 6:
                return 0.54;
        }   
    }

    getInitialCoords(number, z){
        let x = Math.floor((number-1)/4);
        let y = (number-1)%4;

        let position = [];
        position.push(this.getCoords(x));
        switch(y){
            case 0:
                position.push(0.15);
                break;
            case 1:
                position.push(0.1);
                break;
            case 2:
                position.push(0.05);
                break;
            case 3:
                position.push(0);
                break;
        }
        position.push(z);
        return position;
    }

}