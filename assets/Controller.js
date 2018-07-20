let CameraCtl = require('CameraCtl');
let ShapeCtl = require('ShapeCtl');
let NextShapeCtl = require('NextShapeCtl');
cc.Class({
    extends: cc.Component,

    properties: {
        bottom: 0,
        targetHeight:600,
    },


    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        this.camera = this.node.getChildByName('Camera');
        this.cameraCtl = this.camera.addComponent(CameraCtl);
        
        this.shapeNode = new cc.Node();
        this.node.addChild(this.shapeNode);
        
        this.shapeCtl = this.shapeNode.addComponent(ShapeCtl);
        this.shapeCtl.setShape(1);
        this.shapeCtl.gameCtl = this;

        this.nextShapeIndex = 2;
        this.nextShape = this.node.getChildByName('NextShape');
        this.nextShapeCtl = this.nextShape.getComponent(NextShapeCtl);
        this.nextShapeCtl.changeSpriteFrame(this.nextShapeIndex);
    },

    nextTurn() {
        let position = this.node.convertToWorldSpaceAR(this.shapeNode.getPosition());
        this.shapeNode.removeFromParent();
        this.camera.addChild(this.shapeNode);
        //this.shapeNode.y -= this.camera.y;
        this.shapeNode.setPosition(this.camera.convertToNodeSpaceAR(position));
        
        if (this.shapeCtl.getHeight() > this.targetHeight) {
            this.pass();
        }

        this.cameraCtl.changeFocus(this.shapeCtl.getHeightToWorld());
        //TODO:
        let index = 0;
        this.createNewShape(this.nextShapeIndex);
        this.nextShapeIndex = this.getNextShape();
        this.nextShapeCtl.changeSpriteFrame(this.nextShapeIndex);
    },

    getNextShape() {
        //TODO:
        return 3;
    },

    createNewShape(index) {
        this.shapeNode = new cc.Node();
        this.node.addChild(this.shapeNode);
        this.shapeCtl = this.shapeNode.addComponent(ShapeCtl);
        this.shapeCtl.setShape(index);
        this.shapeCtl.gameCtl = this;
    },

    gameStop() {
        console.log('game stop');
        this.shapeNode.destroy();
        //this.camera.y -= 50;
        this.cameraCtl.moveUp();
    },

    pass(){},

    start () {

    },

    update (dt) {
    },
});
