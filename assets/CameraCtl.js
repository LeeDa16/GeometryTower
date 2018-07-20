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
        fps: 60,
        zoomSpeed: 0,
        focusHeight: 300,
        finalHeight:600,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Event.TOUCH_MOVE, (event) => {
            console.log('canvas touch move event');
        });
        this.node.on(cc.Event.TOUCH_END, (event) => {
            console.log('canvas touch end event');
        });

        console.log('load canvas controller');
        this.originalY = this.node.getPosition().y;
        //this.accelerationY = -10;

        //this.body = this.node.addComponent(cc.RigidBody);
        //this.body.gravityScale = 0;
        //this.body.type = cc.RigidBodyType.Static;

        //this.ctx = this.node.addComponent(cc.Graphics);

        this.state = State.still;

        //this.moveDown();
    },

    moveDown(deltaY) {
        console.log('move down');
        this.state = State.movingDown;
        this.accelerationY = 50;

        this.speedY = -Math.sqrt(2 * Math.abs(this.accelerationY * deltaY));
    },

    moveUp() {
        console.log('move up');
        this.state = State.movingUp;
        this.accelerationY = -10;
        this.speedY = Math.sqrt(2 * Math.abs(this.accelerationY * (this.node.position.y - this.originalY)));
        
        let deltaScale = 1 - this.finalHeight / this.targetHeight;
        //this.zoomSpeed = -Math.sqrt(2 * Math.abs(this.node.position.y / this.accelerationY));
        this.zoomSpeed = -0.1;
    },

    stopMoving() {
        this.state = State.still;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.speedX = 0;
        this.speedY = 0;
    },

    changeFocus(currentHeight) {
        if (currentHeight > this.focusHeight) {
            this.moveDown(currentHeight - this.focusHeight);
        }
    },

    start () {

    },

    update (dt) {
        if (this.state === State.movingDown && this.speedY >= 0) {
            this.stopMoving();
        }

        if (this.state === State.movingUp) {
            if (this.speedY <= 0) {
                this.stopMoving();
            } else {
                this.node.scale += this.zoomSpeed / this.fps;
            }
        }
        this.speedX += this.accelerationX / this.fps;
        this.speedY += this.accelerationY / this.fps;

        this.node.x += this.speedX / this.fps;
        this.node.y += this.speedY / this.fps;
        let children = this.node.getChildren();
        for (let i = 0; i < children.length; ++i) {
            children[i].x += this.speedX / this.fps;
            children[i].y += this.speedY / this.fps;
        }
    },
});
