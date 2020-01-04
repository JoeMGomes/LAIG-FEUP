/*
    class keyframe
*/


class KeyFrameAnimation extends Animation {




    constructor(keys) {
        super(keys);
        this.tAnterior = 0;
        this.matrix = mat4.create();
        this.percentage = 0;
        this.pos0 = -1;
        this.pos1 = 0;
        this.ended = false;
    }



    update(t) {
        t /= 1000;

        this.pos0 = -1;
        this.pos1 = 0;
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[this.pos1].instant < t) {
                this.pos0++;
                this.pos1++;
            } else
                break;
        }


        if (this.pos1 >= this.keys.length) {
            this.pos0--;
            this.pos1--;
            return;
        } else if (this.pos1 == 0) {
            this.percentage += (t - this.tAnterior) / (this.keys[this.pos1].instant - 0);
        } else {
            this.percentage += (t - this.tAnterior) / (this.keys[this.pos1].instant - this.keys[this.pos0].instant)
        }
        this.tAnterior = t;

    }


    apply() {
        let matrixToAdd = mat4.create();
        if (!this.ended) {
            let transformx = this.keys[this.pos1].transform[0] * this.percentage;
            let transformy = this.keys[this.pos1].transform[1] * this.percentage;
            let transformz = this.keys[this.pos1].transform[2] * this.percentage;

            let scalex = ((this.keys[this.pos1].scale[0] - 1) * this.percentage) + 1;
            let scaley = ((this.keys[this.pos1].scale[1] - 1) * this.percentage) + 1;
            let scalez = ((this.keys[this.pos1].scale[2] - 1) * this.percentage) + 1;

            let rotatex = this.keys[this.pos1].rotate[0] * this.percentage;
            let rotatey = this.keys[this.pos1].rotate[1] * this.percentage;
            let rotatez = this.keys[this.pos1].rotate[2] * this.percentage;

            mat4.translate(matrixToAdd, matrixToAdd, [transformx, transformy, transformz]);
            mat4.scale(matrixToAdd, matrixToAdd, [scalex, scaley, scalez]);
            mat4.rotateX(matrixToAdd, matrixToAdd, rotatex * Math.PI / 180);
            mat4.rotateY(matrixToAdd, matrixToAdd, rotatey * Math.PI / 180);
            mat4.rotateZ(matrixToAdd, matrixToAdd, rotatez * Math.PI / 180);
            this.percentage = 0;
            mat4.multiply(this.matrix, this.matrix, matrixToAdd);
        }
        return this.matrix;

    }



}