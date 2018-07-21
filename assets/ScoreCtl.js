cc.Class({
    extends: cc.Component,

    properties: {
        score:0,
        deltaY: 0,
        speedY: 0,
        fps: 60
    },

    onLoad () {
        this.score = 0;
        this.fps = 60;
        this.label = this.node.getComponent(cc.Label);
    },

    moveUp(deltaY) {
        if (deltaY > 0) {
            this.deltaY = deltaY;
            this.speedY = 120;
        }
    },

    stopMoving() {
        this.deltaY = 0;
        this.speedY = 0;
    },

    updateScore() {
        console.log(this.node.y - this.gameCtl.cameraCtl.currentY + this.gameCtl.camera.y);
        this.score = parseInt((this.node.y - (this.gameCtl.cameraCtl.currentY - this.gameCtl.camera.y)) / 10);
        this.gameCtl.score = this.score;
        this.label.string = this.score;
    },

    update (dt) {
        if (this.deltaY < 0) {
            this.stopMoving();
        }
        this.node.y += this.speedY / this.fps;
        this.deltaY -= this.speedY / this.fps;

        this.updateScore();
    },
});
