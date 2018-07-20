cc.Class({
    extends: cc.Node,

    properties: {
        deltaY: 0,
        maxHeight: 300,
        targetHeight:600,
        _isStopped:[false, false, false],
    },

    ctor () {
        this.on(cc.Event.TOUCH_MOVE, (event) => {
            console.log('TOUCH move')
        });
        this.on(cc.Event.TOUCH_END, (event) => {});

        this.body = this.addComponent(cc.RigidBody);
        this.body.gravityScale = 0;
        this.body.type = cc.RigidBodyType.Static;

        this.ctx = this.addComponent(cc.Graphics);
    },

    move(speedY) {

        this.prePosY = this.position.y;
        this.body.type = cc.RigidBodyType.Kinematic;
        this.body.linearVelocity = cc.p(0, speedY);
        let children = this.getChildren();
        for (let i = 0; i < children.length; ++i) {
            if (children[i]._active === false) {
                children[i].body.type = cc.RigidBodyType.Kinematic;
                children[i].body.linearVelocity = cc.p(0, speedY);
            }
        }
    },

    stopMove() {
        let children = this.getChildren();
        for (let i = children.length - 1; i >= 0; --i) {
            if (children[i]._active === false) {
                children[i].body.linearVelocity = cc.p(0, 0);
                children[i].body.type = cc.RigidBodyType.Static;
            }
        }
        this.body.linearVelocity = cc.p(0, 0);
        this.body.type = cc.RigidBodyType.Static;
    },

    start () {

    },

    maxHeightToWorld() {
        return this.maxHeight + this.position.y;
    },

    updateMaxHeight(maxHeightToWorld) {
        this.deltaY = maxHeightToWorld - this.maxHeight - this.position.y;
        this.maxHeight = maxHeightToWorld - this.position.y;
    },

    setTargetHeight(targetHeight) {
        this.targetHeight = targetHeight;
        this.drawDash(0, targetHeight, cc.view.getFrameSize().width, targetHeight);
        //this.ctx.rect(0, 0, 200, 200);
        //this.ctx.fillColor  = cc.Color.RED;
        //this.ctx.fill();
    },

    drawDash(beginX, beginY, endX, endY) {
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = cc.Graphics.LineCap.ROUND;
        this.ctx.strokeColor = cc.Color.WHITE;
        let length = Math.sqrt((beginX - endX) * (beginX - endX) + (beginY - endY) * (beginY - endY));
        for (let i = 0; i < length; i += 20) {
            this.ctx.moveTo(i * (endX - beginX) / length + beginX, i * (endY - beginY) / length + beginY);
            this.ctx.lineTo((i + 10) * (endX - beginX) / length + beginX, (i + 10) * (endY - beginY) / length + beginY);
        }
        this.ctx.stroke();
    },

    isStopped() {
        return this._isStopped[0] === true && this._isStopped[1] === true && this._isStopped[2] === true;
    },

    update (dt) {
        if (this.body.type === cc.RigidBodyType.Kinematic){
            if (this.body.linearVelocity.y < 0) {
                if (this.prePosY - this.position.y > this.deltaY) {
                    this.stopMove();
                }
            } else {
                if (this.position.y >= 0) {
                    this.stopMove();
                }
            }
        }
    },
});
