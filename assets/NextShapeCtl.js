cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.sprite = this.node.getComponent(cc.Sprite);
    },

    changeSpriteFrame(index) {
        if (this.sprite === undefined) 
            this.sprite = this.node.getComponent(cc.Sprite);
        let i = index + 1;
        cc.loader.loadRes('nextshapesheet', cc.SpriteAtlas, (err, atlas) => {
            this.sprite.spriteFrame = atlas.getSpriteFrame('nextshape_' + i);
        });
    },

    start () {

    },

    // update (dt) {},
});
