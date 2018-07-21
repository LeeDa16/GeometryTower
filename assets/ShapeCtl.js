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

module.exports.points = points;

let State = {
    ready: 0,
    released: 1,
    stop: 2,
};

module.exports.ShapeCtl = cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.state = State.ready;
        this.eventRemoved = false;

        this.sprite = this.node.addComponent(cc.Sprite);
        
        this.body = this.node.addComponent(cc.RigidBody);
        this.body.gravityScale = 0;
        this.body.angularDamping = 1;
        
        this.collider = this.node.addComponent(cc.PhysicsPolygonCollider);
        this.collider.restriction = 0;
        this.collider.friction = 1;
        
        this.addTouchEvent();

        this.node.setPosition(cc.p(0, 200));
    },

    setShape(index) {
        let i = index + 1;
        cc.loader.loadRes('shapesheet', cc.SpriteAtlas, function(err, atlas) {
            let frame = atlas.getSpriteFrame('shape_'+i);
            this.sprite.spriteFrame = frame;
        }.bind(this));

        this.collider.points = points[index].map((elem) => (cc.p(elem[0], elem[1])));
        this.collider.apply();
    },

    addTouchEvent() {
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.addTouchMoveEvent.bind(this), this.node.parent);
        this.node.parent.once(cc.Node.EventType.TOUCH_END, this.addTouchEndEvent.bind(this), this.node.parent);
    },

    removeTouchEvent() {
        this.eventRemoved = true;
    },

    addTouchMoveEvent(event) {
    	if (!this.eventRemoved) {
     	   	let touchPoint = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        	this.node.x = touchPoint.x;
    	}
    },

    addTouchEndEvent(event) {
        this.body.gravityScale = 1;
        this.body.linearVelocity = cc.p(0, -100);
        this.state = State.released;
    },

    isStopped() {
        return this.body.linearVelocity.x === 0 && this.body.linearVelocity.y === 0;
    },

    getHeightToWorld() {
        let rect = this.node.getBoundingBoxToWorld();
        return rect.y + rect.height;
    },

    convertCoordinate(point) {
    	let len = Math.sqrt(point.x * point.x + point.y * point.y);
    	let atan;
    	if (point.x != 0) {
    		atan = Math.atan(point.y / point.x);
    	} else {
    		atan = Math.PI / 2;
    	}

    	if (point.x < 0) {
    		atan += Math.PI;
    	}

    	let rotation = atan - this.node.rotation * Math.PI / 180;
    	//let x = len * Math.cos(rotation) + this.node.x;
    	let y = len * Math.sin(rotation) + this.node.y;
    	return y;
    },

    getHeight() {
    	let pointsY = this.collider.points.map(this.convertCoordinate.bind(this));
    	let rect = this.node.getBoundingBox();
    	console.log(pointsY, rect);
    	return Math.max.apply(null, pointsY);
    	//return rect.y + rect.height;
    },

    update (dt) {
        if (this.state === State.released && this.eventRemoved === false) {
            this.removeTouchEvent();
        }

        if (this.state === State.released && this.isStopped()) {
            this.body.type = cc.RigidBodyType.Static;
            this.state = State.stop;
            this.gameCtl.nextTurn();
        }

        if (!this.isStopped() && this.getHeightToWorld() < this.gameCtl.bottom) {
        	this.gameCtl.gameStop();
        }
    },

    // update (dt) {},
});