const State = {
    still: 0,
    movingDown: 1,
    movingUp: 2
};

cc.Class({
    extends: cc.Component,

    properties: {
        //deltaY: 50,
        maxHeight: 300,
        targetHeight: 800,
        state: 0,
        speedX: 0,
        speedY: 0,
        accelerationX: 0,
        accelerationY: 0,
        accelerationS: 0,
        fps: 60,
        zoomSpeed: 0,
        focusHeight: 300,
        finalHeight: 600,
        //deltaY: 0,
        gameCtl: {
            default: null,
            type: cc.Component,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Event.TOUCH_MOVE, (event) => {
            console.log('canvas touch move event');
        });
        this.node.on(cc.Event.TOUCH_END, (event) => {
            console.log('canvas touch end event');
        });

        this.originalY = this.node.getPosition().y;
        this.currentY = this.node.getPosition().y;
        this.state = State.still;
    },

    moveDown(deltaY) {
        //this.deltaY = deltaY;
        this.state = State.movingDown;
        this.accelerationY = 50;

        this.speedY = -Math.sqrt(2 * Math.abs(this.accelerationY * deltaY));
    },

    moveUp() {
        this.state = State.movingUp;
        this.accelerationY = -50;
        this.speedY = Math.sqrt(2 * Math.abs(this.accelerationY * (this.currentY - this.originalY)));

        let deltaScale = 0.4;
        this.accelerationS = deltaScale / (this.currentY - this.originalY) * this.accelerationY;
        this.zoomSpeed = -Math.sqrt(2 * Math.abs(this.accelerationS * deltaScale));
        //this.zoomSpeed = -0.1;
    },

    stopMoving() {
        this.state = State.still;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.speedX = 0;
        this.speedY = 0;
    },

    moveFocus(currentHeight) {
        if (currentHeight > this.focusHeight) {
            this.moveDown(currentHeight - this.focusHeight);
        }
    },

    start () {

    },

    update (dt) {
        if (this.state === State.movingDown && this.speedY >= 0) {
            this.stopMoving();
            //this.gameCtl.focusMovingStop();
        }

        if (this.state === State.movingUp) {
            if (this.speedY <= 0) {
                this.stopMoving();
            } else {
                if (this.zoomSpeed >= 0) {
                    this.zoomSpeed = 0;
                    this.accelerationS = 0;
                }
                this.zoomSpeed += this.accelerationS / this.fps;
                this.node.scale += this.zoomSpeed / this.fps;
            }
        }
        this.speedX += this.accelerationX / this.fps;
        this.speedY += this.accelerationY / this.fps;

        //this.node.x += this.speedX / this.fps;
        //this.node.y += this.speedY / this.fps;
        this.currentY += this.speedY / this.fps;
        let children = this.node.getChildren();
        for (let i = 0; i < children.length; ++i) {
            children[i].x += this.speedX / this.fps;
            children[i].y += this.speedY / this.fps;
        }
    },
});
