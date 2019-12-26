#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;


void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);

	float len = length(vTextureCoord - vec2(0.5)); //Efeito radial
	if(mod((timeFactor/150.0 - vTextureCoord.y ) * 300.0, 50.0) < 5.0)
		color = vec4(color.rgb*3.0,1.0 );	
	
	gl_FragColor = vec4(vec3(color - len*0.3), 1.0);
}