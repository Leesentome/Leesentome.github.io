
class Cube {
    constructor(gl, shaderProgram, transform) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.shaderProgram.use();

        this.model = transform;
        this.uModel = this.gl.getUniformLocation(this.shaderProgram.program, "u_model");
        this.gl.uniformMatrix4fv(this.uModel, false, this.model);

        this.vertices = new Float32Array([
            // Front face
            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,

            // Back face
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
             0.5,  0.5, -0.5,

            // Top face
            -0.5,  0.5, -0.5,
             0.5,  0.5, -0.5,
            -0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,

            // Bottom face
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,

            // Right face
             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,

            // Left face
            -0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
            -0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,
        ]);

        this.indices = new Uint16Array([
            0, 1, 2, 2, 1, 3,    // Front
            4, 6, 5, 6, 7, 5,    // Back
            8, 10, 9, 9, 10, 11, // Top
            12, 13, 14, 14, 13, 15, // Bottom
            16, 17, 18, 18, 17, 19, // Right
            20, 22, 21, 22, 23, 21, // Left
        ]);

        this.normals = new Float32Array([
            // Front face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            // Back face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Top face
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Bottom face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            // Right face
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // Left face
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
        ]);

        const cColor = [0.9, 0.9, 0.9];
        this.colors = new Float32Array([
            // Front face
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],

            // Back face
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],

            // Top face
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],

            // Bottom face
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],

            // Right face
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],

            // Left face
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
            cColor[0], cColor[1], cColor[2],
        ]);

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position");
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.normals, this.gl.STATIC_DRAW);

        this.normalAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_normal");
        this.gl.vertexAttribPointer(this.normalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.normalAttributeLocation);

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);

        this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_color");
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);
    }

    draw() {
        this.shaderProgram.use();
        
        this.gl.uniformMatrix4fv(this.uModel, false, this.model);

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);

        // Bind color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);

        // Bind color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);

        // Bind index buffer
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }
}

class Bedroom {
    constructor(gl, shaderProgram, shadowProgram, transform) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.shadowProgram = shadowProgram;

        this.model = transform;

        // Dimension en m
        // Sol en 0
        // porte centree en 0, 0
        const bedroomWidth = 5;
        const bedroomDepth = 3;
        const doorWidth = 0.8;
        const doorHeight = 2;
        const bedroomHeight = 2.5;
        const wallThickness = 0.05; // inward
        const roofThickness = 0.05; // upward
        const windowSill = 0.9;
        const windowWidth = 1.5;
        const windowHeight = 1.3;

