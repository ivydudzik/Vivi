class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "monochrome_tilemap_transparent_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("1bit_platformer-level-1", "1bit_platformer-level-1.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "monochrome_tilemap_transparent_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'ory_fly',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 341 }, { frame: 342 }, { frame: 343 }
            ],
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'yelly_fly',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 321 }, { frame: 322 }, { frame: 323 }
            ],
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'blue_walk',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 241 }, { frame: 242 }, { frame: 243 }
            ],
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'green_walk',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 261 }, { frame: 262 }, { frame: 263 }
            ],
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'red_walk',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 281 }, { frame: 282 }, { frame: 283 }
            ],
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'purple_walk',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 301 }, { frame: 302 }, { frame: 303 }
            ],
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'blue_idle',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 240 }
            ],
            repeat: -1
        });
        this.anims.create({
            key: 'green_idle',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 260 }
            ],
            repeat: -1
        });
        this.anims.create({
            key: 'red_idle',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 280 }
            ],
            repeat: -1
        });
        this.anims.create({
            key: 'purple_idle',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 300 }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'blue_jump',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 245 }
            ],
        });
        this.anims.create({
            key: 'green_jump',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 265 }
            ],
        });
        this.anims.create({
            key: 'red_jump',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 285 }
            ],
        });
        this.anims.create({
            key: 'purple_jump',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 305 }
            ],
        });

        // ...and pass to the next Scene
        this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}