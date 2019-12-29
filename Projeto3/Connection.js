/**
 * Connection Class. Represents a connection to a PROLOG server.
 */

 class Connection {

    constructor(port) {
        this.port = port || 8081;
    }

    createRequest(command,args,onSuccess,onError){
        let request = {
            command: command,
            args: args,
            onSuccess: onSuccess,
            onError: onError
        };
        return request;
    }

    plRequest(request){
        let requestString = requase.command.toString();
        if(request.args != null)
            requestString += '(' + request.args.toString().replace(/"/g, '') +')';

        this.getPrologRequest(requestString, request.onSuccess,request.onError);
    }

    
    makeRequest(){ //TODO: DELETE
		var requestString = document.querySelector("#query_field").value;				
				
		// Make Request
		this.getPrologRequest(requestString);
	}

    getPrologRequest(requestString, onSuccess,onError, counter){
        var request = new XMLHttpRequest();
        if(counter == null){
            counter = 0;
        }

        request.open('GET', 'http://localhost:' + this.port + '/' + requestString, true);

        request.onload = function(data) {
             counter = 0;
            let reply;
            try{
                reply = JSON.parse(data.target.response);
            } catch(e){
                return console.log("JSON parsing error" + e);
            }

            if(onSuccess && data.target.status == 200)
                onSuccess(reply);
            else
                console.log(reply);
        };
        
        request.onError = onError || function () {
            console.log("Error waiting for response");
            if(counter < 2){
                tries++;
                getPrologRequest(requestString, onSuccess,onError, counter);
            }
        };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }



    closeServer(){
        this.getPrologRequest('quit');
    }
 }