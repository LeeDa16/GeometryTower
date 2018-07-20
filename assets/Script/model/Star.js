let points = [];
cc.Class({
    extends: cc.Component,

    properties: {

    },   

    onLoad() {
    	this.node.body = this.node.getComponent(cc.RigidBody);
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.state !== 1) {
            this.gameCtl.score++;
            this.node.destroy();
        }
    }
});
