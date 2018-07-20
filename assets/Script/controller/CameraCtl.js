const State = {
    still: 0,
    movingDown: 1,
    movingUp: 2
};

cc.Class({
    extends: cc.Component,

    properties: {
        deltaY: 0,
        maxHeight: 300,
        targetHeight: 800,
        state: 0,
        speedX: 0,
        speedY: 0,
        accelerationX: 0,
        accelerationY: 0,
        fps: 60,
        zoomScaleSpeed: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Event.TOUCH_MOVE, (event) => {
            console.log('canvas touch move event');
        });
        this.node.on(cc.Event.TOUCH_END, (event) => {
            console.log('canvas touch end event');
        });

        //this.body = this.node.addComponent(cc.RigidBody);
        //this.body.gravityScale = 0;
        //this.body.type = cc.RigidBodyType.Static;

        this.ctx = this.node.addComponent(cc.Graphics);

        this.state = State.still;
    },

    moveDown() {
        this.state = State.movingDown;
        this.accelerationY = 10;

        this.speedY = -Math.sqrt(2 * Math.abs(this.accelerationY) * this.deltaY);
    },

    moveUp() {
        this.state = State.movingUp;
        this.accelerationY = -10;
        this.speedY = Math.sqrt(2 * Math.abs(this.accelerationY * this.node.position.y));

        //TODO:
        //this.zoomScaleSpeed = 
    },

    stopMoving() {
        this.state = State.still;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.speedX = 0;
        this.speedY = 0;
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
                this.node.scale += this.zoomScaleSpeed;
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
