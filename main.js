
class ShaderProgram {
    constructor(gl, name) {
        this.gl = gl;
        this.name = name;
    }

    async loadShaderSource(url) {
        try {
            const response = await fetch(url);
            return response.text();
        } catch (error) {
            console.error(`Failed to load shader source from ${url}.`, error);
            return null;
        }
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(`Shader compilation error: ${this.gl.getShaderInfoLog(shader)}`);
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    async init() {
        const vertexShaderSource = await this.loadShaderSource('./shader/' + this.name + '.vert');
        const fragmentShaderSource = await this.loadShaderSource('./shader/' + this.name + '.frag');

        if (!vertexShaderSource || !fragmentShaderSource) {
            console.error("Failed to load shader sources.");
            return;
        }

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) {
            console.error("Failed to compile shaders.");
            return;
        }

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error(`Program linking error: ${this.gl.getProgramInfoLog(this.program)}`);
            return;
        }
    }

    use() {
        this.gl.useProgram(this.program);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const canvas = document.getElementById("paintCanvas");
    const resolutionMultiplier = 1;
    
    canvas.width = canvas.clientWidth * resolutionMultiplier;
    canvas.height = canvas.clientHeight * resolutionMultiplier;

    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.log("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }

    const ext = gl.getExtension("WEBGL_depth_texture");

    const shaderProgram = new ShaderProgram(gl, 'simple');
    await shaderProgram.init();

    const shadowProgram = new ShaderProgram(gl, 'shadow');
    await shadowProgram.init();

    var drawables = []

    const modelMatrix = mat4.create();
    const bedroom = new Bedroom(gl, shaderProgram, shadowProgram, modelMatrix);
    // const cube = new Cube(gl, shaderProgram, modelMatrix);

    // drawables.push(cube);
    drawables.push(bedroom);

    shaderProgram.use();

    // Clear the canvas and setup the initial env
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST); // Enable depth testing for 3D rendering
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Set up the perspective matrix
    const projectionMatrix = mat4.create();
    const aspectRatio = canvas.width / canvas.height;
    const viewAngleVer = Math.PI / 3
    mat4.perspective(projectionMatrix, viewAngleVer, aspectRatio, 0.1, 20.0);
    
    // View Matrix computation
    function computeViewMatrix(mouseXPercentage, mouseYPercentage) {
        const minHorAngle = -4/9 * Math.PI;
        const maxHorAngle = 4/9 * Math.PI;
        
        const minVerAngle = - Math.PI / 4;
        const maxVerAngle = Math.PI / 6;

        const aspectRatio = canvas.width / canvas.height;

        const viewAngleHor = 2 * Math.atan(Math.tan(viewAngleVer*0.5)*aspectRatio);
        
        var angleH = (maxHorAngle - viewAngleHor - minHorAngle) * mouseXPercentage + minHorAngle + viewAngleHor/2;
        var angleV = (maxVerAngle - viewAngleVer - minVerAngle) * (1-mouseYPercentage) + minVerAngle + viewAngleVer/2;
    
        var dir = [Math.sin(angleH), Math.sin(angleV), -Math.cos(angleV)*Math.cos(angleH)];
        var target = [eye[0] + dir[0], eye[1] + dir[1], eye[2] + dir[2]];
        const up = [0, 1, 0];
        mat4.lookAt(viewMatrix, eye, target, up);
    }

    const viewMatrix = mat4.create();
    var eye = [0, 1.7, 0.2];
    computeViewMatrix(0.5, 0.5);
    
    // Set the lightPos
    const lightPos = [10, 3, 5];

    // Pass the uniform to the main shader
    gl.useProgram(shaderProgram.program);
    const uProjection = gl.getUniformLocation(shaderProgram.program, "u_projection");
    gl.uniformMatrix4fv(uProjection, false, projectionMatrix);
    const uView = gl.getUniformLocation(shaderProgram.program, "u_view");
    gl.uniformMatrix4fv(uView, false, viewMatrix);
    const uCameraPos = gl.getUniformLocation(shaderProgram.program, "u_cameraPos");
    gl.uniform4fv(uCameraPos, [eye[0], eye[1], eye[2], 1]);
    const uLightPos = gl.getUniformLocation(shaderProgram.program, "u_lightPos")
    gl.uniform4fv(uLightPos, [lightPos[0], lightPos[1], lightPos[2], 1]);
   
    shadowProgram.use();
    // Create the texture for the shadowMap
    const shadowMapSize = 1024; // Adjust as needed
    const shadowFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFramebuffer);

    const shadowDepthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, shadowDepthTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, shadowMapSize, shadowMapSize, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, shadowDepthTexture, 0);

    // Set up the light's projection and view matrices
    const lightProjectionMatrix = mat4.create();
    mat4.perspective(lightProjectionMatrix, viewAngleVer, 1.0, 1, 50.0); // Adjust near and far values
    const lightViewMatrix = mat4.create();
    mat4.lookAt(lightViewMatrix, lightPos, [0, 0, 0], [0, 1, 0]);
    const lightMVPMatrix = mat4.create();
    mat4.multiply(lightMVPMatrix, lightProjectionMatrix, lightViewMatrix);

    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFramebuffer);
    gl.viewport(0, 0, shadowMapSize, shadowMapSize);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const uShadowLightMVP = gl.getUniformLocation(shadowProgram.program, "u_lightMVP");
    gl.uniformMatrix4fv(uShadowLightMVP, false, lightMVPMatrix);

    for (const elt of drawables) {
        elt.drawShadow();
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    shaderProgram.use();

    const uLightMVP = gl.getUniformLocation(shaderProgram.program, "u_lightMVP");
    gl.uniformMatrix4fv(uLightMVP, false, lightMVPMatrix);
    const shadowMapTextureUnit = 1;
    gl.activeTexture(gl.TEXTURE0 + shadowMapTextureUnit);
    gl.bindTexture(gl.TEXTURE_2D, shadowDepthTexture);
    const uShadowMap = gl.getUniformLocation(shaderProgram.program, "u_shadowMap");
    gl.uniform1i(uShadowMap, shadowMapTextureUnit);

    // Drawer
    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (const elt of drawables) {
            elt.draw();
        }
    }

    // Update view on mouse pos
    document.addEventListener('mousemove', function(event) {
        computeViewMatrix(event.clientX /  window.innerWidth, event.clientY / window.innerHeight);

        gl.uniformMatrix4fv(uView, false, viewMatrix);
        gl.uniform4fv(uCameraPos, [eye[0], eye[1], eye[2], 1]);
        
        drawScene();
    });

    // For window resizing
    function handleResize() {
        // Update the canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Update the viewport size
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Recalculate the perspective matrix
        const newAspectRatio = canvas.width / canvas.height;
        mat4.perspective(projectionMatrix, Math.PI / 4, newAspectRatio, 0.1, 100.0);

        // Pass the updated matrix to the shader
        gl.uniformMatrix4fv(uProjection, false, projectionMatrix);

        // Redraw the scene
        drawScene();
    }
    window.addEventListener("resize", handleResize);

    drawScene();
});
