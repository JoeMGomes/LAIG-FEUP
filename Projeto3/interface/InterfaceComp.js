class InterfaceComp {

    constructor(scene, coords, width, height, textureName, on_click){
        this.scene = scene
        this.initBuffers(coords[0],coords[1],width,height);
        this.width = width
        this.height = height
        this.on_click=on_click
        if (textureName != null)
        this.texture = new CGFtexture(this.scene, "./scenes/images/interface/" + textureName);    
    }

    initBuffers(xPos, yPos, width, height){
        this.vertices = [
            xPos, yPos,
            xPos+width, yPos,
            xPos, yPos-height,
            xPos+width,yPos-height
        ];

        this.indices = [
            0, 2, 1,
            2, 3, 1
        ];

        this.texCoords = [
            0,0,
            1,0,
            0,1,
            1,1,
        ];

        let gl = this.scene.gl;
        this.vertsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        
        this.texCoordsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

        this.indicesBuffer.numValues = this.indices.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    display() {
        let shader = this.scene.activeShader;
        let gl = this.scene.gl;
        
        gl.enableVertexAttribArray(shader.attributes.aVertexPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertsBuffer);
        gl.vertexAttribPointer(shader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
    
        gl.enableVertexAttribArray(shader.attributes.aTextureCoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
        gl.vertexAttribPointer(shader.attributes.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

        if(this.texture != null)
            this.texture.bind();

        gl.drawElements(this.scene.gl.TRIANGLES, this.indicesBuffer.numValues, gl.UNSIGNED_SHORT, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        if(this.texture != null)
            this.texture.unbind();
    }

    onClick() {
        if (this.on_click != null){
            this.on_click();
        }
    }

    isInside(x, y, canvas_width, canvas_height) {
        let top = (-this.vertices[1] + 1) / 2 * canvas_height;
        let bottom = (-this.vertices[5] + 1) / 2 * canvas_height;
        let left = (this.vertices[0] + 1) / 2 * canvas_width;
        let right = (this.vertices[2] + 1) / 2 * canvas_width;
        let height = Math.abs(bottom - top);
        let width = Math.abs(right - left);
        return y >= top && y <= top + height && x >= left && x <= left + width;
    }
}