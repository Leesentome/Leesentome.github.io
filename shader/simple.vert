
attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

varying vec4 w_Position;
varying vec3 v_normal;
varying vec3 v_color;

void main() {
    w_Position = u_model * vec4(a_position, 1.0);
    v_normal = a_normal;
    v_color = a_color;
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
}
