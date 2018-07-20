let Canvas = require('Canvas');
cc.Class({
    extends: cc.Component,

    properties: {
        cnt: 0,
        gap: 0,
        maxHeight: 300,
        existedNode: [],
        targetHeight:800,
        score:0,
        starNum:3,
        starPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad () {
        this.physicsManager = cc.director.getPhysicsManager();
        this.physicsManager.enabled = true;
        cc.director.enabledDrawBoundingBox = true;

        this.canvas = new Canvas();
        cc.director.getScene().addChild(this.canvas);
        this.canvas.setTargetHeight(this.targetHeight);

        this.table = this.createTable();
        this.table._active = false;

        this.currentNode = this.createNewShape();        
        this.addTouchEvent();

        this.createNewStar();
    },

    addTouchEvent() {

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            console.log('TOUCH MOVE');
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
        console.log('create table');
        let Table = require('Table');
        let table = new Table();
        table.init();
        this.canvas.addChild(table);
        return table;
    },

    createNewShape() {
        let Shapes = require('Shape');
        let index = Math.floor(Math.random() * 20);
        let node = new Shapes();
        node.init(6);

        this.canvas.addChild(node);
        node.setPosition(this.canvas.convertToNodeSpace(cc.p(480, 600)));
        this.existedNode.push(node);
        return node;
    },

    createNewStar() {
        for (let i = 0; i < this.starNum; ++i) {
            let star = cc.instantiate(this.starPrefab);
            this.canvas.addChild(star);
            star.setPosition(this.getNewStarPosition());
            star._position.x += 10;
            star.getComponent('Star').gameCtl = this;
            star._active = false;
            this.star = star;
        }
    },

    getNewStarPosition() {
        let randX = Math.random() * 200 + 400;
        let randY = Math.random() * 600 + 180;
        return  cc.p(randX, randY);
    },

    getCurrentHeight() {
        let rect = this.currentNode.getBoundingBoxToWorld();
        return rect.y + rect.height;
    },

    updateHeight() {
        if (this.currentNode.getCurrentHeight() > this.canvas.maxHeightToWorld()) {
            this.maxHeight = this.currentNode.getCurrentHeight();
            if (this.maxHeight - this.canvas.getPosition().y > this.targetHeight) {
                this.gameStop();
            }
            this.canvas.updateMaxHeight(this.maxHeight);
            this.canvas.move(-50);
        }
    },

    debugDrawBoundingBox(rect) {
        console.log(rect);
        let node = new cc.Node();
        let ctx = node.addComponent(cc.Graphics);
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.fillColor = cc.Color.RED;
        ctx.fill();
    },

    start() {

    },

    gameStop() {
        this.canvas.move(200);
    },

    update: function(dt) {
        if (this.currentNode._active === false) {
            this.updateHeight();
            //this.existedNode.push(this.currentNode);
            this.currentNode = this.createNewShape();
        } else {
            this.currentNode.update(dt);
            if (this.currentNode.getCurrentHeight() <= 0) {
                this.gameStop();
            }
        }

        this.canvas.update(dt);

    }
});
