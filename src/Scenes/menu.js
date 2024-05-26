class menu extends Phaser.Scene {
    constructor() {
        super("menuScene");

        this.my = { sprite: {} };
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() { }

    create() {

        this.my.sprite.start = this.add.text(game.config.width / 2, game.config.height / 2, "Vivi", { fontSize: '76px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        this.my.sprite.start.setOrigin(0.5, 0.5);
        this.time.delayedCall(1000, this.nextScene, [], this);

    }

    nextScene() {
        this.scene.start("platformerScene");
    }

    update() {

    }
}