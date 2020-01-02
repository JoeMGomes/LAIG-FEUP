
class Game { 
    constructor(scene){
        this.scene = scene;
        this.turn = 0;
        this.end = false;
        this.bot = 0;
        this.moves = [];
        this.blackPieces = [];
        this.whitePieces = [];
        this.turn = 0;
        this.server = new Connection();
        
    }

    playMove(pickID){
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
            this.turn = data;
        };
        let request = this.server.createRequest('turn', null, reply.bind(this));
        this.server.plRequest(request);
    }


    addPiece(row, col){
        console.log("addPiece");
        if(this.turn > 0){
            let pieceName = "black" + (this.blackPieces.length + 1);
            console.log(pieceName);
            this.blackPieces.push(pieceName);
            let placedPiece = this.scene.graph.graphNodes[pieceName];
            let rowCoords = this.getCoords(row);
            let colCoords = this.getCoords(col);
            let newTransform = mat4.create();
            mat4.translate(newTransform, newTransform, [colCoords, 0, rowCoords]);                
            placedPiece.transform = newTransform;   
        }
        else{
            let pieceName = "white" + (this.whitePieces.length + 1);
            console.log(pieceName.length);
            this.whitePieces.push(pieceName);
            let placedPiece = this.scene.graph.graphNodes[pieceName];
            let rowCoords = this.getCoords(row);
            let colCoords = this.getCoords(col);
            let newTransform = mat4.create();
            mat4.translate(newTransform, newTransform, [colCoords, 0, rowCoords]);                
            placedPiece.transform = newTransform;   
        }

    }

    updatePieces(){
        let reply = function(data) {
            let blacki = 1;
            let whitei = 1;
            for(let i = 0; i < data.length; i++){
                if (data[i][1] == "b"){
                    let pieceName = "black" + blacki;
                    let placedPiece = this.scene.graph.graphNodes[pieceName];
                    let row = this.getCoords(Math.floor((data[i][0]+1)/8));
                    let col = this.getCoords((data[i][0]+1)%8  -1);
                    let newTransform = mat4.create();
                    mat4.translate(newTransform, newTransform, [col, 0, row]);                
                    placedPiece.transform = newTransform;
                    blacki++;   
                }else if(data[i][1] == "@"){
                    let pieceName = "white" + blacki;
                    let placedPiece = this.scene.graph.graphNodes[pieceName];
                    let row = this.getCoords(Math.floor((data[i][0])/8));
                    let col = this.getCoords((data[i][0])%8);
                    let newTransform = mat4.create();
                    mat4.translate(newTransform, newTransform, [col, 0, row]);                
                    placedPiece.transform = newTransform;
                    whitei++;
                }
            }
        };
        let request = this.server.createRequest('get_octolist', null, reply.bind(this));
        this.server.plRequest(request);
    }


    anime(data){
        
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

}