        this.vertices = new Float32Array([
            // Front face outside
            -bedroomWidth/2,                             0, 0,  // 0
               -doorWidth/2,                             0, 0,
               -doorWidth/2, bedroomHeight + roofThickness, 0,
            -bedroomWidth/2, bedroomHeight + roofThickness, 0,
               -doorWidth/2,    doorHeight + roofThickness, 0,
                doorWidth/2,    doorHeight + roofThickness, 0,
                doorWidth/2, bedroomHeight + roofThickness, 0,
                doorWidth/2,                              0, 0,
             bedroomWidth/2,                              0, 0,
             bedroomWidth/2, bedroomHeight + roofThickness, 0,
            
             // Front face inside
             bedroomWidth/2 - wallThickness,             0, -wallThickness,  // 10
                                doorWidth/2,             0, -wallThickness,
                                doorWidth/2, bedroomHeight, -wallThickness,
             bedroomWidth/2 - wallThickness, bedroomHeight, -wallThickness,
                                doorWidth/2,    doorHeight, -wallThickness,
                               -doorWidth/2,    doorHeight, -wallThickness,
                               -doorWidth/2, bedroomHeight, -wallThickness,
                               -doorWidth/2,             0, -wallThickness,
            -bedroomWidth/2 + wallThickness,             0, -wallThickness,
            -bedroomWidth/2 + wallThickness, bedroomHeight, -wallThickness,

            // Back face
            -bedroomWidth/2 + wallThickness,             0, -bedroomDepth + wallThickness,  // 20
             bedroomWidth/2 - wallThickness,             0, -bedroomDepth + wallThickness,
             bedroomWidth/2 - wallThickness, bedroomHeight, -bedroomDepth + wallThickness,
            -bedroomWidth/2 + wallThickness, bedroomHeight, -bedroomDepth + wallThickness,

            // Top face inside
            -bedroomWidth/2,  bedroomHeight,             0,  // 24
            -bedroomWidth/2,  bedroomHeight, -bedroomDepth,
             bedroomWidth/2,  bedroomHeight, -bedroomDepth,
             bedroomWidth/2,  bedroomHeight,             0,

            // Bottom face
            -bedroomWidth/2 + wallThickness,  0,             0,  // 28
             bedroomWidth/2 - wallThickness,  0,             0,
             bedroomWidth/2 - wallThickness,  0, -bedroomDepth,
            -bedroomWidth/2 + wallThickness,  0, -bedroomDepth,

            // Right face
            bedroomWidth/2 - wallThickness,                         0,     -bedroomDepth + wallThickness, // 32
            bedroomWidth/2 - wallThickness,                         0, -(bedroomDepth + windowWidth) / 2,
            bedroomWidth/2 - wallThickness,             bedroomHeight, -(bedroomDepth + windowWidth) / 2,
            bedroomWidth/2 - wallThickness,             bedroomHeight,     -bedroomDepth + wallThickness,
            bedroomWidth/2 - wallThickness,                         0, -(bedroomDepth - windowWidth) / 2,
            bedroomWidth/2 - wallThickness,                windowSill, -(bedroomDepth - windowWidth) / 2,
            bedroomWidth/2 - wallThickness,                windowSill, -(bedroomDepth + windowWidth) / 2,
            bedroomWidth/2 - wallThickness, windowSill + windowHeight, -(bedroomDepth + windowWidth) / 2,
            bedroomWidth/2 - wallThickness, windowSill + windowHeight, -(bedroomDepth - windowWidth) / 2,
            bedroomWidth/2 - wallThickness,             bedroomHeight, -(bedroomDepth - windowWidth) / 2,
            bedroomWidth/2 - wallThickness,                         0,                    -wallThickness,
            bedroomWidth/2 - wallThickness,             bedroomHeight,                    -wallThickness,

            // Left face
            -bedroomWidth/2 + wallThickness,             0,                -wallThickness, // 44
            -bedroomWidth/2 + wallThickness,             0, -bedroomDepth + wallThickness,
            -bedroomWidth/2 + wallThickness, bedroomHeight, -bedroomDepth + wallThickness,
            -bedroomWidth/2 + wallThickness, bedroomHeight,                -wallThickness,

            // Door thickness
            -doorWidth/2,          0,              0, // 48
            -doorWidth/2,          0, -wallThickness,
            -doorWidth/2, doorHeight, -wallThickness,
            -doorWidth/2, doorHeight,              0,
            -doorWidth/2, doorHeight,              0,
            -doorWidth/2, doorHeight, -wallThickness,
             doorWidth/2, doorHeight, -wallThickness,
             doorWidth/2, doorHeight,              0,
             doorWidth/2, doorHeight,              0,
             doorWidth/2, doorHeight, -wallThickness,
             doorWidth/2,          0, -wallThickness,
             doorWidth/2,          0,              0,
            
             // Top face outside
             -bedroomWidth/2,  bedroomHeight + roofThickness,             0,  // 60
              bedroomWidth/2,  bedroomHeight + roofThickness,             0,
              bedroomWidth/2,  bedroomHeight + roofThickness, -bedroomDepth,
             -bedroomWidth/2,  bedroomHeight + roofThickness, -bedroomDepth,

             // Right face
             bedroomWidth/2,                             0,                                 0, // 64
             bedroomWidth/2,                             0, -(bedroomDepth - windowWidth) / 2,
             bedroomWidth/2, bedroomHeight + roofThickness, -(bedroomDepth - windowWidth) / 2,
             bedroomWidth/2, bedroomHeight + roofThickness,                                 0,
             bedroomWidth/2,                             0, -(bedroomDepth + windowWidth) / 2,
             bedroomWidth/2,                    windowSill, -(bedroomDepth + windowWidth) / 2,
             bedroomWidth/2,                    windowSill, -(bedroomDepth - windowWidth) / 2,
             bedroomWidth/2,     windowSill + windowHeight, -(bedroomDepth - windowWidth) / 2,
             bedroomWidth/2,     windowSill + windowHeight, -(bedroomDepth + windowWidth) / 2,
             bedroomWidth/2, bedroomHeight + roofThickness, -(bedroomDepth + windowWidth) / 2,
             bedroomWidth/2,                             0,                     -bedroomDepth,
             bedroomWidth/2, bedroomHeight + roofThickness,                     -bedroomDepth,

             // window thickness
                             bedroomWidth/2,                windowSill, -(bedroomDepth - windowWidth) / 2, // 76
             bedroomWidth/2 - wallThickness,                windowSill, -(bedroomDepth - windowWidth) / 2,
             bedroomWidth/2 - wallThickness, windowSill + windowHeight, -(bedroomDepth - windowWidth) / 2,
                             bedroomWidth/2, windowSill + windowHeight, -(bedroomDepth - windowWidth) / 2,
                             bedroomWidth/2, windowSill + windowHeight, -(bedroomDepth - windowWidth) / 2,
             bedroomWidth/2 - wallThickness, windowSill + windowHeight, -(bedroomDepth - windowWidth) / 2,
             bedroomWidth/2 - wallThickness, windowSill + windowHeight, -(bedroomDepth + windowWidth) / 2,
                             bedroomWidth/2, windowSill + windowHeight, -(bedroomDepth + windowWidth) / 2,
                             bedroomWidth/2, windowSill + windowHeight, -(bedroomDepth + windowWidth) / 2,
             bedroomWidth/2 - wallThickness, windowSill + windowHeight, -(bedroomDepth + windowWidth) / 2,
             bedroomWidth/2 - wallThickness,                windowSill, -(bedroomDepth + windowWidth) / 2,
                             bedroomWidth/2,                windowSill, -(bedroomDepth + windowWidth) / 2,
                             bedroomWidth/2,                windowSill, -(bedroomDepth + windowWidth) / 2,
             bedroomWidth/2 - wallThickness,                windowSill, -(bedroomDepth + windowWidth) / 2,
             bedroomWidth/2 - wallThickness,                windowSill, -(bedroomDepth - windowWidth) / 2,
                             bedroomWidth/2,                windowSill, -(bedroomDepth - windowWidth) / 2,

             

        ]); // len = 92
        
