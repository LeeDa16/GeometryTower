cc.Class({
    extends: cc.Component,

    properties: {
        cnt: 0,
        gap: 0,
        maxHeight: 0,
        existedNode: [],
    },

    onLoad () {
        this.physicsManager = cc.director.getPhysicsManager();
        this.physicsManager.enabled = true;
        cc.director.enabledDrawBoundingBox = true;
        this.addTouchEvent();
        
        this.existedNode.push(this.createTable());
        this.camCtn = this.addCamera();
    },

    addTouchEvent() {
    	this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
    		console.log('TOUCH move');
    	});
    	this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
    		console.log('TOUCH end');
    	});
    },

    removeTouchEvent() {
    	console.log('remove TOUCH event');
    	this.node.off(cc.Node.EventType.TOUCH_MOVE, (event) => {
    		console.log('TOUCH move');
    	});
    	this.node.off(cc.Node.EventType.TOUCH_END, (event) => {
    		console.log('TOUCH end');
    	});
    },

    createTable() {
    	let Table = require('Table');
    	let table = new Table();
    	cc.director.getScene().addChild(table);
    	//let rect = table.getBoundingBoxToWorld();
    	//console.log(table.collider);
    	//this.debugDrawBoundingBox(rect);
    	return table;
    },

    createNewShape() {
    	let Shapes = require('Shape');
        let index = Math.floor(Math.random() * 20);
        let node = new Shapes();
        node.init(this, index);
        node.setPosition(480,600);
        cc.director.getScene().addChild(node);
        //console.log(node.collider);
        node.addTouchEvent();
        return node;
    },

    getCurrentHeight(node) {
    	let rect = node.getBoundingBoxToWorld();
    	if (rect.y + rect.height + this.gap > this.maxHeight) {
    		this.maxHeight = rect.y + rect.height + this.gap
    	}
    },

    debugDrawBoundingBox(rect) {
    	console.log(rect);
    	let node = new cc.Node();
    	let ctx = node.addComponent(cc.Graphics);
    	ctx.rect(rect.x, rect.y, rect.width, rect.height);
    	ctx.fillColor = cc.Color.RED;
    	ctx.fill();
    	cc.director.getScene().addChild(node);
    },

    addCamera() {
        let camNode = new cc.Node('CamNode');
        let camera = camNode.addComponent(cc.Camera);
        camera.addTarget(this.node.getChildByName('bgmenu-sheet0'));

        let camCtn = new cc.Node();
        camCtn.addChild(camNode);

        let CamCtl = require('CameraCtl');
        //let camCtl = new CamCtl();
        //camCtl.camera = camNode;
        //camCtn.addComponent(camCtl);
        let camCtl = camCtn.addComponent(CamCtl);
        camCtl.camera = camNode;
        cc.director.getScene().addChild(camCtn);
        camCtn.active = false;
        return camCtn;
    },

    start() {

    },

    update: function(dt) {
    	if (this.currentNode === undefined) {
    		this.currentNode = this.createNewShape();
    		this.existedNode.push(this.currentNode);
            //let CamCtl = require('CameraCtl');
            this.camCtn.getComponent(require('CameraCtl')).target = this.currentNode;
            this.camCtn.getChildByName('CamNode').getComponent(cc.Camera).addTarget(this.currentNode);
            this.camCtn.active = true;
    	} else {
    		if (this.currentNode.state === 1) {
    			//console.log(this.currentNode.position);
    			this.currentNode.removeTouchEvent();
    			if (this.currentNode.isStatic[0] === true && this.currentNode.isStatic[1] === true && this.currentNode.isStatic[2] === true) {
    				this.currentNode.body.type = cc.RigidBodyType.Static;
    				this.getCurrentHeight(this.currentNode);
                    this.camCtn.active = false;
                    this.camCtn.getChildByName('CamNode').getComponent(cc.Camera).removeTarget(this.currentNode);
    				this.currentNode = undefined;
    				this.cnt = 0;
    			} else {
    				if (this.currentNode.body.linearVelocity.x === 0 && this.currentNode.body.linearVelocity.y === 0)
    					this.currentNode.isStatic[this.cnt++] = true;
    			}
    		}
    	}
    }
});
