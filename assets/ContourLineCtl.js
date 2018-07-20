cc.Class({
    extends: cc.Component,

    properties: {
        speedY:0,
        deltaOpacity:0,
        fps:60,
        deltaY:0
    },

    onLoad() {
        this.ctx = this.node.addComponent(cc.Graphics);
        this.fps = 60;
    },

    drawDashLine (begin, end) {
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = cc.Graphics.LineCap.ROUND;
        this.ctx.strokeColor = cc.Color.WHITE;
        let length = Math.sqrt((begin.x - end.x) * (begin.x - end.x) + (begin.y - end.y) * (begin.y - end.y));
        for (let i = 0; i < length; i += 20) {
            this.ctx.moveTo(i * (end.x - begin.x) / length + begin.x, i * (end.y - begin.y) / length + begin.y);
            this.ctx.lineTo((i + 10) * (end.x - begin.x) / length + begin.x, (i + 10) * (end.y - begin.y) / length + begin.y);
        }
        this.ctx.stroke();
    },

    moveUp(deltaY) {
        if (deltaY > 0) {
            this.deltaY = deltaY;
            this.speedY = 50;
            this.deltaOpacity = 255 / (deltaY / this.speedY);
        }
    },

    stopMoving() {
        this.deltaY = 0;
        this.speedY = 0;
        this.deltaOpacity = -255;
    },

    start () {

    },

    update(dt) {
        if (this.deltaY < 0) {
            this.stopMoving();
        }
        if (this.node.opacity <= 0) {
            this.deltaOpacity = 0;
        }
        this.node.y += this.speedY;
        this.deltaY -= this.speedY;
        this.node.opacity += this.deltaOpacity;
    },

});