        this.indices = new Uint16Array([
            0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 2, 7, 8, 9, 7, 9, 6,                                           // Front outside
            10, 11, 12, 10, 12, 13, 14, 15, 16, 14, 16, 12, 17, 18, 19, 17, 19, 16,                         // Front inside
            20, 21, 22, 20, 22, 23,                                                                         // Back inside
            24, 25, 26, 24, 26, 27,                                                                         // Top inside
            28, 29, 30, 28, 30, 31,                                                                         // Bottom inside
            32, 33, 34, 32, 34, 35, 33, 36, 37, 33, 37, 38, 39, 40, 41, 39, 41, 34, 36, 42, 43, 36, 43, 41, // Right inside
            44, 45, 46, 44, 46, 47,                                                                         // Left inside
            48, 49, 50, 48, 50, 51, 52, 53, 54, 52, 54, 55, 56, 57, 58, 56, 58, 59,                         // Door thickness
            60, 61, 62, 60, 62, 63,                                                                         // Top outside
            64, 65, 66, 64, 66, 67, 65, 68, 69, 65, 69, 70, 71, 72, 73, 71, 73, 66, 68, 74, 75, 68, 75, 73, // right outside
            76, 77, 78, 76, 78, 79, 80, 81, 82, 80, 82, 83, 84, 85, 86, 84, 86, 87, 88, 89, 90, 88, 90, 91, // window thickness
        ]);
        
