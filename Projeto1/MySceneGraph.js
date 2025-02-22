var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block..
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        var children = viewsNode.children;

        this.views = [];
        var grandChildren = [];
        this.viewIds = [];

        this.default = this.reader.getString(viewsNode, 'default');

        if (this.default == null) {
            this.onXMLError("no ID defined for default view");
        }


        for (var i = 0; i < children.length; i++) {
            if (!(children[i].nodeName != "perspective" || children[i].nodeName != "ortho")) {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var viewId = this.reader.getString(children[i], 'id');
            if (viewId == null)
                return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewId] != null)
                return "ID must be unique for each view (conflict: ID = " + viewId + ")";

            grandChildren = children[i].children;
            this.viewIds.push(viewId);

            if (grandChildren[0].nodeName != 'from' && grandChildren[1].nodeName != 'to') {
                return "There must be 2 points with the tag 'from' and 'to'";
            }

            if (children[i].nodeName == "perspective") {

                var near = this.reader.getFloat(children[i], 'near');
                if (!(near != null && !isNaN(near))) {
                    return "unable to parse near of the view " + viewId;
                }


                var far = this.reader.getFloat(children[i], 'far');
                if (!(far != null && !isNaN(far))) {
                    return "unable to parse far of the view " + viewId;
                }

                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle))) {
                    return "unable to parse angle of the view " + viewId;
                }


                var fromX = this.reader.getFloat(grandChildren[0], 'x');
                if (!(fromX != null && !isNaN(fromX))) {
                    return "unable to parse x coordenate of the 'from' point of the view " + viewId;
                }

                var fromY = this.reader.getFloat(grandChildren[0], 'y');
                if (!(fromY != null && !isNaN(fromY))) {
                    return "unable to parse y coordenate of the 'from' point of the view " + viewId;
                }

                var fromZ = this.reader.getFloat(grandChildren[0], 'z');
                if (!(fromZ != null && !isNaN(fromZ))) {
                    return "unable to parse y coordenate of the 'from' point of the view " + viewId;
                }

                var toX = this.reader.getFloat(grandChildren[1], 'x');
                if (!(toX != null && !isNaN(toX))) {
                    return "unable to parse x coordenate of the 'to' point of the view " + viewId;
                }

                var toY = this.reader.getFloat(grandChildren[1], 'y');
                if (!(toY != null && !isNaN(toY))) {
                    return "unable to parse y coordenate of the 'to' point of the view " + viewId;
                }

                var toZ = this.reader.getFloat(grandChildren[1], 'z');
                if (!(toZ != null && !isNaN(toZ))) {
                    return "unable to parse y coordenate of the 'to' point of the view " + viewId;
                }

                var pers = new CGFcamera(angle, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ));
                this.views[viewId] = pers;



                //orthogonal
            } else if (children[i].nodeName == "ortho") {

                var near = this.reader.getFloat(children[i], 'near');
                if (!(near != null && !isNaN(near))) {
                    return "unable to parse near of the view " + viewId;
                }


                var far = this.reader.getFloat(children[i], 'far');
                if (!(far != null && !isNaN(far))) {
                    return "unable to parse far of the view " + viewId;
                }

                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left))) {
                    return "unable to parse left of the view " + viewId;
                }

                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right))) {
                    return "unable to parse right of the view " + viewId;
                }

                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top))) {
                    return "unable to parse top of the view " + viewId;
                }

                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom))) {
                    return "unable to parse bottom of the view " + viewId;
                }

                var fromX = this.reader.getFloat(grandChildren[0], 'x');
                if (!(fromX != null && !isNaN(fromX))) {
                    return "unable to parse x coordenate of the 'from' point of the view " + viewId;
                }

                var fromY = this.reader.getFloat(grandChildren[0], 'y');
                if (!(fromY != null && !isNaN(fromY))) {
                    return "unable to parse y coordenate of the 'from' point of the view " + viewId;
                }

                var fromZ = this.reader.getFloat(grandChildren[0], 'z');
                if (!(fromZ != null && !isNaN(fromZ))) {
                    return "unable to parse y coordenate of the 'from' point of the view " + viewId;
                }

                var toX = this.reader.getFloat(grandChildren[1], 'x');
                if (!(toX != null && !isNaN(toX))) {
                    return "unable to parse x coordenate of the 'to' point of the view " + viewId;
                }

                var toY = this.reader.getFloat(grandChildren[1], 'y');
                if (!(toY != null && !isNaN(toY))) {
                    return "unable to parse y coordenate of the 'to' point of the view " + viewId;
                }

                var toZ = this.reader.getFloat(grandChildren[1], 'z');
                if (!(toZ != null && !isNaN(toZ))) {
                    return "unable to parse y coordenate of the 'to' point of the view " + viewId;
                }

                if (grandChildren[2] != null) {
                    var upX = this.reader.getFloat(grandChildren[2], 'x');
                    if (!(upX != null && !isNaN(upX))) {
                        return "unable to parse x coordenate of the 'up' point of the view " + viewId;
                    }

                    var upY = this.reader.getFloat(grandChildren[2], 'y');
                    if (!(upY != null && !isNaN(upY))) {
                        return "unable to parse y coordenate of the 'up' point of the view " + viewId;
                    }

                    var upZ = this.reader.getFloat(grandChildren[2], 'z');
                    if (!(upZ != null && !isNaN(upZ))) {
                        return "unable to parse y coordenate of the 'up' point of the view " + viewId;
                    }

                    var cam = new CGFcameraOrtho(left, right, bottom, top, near, far, [fromX, fromY, fromZ], [toX, toY, toZ], [upX, upY, upZ]);
                    this.views[viewId] = cam;
                }

                var cam = new CGFcameraOrtho(left, right, bottom, top, near, far, [fromX, fromY, fromZ], [toX, toY, toZ], [0, 1, 0]);
                this.views[viewId] = cam;

            }
        }
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                } else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                } else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;
        this.textures = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag" + children[i].nodeName + ">");
                continue;
            }

            var textId = this.reader.getString(children[i], 'id');
            if (this.textures[textId] != null) {
                this.onXMLMinorError("Texture id: " + textId + " already exists.");
                continue;
            }

            var file = this.reader.getString(children[i], 'file');
            if (!(file.substring(file.length - 4, file.length) == ".jpg" || file.substring(file.length - 4, file.length) == ".png")) {
                this.onXMLMinorError("File type not suported.");
                continue;
            }

            this.texture = new CGFtexture(this.scene, file);
            this.textures[textId] = this.texture;
        }
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = new Array();

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (!(shininess != null && !isNaN(shininess)))
                return "unable to parse shininess of the material of ID = " + materialID;

            var grandChildren = children[i].children;
            var matProperties = [];

            for (var j = 0; j < grandChildren.length; j++)
                matProperties.push(grandChildren[j].nodeName);

            var emissionIndex = matProperties.indexOf("emission");
            var ambientIndex = matProperties.indexOf("ambient");
            var diffuseIndex = matProperties.indexOf("diffuse");
            var specularIndex = matProperties.indexOf("specular");

            var emissionProperties = [];
            if (emissionIndex != -1) {

                var r = this.reader.getFloat(grandChildren[emissionIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the material emission of ID = " + materialID;

                var g = this.reader.getFloat(grandChildren[emissionIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse R component of the material emission of ID = " + materialID;

                var b = this.reader.getFloat(grandChildren[emissionIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the material emission of ID = " + materialID;

                var a = this.reader.getFloat(grandChildren[emissionIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the material emission of ID = " + materialID;

                emissionProperties.push(r, g, b, a);
            } else {
                return "emission properties undefined for material of ID = " + materialID;
            }

            var ambientProperties = [];
            if (ambientIndex != -1) {

                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the material ambient of ID = " + materialID;

                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse R component of the material ambient of ID = " + materialID;

                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the material ambient of ID = " + materialID;

                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the material ambient of ID = " + materialID;

                ambientProperties.push(r, g, b, a);
            } else {
                return "ambient properties undefined for material of ID = " + materialID;
            }

            var diffuseProperties = [];
            if (diffuseIndex != -1) {

                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the material diffuse of ID = " + materialID;

                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse R component of the material diffuse of ID = " + materialID;

                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the material diffuse of ID = " + materialID;

                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the material diffuse of ID = " + materialID;

                diffuseProperties.push(r, g, b, a);
            } else {
                return "diffuse properties undefined for material of ID = " + materialID;
            }

            var specularProperties = [];
            if (specularIndex != -1) {

                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the material specular of ID = " + materialID;

                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse R component of the material specular of ID = " + materialID;

                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the material specular of ID = " + materialID;

                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the material specular of ID = " + materialID;

                specularProperties.push(r, g, b, a);
            } else {
                return "specular properties undefined for material of ID = " + materialID;
            }

            var material = new CGFappearance(this.scene);
            material.setTextureWrap("REPEAT", "REPEAT");
            material.setShininess(shininess);
            material.setEmission(emissionProperties[0], emissionProperties[1], emissionProperties[2], emissionProperties[3]);
            material.setAmbient(ambientProperties[0], ambientProperties[1], ambientProperties[2], ambientProperties[3]);
            material.setDiffuse(diffuseProperties[0], diffuseProperties[1], diffuseProperties[2], diffuseProperties[3]);
            material.setSpecular(specularProperties[0], specularProperties[1], specularProperties[2], specularProperties[3]);
            this.materials[materialID] = material;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.


            this.transformations[transformationID] = this.parseTransforms(grandChildren);
        }

        this.log("Parsed transformations");
        return null;
    }



    parseTransforms(grandChildren) {
        var transfMatrix = mat4.create();

        for (var j = 0; j < grandChildren.length; j++) {
            switch (grandChildren[j].nodeName) {
                case 'translate':
                    var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + grandChildren[j].nodeName);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);

                    break;
                case 'scale':
                    var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + grandChildren[j].nodeName);
                    if (!Array.isArray(coordinates))
                        return coordinates;
                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);

                    break;
                case 'rotate':
                    // angle
                    var axis = this.reader.getString(grandChildren[j], 'axis');
                    if (!(axis == "x" || axis == "y" || axis == "z")) {
                        this.onXMLError("unable to parse axis of the primitive coordinates for ID = " + grandChildren[j].nodeName);
                        return 0;
                    }

                    var angle = this.reader.getString(grandChildren[j], 'angle');
                    if (!(angle != null && !isNaN(angle))) {
                        this.onXMLError("unable to parse angle of the primitive coordinates for ID = " + grandChildren[j].nodeName);
                        return 0;
                    }
                    transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * Math.PI / 180, this.axisCoords[axis]);

                    break;
            }
        }
        return transfMatrix;
    }









    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;


            } else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;


                var triang = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);

                this.primitives[primitiveId] = triang;
            } else if (primitiveType == 'cylinder') {
                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(x1)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cyl = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cyl;
            } else if (primitiveType == 'sphere') {

                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive ID = " + primitiveId;

                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)) && slices < 3)
                    return "unable to parse slices of the primitive ID = " + primitiveId;

                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)) && stacks < 3)
                    return "unable to parse stacks of the primitive ID = " + primitiveId;

                var sphe = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphe

            } else if (primitiveType == 'torus') {
                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

                this.primitives[primitiveId] = torus;
            }
        }

        this.log("Parsed primitives");
        return null;
    }



    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        this.graphNodes = [];
        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            this.components[componentID] = children[i];
        }

        this.parseNodes(this.idRoot);
        return null;
    }


    parseNodes(nodeId) {
        var children = [];
        var grandChildren = [];

        var compNode = new GraphNode(nodeId);

        children = this.components[nodeId].children;
        var childNames = [];

        for (var i = 0; i < children.length; i++) {
            childNames.push(children[i].nodeName);
        }


        var transformationIndex = childNames.indexOf("transformation");
        var materialsIndex = childNames.indexOf("materials");
        var textureIndex = childNames.indexOf("texture");
        var childrenIndex = childNames.indexOf("children");

        if (transformationIndex != -1) {
            var transfchildren = children[transformationIndex].children;
            if (transfchildren.length != 0) {
                if (transfchildren[0].nodeName == "transformationref") {
                    var transfrom = this.reader.getString(transfchildren[0], "id");
                    if (this.transformations[transfrom] != null) {
                        mat4.copy(compNode.transform, this.transformations[transfrom]);
                    } else {
                        this.onXMLMinorError("transformation " + transfrom + " does not exist!");
                    }
                } else {

                    mat4.copy(compNode.transform, this.parseTransforms(transfchildren));
                }
            }
        }

        if (materialsIndex != -1) {
            var materialchildren = children[materialsIndex].children;
            if (materialchildren.length != 0) {
                for (var i = 0; i < materialchildren.length; i++) {
                    var materialid = this.reader.getString(materialchildren[i], "id");
                    if (materialid == "inherit" || this.materials[materialid] != null) {
                        compNode.materialsID.push(materialid);
                    } else {
                        this.onXMLMinorError("Material " + materialid + " does not exist!");
                    }
                }
            } else {
                this.onXMLError("compoment " + nodeId + " must have a material");
            }
        }

        if (textureIndex != 1) {
            var texturechildren = children[textureIndex];
            var texture = this.reader.getString(texturechildren, 'id');
            if (texture != "none" || texture != "inherit" || this.textures(texture) != null) {
                var textX = this.reader.getFloat(texturechildren, "length_s", false);
                var textY = this.reader.getFloat(texturechildren, "length_t", false);
                compNode.textureID = texture;
                compNode.xTex = textX;
                compNode.yTex = textY;
            } else {
                this.onXMLMinorError("Texture " + texture + " does not exit!");
            }
        }



        var childcomps = children[childrenIndex].children;
        for (var i = 0; i < childcomps.length; i++) {
            if (childcomps[i].nodeName == "componentref") {
                var childcompId = this.reader.getString(childcomps[i], "id");
                compNode.children.push(childcompId);
                this.parseNodes(childcompId);
            } else if (childcomps[i].nodeName == "primitiveref") {
                var childcompId = this.reader.getString(childcomps[i], 'id');
                compNode.leafs.push(childcompId);
            } else {
                this.onXMLMinorError("unknown tag <" + childcomps[i].nodeName + ">");
            }
        }

        this.graphNodes[nodeId] = compNode;

    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graplay loop for transversing the scene graph
        //To test the parsing/creation of the primitives, call the display function directly

        var rootMaterial = Object.keys(this.materials)[0];
        this.traverseNodes(this.idRoot, this.materials[rootMaterial], null, 1, 1);

    }

    traverseNodes(nodeID, material, texture, sLength, tLength) {

        var node = this.graphNodes[nodeID];


        if (node.materialsID[node.materialsIndex] != "inherit")
            material = this.materials[node.materialsID[node.materialsIndex]];

        if (node.textureID != "none" && node.textureID != "inherit") {
            texture = this.textures[node.textureID];
            material.setTexture(texture);
        } else if (node.textureID == "none") material.setTexture(null);

        if (node.xTex != null && node.yTex != null) {
            sLength = node.xTex;
            tLength = node.yTex;
        }

        material.apply();
        material.setTexture(texture);

        this.scene.multMatrix(node.transform);

        //desenhar as primitivas
        for (var i = 0; i < node.leafs.length; i++) {
            if (this.primitives[node.leafs[i]] != null)
                this.drawPrimitive(node.leafs[i], sLength, tLength);
        }

        //percorrer outros nodes filhos recursivamente
        for (var i = 0; i < node.children.length; i++) {
            this.scene.pushMatrix();
            this.traverseNodes(node.children[i], material, texture, sLength, tLength);
            this.scene.popMatrix();
        }
    }

    drawPrimitive(id, factorS, factorT) {
        var primitive = this.primitives[id];
        primitive.updateTexCoords(factorS, factorT);
        primitive.display();
    }


    nextMaterial() {
        for (var key in this.graphNodes) {
            if (this.graphNodes.hasOwnProperty(key)) {
                this.graphNodes[key].nextMaterial();
            }
        }
    }


}