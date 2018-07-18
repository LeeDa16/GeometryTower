// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Node,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    ctor() {
        this.setPosition(480, 80);

        this.sprite = this.addComponent(cc.Sprite);
        cc.loader.loadRes('./tubo_start-sheet0', cc.SpriteFrame, function(err, spriteFrame) {
            this.sprite.spriteFrame = spriteFrame;
        }.bind(this));

        this.body = this.addComponent(cc.RigidBody);
        this.body.type = cc.RigidBodyType.Static;

        this.collider = this.addComponent(cc.PhysicsBoxCollider);
        this.collider.restriction = 0.2;
        this.collider.friction = 1;
        this.collider.size = cc.size(189, 160);
        this.collider.apply();
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},
});
