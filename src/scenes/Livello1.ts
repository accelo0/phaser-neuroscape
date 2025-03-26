enum playerState {
  IDLE,
  WALKING,
  RUNNING,
  JUMPING,
}

export default class Livello1 extends Phaser.Scene {
  private _liv1BG: Phaser.GameObjects.Image;
  private _terreno: Phaser.Physics.Arcade.StaticGroup;
  private _piattaforme: Phaser.Physics.Arcade.StaticGroup;
  private _player: Phaser.Physics.Arcade.Sprite;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private _animations: Array<{
    key: string;
    frames: Array<number>;
    frameRate: number;
    yoyo: boolean;
    repeat: number;
  }> = [
    {
      key: "player-walking-toRight",
      frames: [48, 49, 50, 51, 52, 53],
      frameRate: 10,
      yoyo: false,
      repeat: 1,
    },
    {
      key: "player-walking-toLeft",
      frames: [56, 57, 58, 59, 60, 61],
      frameRate: 10,
      yoyo: false,
      repeat: 1,
    },
    {
      key: "player-jumping-toRight",
      frames: [21, 22, 23],
      frameRate: 2,
      yoyo: false,
      repeat: 0,
    },
    {
      key: "player-jumping-toLeft",
      frames: [29, 30, 31],
      frameRate: 2,
      yoyo: false,
      repeat: 0,
    },
    { key: "idle", frames: [0], frameRate: 5, yoyo: false, repeat: -1 },
  ];

  constructor() {
    super({ key: "Livello1" });
  }

  preload() {
    this.load.image("liv1BG", "path/to/liv1BG.png");
    this.load.image("terreno", "path/to/terreno.png");
    this.load.image(
      "piattaforma",
      "Template/src/assets/images/livello1/platform.png"
    );
    this.load.spritesheet("player", "path/to/player_spritesheet.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    console.log("livello1");
    this.cameras.main.setBackgroundColor("#000000");
    this._liv1BG = this.add.image(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      "liv1BG"
    );

    // **Creazione del terreno con collisioni corrette**
    this._terreno = this.physics.add.staticGroup();
    const groundWidth = this.textures.get("terreno").getSourceImage().width;
    const groundHeight = this.textures.get("terreno").getSourceImage().height;
    const numGroundTiles = Math.ceil(this.game.canvas.width / groundWidth);

    for (let i = 0; i < numGroundTiles; i++) {
      this._terreno
        .create(
          i * groundWidth,
          this.game.canvas.height - groundHeight / 2,
          "terreno"
        )
        .setOrigin(0, 0.5);
    }

    // **Creazione piattaforme**
    this._piattaforme = this.physics.add.staticGroup();
    this._piattaforme.create(100, 600, "piattaforma");
    this._piattaforme.create(400, 600, "piattaforma");
    this._piattaforme.create(200, 650, "piattaforma");
    this._piattaforme.create(500, 650, "piattaforma");
    this._piattaforme.create(300, 400, "piattaforma");
    this._piattaforme.create(500, 300, "piattaforma");
    this._piattaforme.create(1000, 250, "piattaforma");
    this._piattaforme.create(700, 200, "piattaforma");
    this._piattaforme.create(1200, 150, "piattaforma");
    this._piattaforme.create(900, 100, "piattaforma");

    // **Creazione player con posizione corretta**
    /* this._player = this.physics.add.sprite(200, 600, 'player').setOrigin(0.5, 0.5).setScale(2); */
    // Creazione del player con posizione iniziale
    this._player = this.physics.add
      .sprite(1280, 800, "player")
      .setOrigin(0.5, 0.5)
      .setScale(3) // Rimuoviamo il ridimensionamento se non necessario
      .setCollideWorldBounds(true);
    this._player.setCollideWorldBounds(true);
    this._player.setGravityY(500); // **Aggiunta gravità per il movimento naturale**

    // **Aggiunta collisioni**
    this.physics.add.collider(this._player, this._terreno);
    this.physics.add.collider(this._player, this._piattaforme);

    // Settaggio della hitbox più precisa
    this._player.body.setSize(32, 48);
    this._player.body.setOffset(16, 16);

    // **Creazione animazioni**
    this._animations.forEach((anim) => {
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers("player", {
          frames: anim.frames,
        }),
        frameRate: anim.frameRate,
        yoyo: anim.yoyo,
        repeat: anim.repeat,
      });
    });

    // **Controlli**
    this._cursors = this.input.keyboard.createCursorKeys();
  }

  /*   update(): void {
    if (!this._player.body) return;

    // **Movimento a sinistra**
    if (this._cursors.left.isDown) {
      this._player.setVelocityX(-160);
      this._player.play("player-walking-toLeft", true);
    }
    // **Movimento a destra**
    else if (this._cursors.right.isDown) {
      this._player.setVelocityX(160);
      this._player.play("player-walking-toRight", true);
    }
    // **Idle**
    else {
      this._player.setVelocityX(0);
    }

    // **Salto (solo se tocca una superficie)**
    if (this._cursors.up.isDown && this._player.body.blocked.down) {
      this._player.setVelocityY(-400);
    }
  } */

  update() {
    // Reset della velocità del player
    this._player.setVelocityX(0);

    // Controllo movimento
    if (this._cursors.right.isDown) {
      this._player.setVelocityX(200);
      this._player.anims.play("player-walking-toRight", true);
    } else if (this._cursors.left.isDown) {
      this._player.setVelocityX(-200);
      this._player.anims.play("player-walking-toLeft", true);
    } else {
      this._player.anims.play("idle", true); // Ferma l'animazione quando non si preme nulla
    }

    if (this._cursors.up.isDown && this._player.body.blocked.down) {
      this._player.setVelocityY(-400);
    }

    this.scene.stop("Livello1");
    this.scene.start("testLivello1");
  }
}
