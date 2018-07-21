let CameraCtl = require('CameraCtl');
let ShapeCtl = require('ShapeCtl').ShapeCtl;
let NextShapeCtl = require('NextShapeCtl');
let ScoreLineCtl = require('ScoreLineCtl');
let ScoreCtl = require('ScoreCtl');
let BonusLineCtl = require('BonusLineCtl');

cc.Class({
    extends: cc.Component,

    properties: {
        bottom: 0,
        targetHeight:2000,
        bonusLine: {
            default: [],
            type: Array,
        },
        score: 0,
        actualHeight: 0,
        visibleHeight: 0,
        focusHeight: 300,
    },


    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        this.screenSize = cc.view.getVisibleSize();

        this.camera = this.node.getChildByName('Camera');
        this.cameraCtl = this.camera.addComponent(CameraCtl);
        this.cameraCtl.gameCtl = this;

        this.base = this.camera.getChildByName('Base');
        
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
        this.bonusLine.push(800);
        this.bonusLine.push(1200);

        for (let i = 0; i < this.bonusLine.length; ++i) {
            let bLine = new cc.Node('bonusline_' + i);
            this.camera.addChild(bLine);
            let bLineCtl = bLine.addComponent(BonusLineCtl);
            let beginPoint = this.camera.convertToNodeSpaceAR(cc.p(0, this.bonusLine[i] + this.base.y));
            let endPoint = this.camera.convertToNodeSpaceAR(cc.p(this.screenSize.width, this.bonusLine[i] + this.base.y));
            bLineCtl.drawDashLine(beginPoint, endPoint);
        }
        this.currentBonus = 0;

        this.scoreLine = this.camera.getChildByName('ScoreLine');
        this.scoreLineCtl = this.scoreLine.getComponent(ScoreLineCtl);
        this.scoreLine.opacity = 0;

        this.scoreText = this.camera.getChildByName('Score');
        this.scoreCtl = this.scoreText.getComponent(ScoreCtl);
        this.scoreCtl.gameCtl = this;

        this.visibleHeight = this.base.height;
    },

    nextTurn() {
        console.log('base.y:', this.base.y);
        console.log('rotation:', this.shapeNode.rotation);

        let position = this.node.convertToWorldSpaceAR(this.shapeNode.getPosition());
        this.shapeNode.removeFromParent();
        this.camera.addChild(this.shapeNode);
        this.shapeNode.setPosition(this.camera.convertToNodeSpaceAR(position));
        
        let newHeight = this.shapeCtl.getHeight() - this.base.y;
        if (newHeight < this.actualHeight) {
            let index = 0;
            this.createNewShape(this.nextShapeIndex);
            this.nextShapeIndex = this.getNextShape();
            this.nextShapeCtl.changeSpriteFrame(this.nextShapeIndex);
            return;
        }
        this.actualHeight = newHeight;
        //TODO: 对bonus、finish等条件进行判断
        if (this.currentBonus < this.bonusLine.length && this.actualHeight > this.bonusLine[this.currentBonus]) {
            this.camera.getChildByName('bonusline_' + this.currentBonus).destroy();
            this.currentBonus++;
            this.createBonusShape();
        }

        this.visibleHeight = this.shapeCtl.getHeight();
        if (this.visibleHeight > this.focusHeight) {
            this.cameraCtl.moveFocus(this.visibleHeight);
            this.visibleHeight = this.focusHeight;
        }

        this.scoreLineCtl.moveUp(this.actualHeight - this.score);
        this.scoreCtl.moveUp(this.actualHeight - this.score);
        this.score = this.actualHeight;

        this.createNewShape(this.nextShapeIndex);
        this.nextShapeIndex = this.getNextShape();
        this.nextShapeCtl.changeSpriteFrame(this.nextShapeIndex);
    },

    getNextShape() {
        //TODO:
        return 1;
    },

    createNewShape(index) {
        this.shapeNode = new cc.Node();
        this.node.addChild(this.shapeNode);
        this.shapeCtl = this.shapeNode.addComponent(ShapeCtl);
        this.shapeCtl.setShape(index);
        this.shapeCtl.gameCtl = this;
    },

    createBonusShape() {
        let bonusShape = new cc.Node();
        this.camera.addChild(bonusShape);
        //bonusShape.setAnchorPoint(cc.p(0.5, 0));

        let sprite = bonusShape.addComponent(cc.Sprite);
        cc.loader.loadRes('shapesheet', cc.SpriteAtlas, (err, atlas) => {
            sprite.spriteFrame = atlas.getSpriteFrame('shape_' + 19);
            sprite.node.y += sprite.spriteFrame._originalSize.height / 2;
        });

        let body = bonusShape.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        let collider = bonusShape.addComponent(cc.PhysicsPolygonCollider);
        let points = require('ShapeCtl').points;
        collider.points = points[18].map((elem) => (cc.p(elem[0], elem[1])));
        collider.apply();

        let y = this.shapeCtl.getHeight();
        let rect = this.shapeNode.getBoundingBox();
        let x = rect.x + 0.5 * rect.width;
        bonusShape.setPosition(cc.p(x, y));
    },

    focusMovingStop() {
        this.scoreLineCtl.moveUp(this.cameraCtl.focusHeight - this.scoreLine.y);
        this.scoreCtl.moveUp(this.cameraCtl.focusHeight - this.scoreText.y);
    },

    gameStop() {
        this.shapeNode.destroy();
        this.scoreText.destroy();
        this.nextShape.destroy();
        //this.camera.y -= 50;
        this.cameraCtl.moveUp();
    },

    pass(){},

    start () {

    },

    update (dt) {
    },
});
