let CameraCtl = require('CameraCtl');
let ShapeCtl = require('ShapeCtl');
let NextShapeCtl = require('NextShapeCtl');
let CLineCtl = require('ContourLineCtl');
let ScoreLineCtl = require('ScoreLineCtl');
let ScoreCtl = require('ScoreCtl');

cc.Class({
    extends: cc.Component,

    properties: {
        bottom: 0,
        targetHeight:600,
        bonusLine: {
            default: [],
            type: Array,
        },
        score: 0,
    },


    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        this.screenSize = cc.view.getVisibleSize();

        this.camera = this.node.getChildByName('Camera');
        this.cameraCtl = this.camera.addComponent(CameraCtl);
        this.cameraCtl.gameCtl = this;
        
        this.shapeNode = new cc.Node();
        this.node.addChild(this.shapeNode);
        
        this.shapeCtl = this.shapeNode.addComponent(ShapeCtl);
        this.shapeCtl.setShape(1);
        this.shapeCtl.gameCtl = this;

        this.nextShapeIndex = 2;
        this.nextShape = this.node.getChildByName('NextShape');
        this.nextShapeCtl = this.nextShape.getComponent(NextShapeCtl);
        this.nextShapeCtl.changeSpriteFrame(this.nextShapeIndex);

        this.bonusLine.push(400);
        this.bonusLine.push(500);
        this.bonusLine.push(600);

        /*
        for (let i = 0; i < this.bonusLine.length; ++i) {
            let bLine = new cc.Node('bonusline_' + i);
            this.camera.addChild(bLine);
            let lineCtl = bLine.addComponent(CLineCtl);
            let beginPoint = this.camera.convertToNodeSpaceAR(cc.p(0, this.bonusLine[i]));
            let endPoint = this.camera.convertToNodeSpaceAR(cc.p(this.screenSize.width, this.bonusLine[i]));
            lineCtl.drawDashLine(beginPoint, endPoint);
        }
        */
        this.scoreLine = this.camera.getChildByName('ScoreLine');
        this.scoreLineCtl = this.scoreLine.getComponent(ScoreLineCtl);
        this.scoreLine.opacity = 0;

        this.scoreText = this.camera.getChildByName('Score');
        this.scoreCtl = this.scoreText.getComponent(ScoreCtl);
        this.scoreCtl.gameCtl = this;
    },

    nextTurn() {
        let position = this.node.convertToWorldSpaceAR(this.shapeNode.getPosition());
        this.shapeNode.removeFromParent();
        this.camera.addChild(this.shapeNode);
        this.shapeNode.setPosition(this.camera.convertToNodeSpaceAR(position));
        
        if (this.shapeCtl.getHeight() > this.targetHeight) {
            this.pass();
        }

        this.cameraCtl.moveFocus(this.shapeCtl.getHeightToWorld());
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

    focusMovingStop() {
        console.log(this.scoreLine.getPosition());
        this.scoreLineCtl.moveUp(this.cameraCtl.focusHeight - this.scoreLine.y);
        this.scoreCtl.moveUp(this.cameraCtl.focusHeight - this.scoreText.y);
    },

    gameStop() {
        console.log('game stop');
        this.shapeNode.destroy();
        this.scoreText.destroy();
        //this.camera.y -= 50;
        this.cameraCtl.moveUp();
    },

    pass(){},

    start () {

    },

    update (dt) {
    },
});
