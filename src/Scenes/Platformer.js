class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.playerSettings = {
            "blue_": { GROUND_ACCELERATION: 200, AIR_ACCELERATION: 25, DRAG: 750, GRAVITY: 1250, JUMP_VELOCITY: -350, MAX_VELOCITY: 200 },
            "green_": { GROUND_ACCELERATION: 100, AIR_ACCELERATION: 300, DRAG: 300, GRAVITY: 400, JUMP_VELOCITY: -50, MAX_VELOCITY: 500 },
            "red_": { GROUND_ACCELERATION: 50, AIR_ACCELERATION: 50, DRAG: 750, GRAVITY: 2250, JUMP_VELOCITY: -600, MAX_VELOCITY: 400 },
            "purple_": { GROUND_ACCELERATION: 800, AIR_ACCELERATION: 25, DRAG: 750, GRAVITY: 1250, JUMP_VELOCITY: -250, MAX_VELOCITY: 600 }
        };
        // DRAG < GROUND_ACCELERATION = icy slide

        this.TURNING_MULTIPLIER = 2;

        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;

        this.isGrounded = false;


        // Slow-mo speed (higher is slower)
        this.SLOWMO_SPEED = 4;
        this.isSlowmo = false;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("1bit_platformer-level-1", 16, 16, 200, 40);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_monochrome_tilemap_packed", "tilemap_tiles");



        // Create Rope-n-Chains layer
        this.ropeLayer = this.map.createLayer("Rope-n-Chains", this.tileset, 0, 0);

        // Create Ground-n-Platforms layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // Create Roof layer
        this.roofLayer = this.map.createLayer("Roof", this.tileset, 0, 0);
        // Make it collidable
        this.roofLayer.setCollisionByProperty({
            collides: true
        });

        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 102
        });

        this.yellys = this.map.createFromObjects("Objects", {
            name: "yelly",
            key: "tilemap_sheet",
            frame: 320
        });

        this.orys = this.map.createFromObjects("Objects", {
            name: "ory",
            key: "tilemap_sheet",
            frame: 340
        });


        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.world.enable(this.yellys, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.orys, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);

        this.yellyGroup = this.add.group(this.yellys);
        this.orysGroup = this.add.group(this.orys);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 200, "tilemap_sheet");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.roofLayer);

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
        });

        // Handle collision detection with yelly enemies
        this.physics.add.overlap(my.sprite.player, this.yellyGroup, (obj1, obj2) => {
            // obj1.destroy(); // remove player on overlap
            console.log("You lose!");
            this.scene.restart();
        });

        // Handle collision detection with ory enemies
        this.physics.add.overlap(my.sprite.player, this.orysGroup, (obj1, obj2) => {
            // obj1.destroy(); // remove player on overlap
            console.log("You lose!");
            this.scene.restart();
        });


        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // Player Type Switcher
        this.input.keyboard.on('keydown-ONE', () => {
            this.colorState = "blue_";
        }, this);
        this.input.keyboard.on('keydown-TWO', () => {
            this.colorState = "green_";
        }, this);
        this.input.keyboard.on('keydown-THREE', () => {
            this.colorState = "red_";
        }, this);
        this.input.keyboard.on('keydown-FOUR', () => {
            this.colorState = "purple_";
        }, this);

        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.isSlowmo) {
                this.modulateTimeScale(1);
                this.isSlowmo = false;
            } else {
                this.modulateTimeScale(this.SLOWMO_SPEED);
                this.isSlowmo = true;
            }
        }, this);


        // movement vfx

        my.vfx.walking = this.add.particles(0, 5, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            random: true,
            scale: { start: 0.002, end: 0.01 },
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 300,
            lifespan: 250 / this.time.timeScale,
            // TODO: Try: gravityY: -400,
            gravityY: -100 * this.time.timeScale,
            alpha: { start: 1, end: 0.1 },
        });

        my.vfx.walking.stop();


        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        my.sprite.debug = this.add.sprite(30, this.map.heightInPixels, "tilemap_sheet");
        my.sprite.debug = this.add.sprite(60, this.map.heightInPixels, "tilemap_sheet");
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        this.colorState = "blue_";

        for (let enemy of this.orysGroup.getChildren()) {
            enemy.anims.play("ory_fly");
        }
        for (let enemy of this.yellyGroup.getChildren()) {
            enemy.anims.play("yelly_fly");
        }

        this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
        this.physics.world.debugGraphic.clear()
    }

    modulateTimeScale(timeScale) {
        this.physics.world.timeScale = timeScale;
        this.tweens.timeScale = timeScale;
        this.time.timeScale = 1 / timeScale;
        my.sprite.player.anims.timeScale = 1 / timeScale;
        for (let enemy of this.orysGroup.getChildren()) {
            enemy.anims.timeScale = 1 / timeScale;
        }
        for (let enemy of this.yellyGroup.getChildren()) {
            enemy.anims.timeScale = 1 / timeScale;
        }
    }

    update() {
        if (this.isSlowmo) {
            my.sprite.player.anims.timeScale = 1 / this.SLOWMO_SPEED;
            for (let enemy of this.orysGroup.getChildren()) {
                enemy.anims.timeScale = 1 / this.SLOWMO_SPEED;
            }
            for (let enemy of this.yellyGroup.getChildren()) {
                enemy.anims.timeScale = 1 / this.SLOWMO_SPEED;
            }
        }

        let playerType = this.playerSettings[this.colorState]
        this.physics.world.gravity.y = playerType.GRAVITY;
        my.sprite.player.setMaxVelocity(playerType.MAX_VELOCITY, 3000)

        // this is coded in such a way where the bonus accel will only apply after the first frame of turning
        let isTurning = Math.abs(my.sprite.player.body.acceleration.x * my.sprite.player.body.velocity.x) != my.sprite.player.body.acceleration.x * my.sprite.player.body.velocity.x;

        let currentAcceleration = this.isGrounded ? playerType.GROUND_ACCELERATION : playerType.AIR_ACCELERATION;

        if (cursors.left.isDown) {
            // set accel to higher if player is moving in opposite direction
            // if facing other direction, acceleration is 1.5x
            if (isTurning) {
                my.sprite.player.setAccelerationX(-currentAcceleration * this.TURNING_MULTIPLIER);
            } else {
                my.sprite.player.setAccelerationX(-currentAcceleration);
            }

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play(this.colorState + 'walk', true);

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY * this.time.timeScale, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            } else {
                my.vfx.walking.stop();
            }

        } else if (cursors.right.isDown) {
            if (isTurning) {
                my.sprite.player.setAccelerationX(currentAcceleration * this.TURNING_MULTIPLIER);
            } else {
                my.sprite.player.setAccelerationX(currentAcceleration);
            }

            my.sprite.player.resetFlip();
            my.sprite.player.anims.play(this.colorState + 'walk', true);

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY * this.time.timeScale, 0);

            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            } else {
                my.vfx.walking.stop();
            }

        } else {
            // Set acceleration to 0
            my.sprite.player.setAccelerationX(0);
            // cause drag
            my.sprite.player.setDragX(playerType.DRAG);
            my.sprite.player.anims.play(this.colorState + 'idle');
            my.vfx.walking.stop();
        }



        // cause drag
        my.sprite.player.setDragX(playerType.DRAG);

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play(this.colorState + 'jump');
            this.isGrounded = false;
        } else {
            this.isGrounded = true;
        }


        if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(playerType.JUMP_VELOCITY);
        }

        if (my.sprite.player.body.position.y >= this.map.heightInPixels - 16) {
            console.log("You lose!");
            this.scene.restart();
            console.log(my.sprite.player.body.position.y);
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}