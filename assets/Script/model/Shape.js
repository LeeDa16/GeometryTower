let points = [[[-61.5, 0], [30, 0], [30, -28.5], [61.5, -28.5], [61.5, 28.5], [-61.5, 28.5]], 
[[-39, -12], [-12, -12], [-12, -39], [12, -39], [12, -12], [39, -12], [39, 12], [12, 12], [12, 39], [-12, 39], [-12, 12], [-39, 12]], 
[[-15, -39], [15, -39], [15, 39], [-15, 39]], 
[[-61.5, -28.5], [61.5, -28.5], [61.5, 28.5], [30, 28.5], [30, 0], [-61.5, 0]], 
[[-39, 14], [-14, 14], [-14, -39], [14, -39], [14, 14], [39, 14], [39, 39], [-39, 39]], 
[[-34, 12.5], [-12.5, 12.5], [-12.5, -12.5], [12.5, -12.5], [12.5, -34], [34, -34], [34, 10], [10, 10], [10, 34], [-34, 34]], 
[[-21.5, -21.5], [21.5, -21.5], [21.5, 21.5], [-21.5, 21.5]], 
[[-40.5, -28.5], [-10, -28.5], [-10, 0], [40.5, 0], [40.5, 28.5], [-40.5, 28.5]], 
[[-34, -34], [34, -34], [34, 34], [-34, 34]], 
[[-36, -36], [36, -36], [36, 36]], 
[[-28.5, -40.5], [28.5, -40.5], [28.5, -10], [0, -10], [0, 40.5], [-28.5, 40.5]], 
[[-34, 2], [-10, 2], [-10, -24.5], [34, -24.5], [34, -2], [12, -2], [12, 24.5], [-34, 24.5]], 
[[-61, -15], [61, -15], [61, 15], [-61, 15]], 
[[-37, -24.5], [37, -24.5], [0, 24.5]], 
[[-18, 30.5], [-21, 27.5], [-26, 27.5], [-30, 23], [-30, 10], [-24, 2], [-18, -2], [-11, -3], [-7, -6.5], [-5, -6.5], [-5, -11.5], [-9, -11.5], [-12, -15.5], [-16, -16.5], [-20, -21], [-20, -26], [-16, -30.5], 
[16, -30.5], [20, -26], [20, -21], [16, -16.5], [12, -15.5], [9, -11.5], [5, -11.5], [5, -6.5], [7, -6.5], [11, -3], [18, -2], [24, 2], [30, 10], [30, 23], [26, 27.5], [21, 27.5], [18, 30.5]], 
[[-13, 24], [-21, 6], [-38.5, 6], [-38.5, -17], [-31, -17], [-29.5, -21], [-26.5, -24], [-16, -24], [-13, -21], [-10.5, -17], [11.5, -17], [13, -21], [16, -24], [26.5, -24], [29.5, -21], [32, -17], [38.5, -17], 
[38.5, 6], [27.5, 6], [22, 24]], 
[[0, 38], [-11.5, 27.5], [-17.5, 15.5], [-17.5, -7], [-22.5, -10], [-22.5, -31], [-18.5, -38], [-11.5, -33], [-9.5, -29], [-3.5, -32], [-3.5, -38], 
[3.5, -38], [3.5, -32], [9.5, -29], [11.5, -33], [18.5, -38], [22.5, -31], [22.5, -10], [17.5, -7], [17.5, 15.5], [11.5, 27.5]], 
[[2.5, 34], [2, 13.5], [-24.5, 13.5], [-24.5, -34], [-1.5, -34], [-1.5, -10], [24.5, -10], [24.5, 34]], 
[[-45, 15], [-45, -15], [45, -15], [45, 15]], 
[[-61, 15], [-61, -15], [61, -15], [61, 15]]];
cc.Class({
    extends: cc.Node,

    properties: {
        isStatic:[false, false, false],
        state:0,
        cnt: 0,
        _active: true,
    },

    ctor () {
        this.sprite = this.addComponent(cc.Sprite);
        this.body = this.addComponent(cc.RigidBody);
        this.collider = this.addComponent(cc.PhysicsPolygonCollider);
    },

    init(index) {
        this.collider.restriction = 0;
        this.collider.friction = 1;
        this.body.gravityScale = 0;
        this.body.angularDamping = 1;

        let i = index + 1;
        cc.loader.loadRes('shapes/shapesheet', cc.SpriteAtlas, function(err, atlas) {
            let frame = atlas.getSpriteFrame('shape_'+i);
            this.sprite.spriteFrame = frame;
        }.bind(this));

        this.collider.points = points[index].map((elem)=>(cc.p(elem[0], elem[1])));
        this.collider.apply();

        this.addTouchEvent();
    },

    addTouchMoveEvent(event) {
        let touchPoint = this.parent.convertToNodeSpace(event.getLocation());
        console.log('touch move');
        this.x = touchPoint.x;
        console.log('touch move');
    },

    addTouchEndEvent(event) {
        this.body.gravityScale = 1;
        this.body.linearVelocity = new cc.Vec2(0, -100);
        this.state = 1;
        console.log('touch end');
        //this.removeTouchEvent();
    },

    addTouchEvent() {
        this.on(cc.Node.EventType.TOUCH_MOVE, this.addTouchMoveEvent, this);
        this.on(cc.Node.EventType.TOUCH_END, this.addTouchEndEvent, this);
            
    },

    removeTouchEvent() {
        console.log('remove touch event');
        this.off(cc.Node.EventType.TOUCH_MOVE, this.addTouchMoveEvent, this);
        this.off(cc.Node.EventType.TOUCH_END, this.addTouchEndEvent, this);
    },

    isReleased() {
        return this.state === 1;
    },

    movingStop() {
        return this.isStatic[0] === true && this.isStatic[1] === true && this.isStatic[2] === true;
    },

    getCurrentHeight() {
        let rect = this.getBoundingBoxToWorld();
        return rect.y + rect.height;
    },
    

    start() {

    },

    update(dt) {
        if (this.isReleased()) {
            this.removeTouchEvent();

            if (this.movingStop()) {
                this.body.type = cc.RigidBodyType.Static;
                this._active = false;
                this.state = 2;
                this.cnt = 0;
            } else {
                if (this.body.linearVelocity.x === 0 && this.body.linearVelocity.y === 0) {
                    this.isStatic[this.cnt++] = true;
                }
            }
        }
        //console.log('shape update');
    }
});
