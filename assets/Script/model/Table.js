cc.Class({
    extends: cc.Node,

    properties: {
    },

    ctor() {
        this.sprite = this.addComponent(cc.Sprite);
        this.body = this.addComponent(cc.RigidBody);
        this.collider = this.addComponent(cc.PhysicsBoxCollider);
    },

    init() {
        this.setPosition(480, 80);

        cc.loader.loadRes('/tubo_start-sheet0', cc.SpriteFrame, function(err, spriteFrame) {
            this.sprite.spriteFrame = spriteFrame;
        }.bind(this));

        this.body.type = cc.RigidBodyType.Static;

        this.collider.restriction = 0.2;
        this.collider.friction = 1;
        this.collider.size = cc.size(189, 160);
        this.collider.apply();
    },
});
