
precision mediump float;

uniform vec4 u_cameraPos;
uniform vec4 u_lightPos;

uniform sampler2D u_shadowMap;
uniform mat4 u_lightMVP;

varying vec4 w_Position;
varying vec3 v_normal;
varying vec3 v_color;

#define ka 0.25
#define kd 0.5
#define ks 0.9
#define alpha 3.

void main() {

    vec3 color = vec3(0);

    vec3 lightColor = vec3(1);

    vec4 lightSpacePos = u_lightMVP * w_Position;
    vec3 lightSpaceCoords = lightSpacePos.xyz / lightSpacePos.w;
    lightSpaceCoords = 0.5 * lightSpaceCoords + 0.5;

    // float shadow = texture2D(u_shadowMap, lightSpaceCoords.xy).r;
    // float visibility = (lightSpaceCoords.z > shadow + .0005) ? 0.0 : 1.0;

    float visibility = 0.0;
    vec2 texelSize = vec2(1.0 / 1024.);

    for (float x = -5.; x <= 5.; x += 0.5) {
        for (float y = -5.; y <= 5.; y += 0.5) {
            vec2 offset = vec2(x, y) * texelSize;
            float shadow = texture2D(u_shadowMap, lightSpaceCoords.xy + offset).r;
            visibility += (lightSpaceCoords.z > shadow + .0002) ? 0.0 : 1.0;
        }
    }
    visibility /= (21. * 21.);

    // phong
    vec3 L = normalize(u_lightPos - w_Position).xyz;
    vec3 N = normalize(v_normal);
    vec3 R = 2.*dot(L, N)*N - L;
    vec3 V = normalize(u_cameraPos - w_Position).xyz;
    color = v_color * (ka * lightColor + kd * visibility * max(0., dot(L, N)) * lightColor + ks * visibility * pow(max(0., dot(R, V)), alpha) * lightColor);

    gl_FragColor = vec4(color, 1);
}