        this.normals = new Float32Array([
            // Front face outside
            0, 0, 1,  // 0
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            
            // Front face inside
            0, 0, -1,  // 10
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Back face
            0, 0, -1,  // 20
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Top face
            0, -1, 0,  // 24
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            // Bottom face
            0, 1, 0,  // 28
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Right face
            -1, 0, 0, // 32
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            // Left face
            1, 0, 0, // 44
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // Door thickness
             1,  0, 0, // 48
             1,  0, 0,
             1,  0, 0,
             1,  0, 0,
             0, -1, 0,
             0, -1, 0,
             0, -1, 0,
             0, -1, 0,
            -1,  0, 0,
            -1,  0, 0,
            -1,  0, 0,
            -1,  0, 0,
            
            // Top face outside
            0, 1, 0,  // 60
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Right face
            1, 0, 0, // 64
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // window thickness
            0,  0, -1, // 76
            0,  0, -1,
            0,  0, -1,
            0,  0, -1,
            0,  0,  0,
            0,  0,  0,
            0,  0,  0,
            0,  0,  0,
            0,  0,  1,
            0,  0,  1,
            0,  0,  1,
            0,  0,  1,
            0, -1,  0,
            0, -1,  0,
            0, -1,  0,
            0, -1,  0,

        ]); // len = 92

        
        this.colors = new Float32Array([
            // Front face outside
            0.2, 0.2, 0.2,  // 0
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2,
            0.2, 0.2, 0.2,
            
             // Front face inside
            0.6, 0.6, 0.6,  // 10
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,

            // Back face
            0.8, 0.6, 0.4,  // 20
            0.8, 0.6, 0.4,
            0.8, 0.6, 0.4,
            0.8, 0.6, 0.4,

            // Top face
            0.9, 0.9, 0.9,  // 24
            0.9, 0.9, 0.9,
            0.9, 0.9, 0.9,
            0.9, 0.9, 0.9,

            // Bottom face
            0.3, 0.3, 0.3,  // 28
            0.3, 0.3, 0.3,
            0.3, 0.3, 0.3,
            0.3, 0.3, 0.3,

            // Right face
            0.4, 0.8, 0.8, // 32
            0.4, 0.8, 0.8,
            0.4, 0.8, 0.8,
            0.4, 0.8, 0.8,
            0.4, 0.8, 0.8,
            0.4, 0.8, 0.8,
            0.4, 0.8, 0.8,
            0.4, 0.8, 0.8,
            0.4, 0.8, 0.8,
            0.4, 0.8, 0.8,
            0.4, 0.8, 0.8,
            0.4, 0.8, 0.8,

            // Left face
            0.8, 0.4, 0.8, // 44
            0.8, 0.4, 0.8,
            0.8, 0.4, 0.8,
            0.8, 0.4, 0.8,

            // Door thickness
            0.4, 0.4, 0.4, // 48
            0.4, 0.4, 0.4,
            0.4, 0.4, 0.4,
            0.4, 0.4, 0.4,
            0.4, 0.4, 0.4,
            0.4, 0.4, 0.4,
            0.4, 0.4, 0.4,
            0.4, 0.4, 0.4,
            0.4, 0.4, 0.4,
            0.4, 0.4, 0.4,
            0.4, 0.4, 0.4,
            0.4, 0.4, 0.4,
            
            // Top face outside
            0, 1, 0,  // 60
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Right face
            1, 0, 0, // 64
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // window thickness
            0.9, 0.6, 0.2, // 76
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,
            0.9, 0.6, 0.2,

        ]); // len = 92

        this.shaderProgram.use();
        this.uModel = this.gl.getUniformLocation(this.shaderProgram.program, "u_model");
        this.gl.uniformMatrix4fv(this.uModel, false, this.model);

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_position");
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.normals, this.gl.STATIC_DRAW);

        this.normalAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_normal");
        this.gl.vertexAttribPointer(this.normalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.normalAttributeLocation);

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.STATIC_DRAW);

        this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram.program, "a_color");
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);

        // Bind for shadowMap
        this.shadowProgram.use();

        this.uShadowModel = this.gl.getUniformLocation(this.shadowProgram.program, "u_model");
        this.gl.uniformMatrix4fv(this.uShadowModel, false, this.model);

        this.vertexShadowBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexShadowBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

        this.indexShadowBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexShadowBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);

        this.positionShadowAttributeLocation = this.gl.getAttribLocation(this.shadowProgram.program, "a_position");
        this.gl.vertexAttribPointer(this.positionShadowAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionShadowAttributeLocation);
    }

    draw() {
        this.shaderProgram.use();
        
        this.gl.uniformMatrix4fv(this.uModel, false, this.model);

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);

        // Bind normal buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.vertexAttribPointer(this.normalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.normalAttributeLocation);

        // Bind color buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.colorAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);

        // Bind index buffer
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    drawShadow() {
        this.shadowProgram.use();
        
        this.gl.uniformMatrix4fv(this.uShadowModel, false, this.model);

        // Bind position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexShadowBuffer);
        this.gl.vertexAttribPointer(this.positionShadowAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionShadowAttributeLocation);

        // Bind index buffer
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexShadowBuffer);

        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }
}
