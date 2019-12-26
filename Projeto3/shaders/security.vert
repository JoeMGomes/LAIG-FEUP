attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main() {
	float scale = 0.5;
	float xOff = 0.5;
	float yOff = -1.0;
	gl_Position =vec4(aVertexPosition.x*scale+xOff,aVertexPosition.y*scale+yOff,aVertexPosition.z, 1.0);
	
	vTextureCoord =  vec2(aTextureCoord.s , 1.0 - aTextureCoord.t );
}


