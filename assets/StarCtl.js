cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.node.body = this.node.getComponent(cc.RigidBody);
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        let otherNode = otherCollider.node;
        if (otherNode.name === 'Shape' && otherNode.getComponent(require('ShapeCtl').ShapeCtl).state === 1) {
            this.gameCtl.addStarScore();
            this.node.destroy();
        }
    },  
});
