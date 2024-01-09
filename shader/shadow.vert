precision mediump float;

attribute vec3 a_position;

uniform mat4 u_lightMVP;

void main() {
    gl_Position = u_lightMVP * vec4(a_position, 1.0);
}