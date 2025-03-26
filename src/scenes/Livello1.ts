import Phaser from "phaser";

export default class Livello1 extends Phaser.Scene {
  private _terreni: Phaser.Physics.Arcade.StaticGroup;
  private _piattaforme: Phaser.Physics.Arcade.StaticGroup;
  private _player: Phaser.Physics.Arcade.Sprite;

  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private _key: Phaser.Physics.Arcade.Sprite;
  private _keyCounter: number = 0;
  private _keyYCoo: number;

  private _portaText: Phaser.GameObjects.Text;
  private _porta: Phaser.Physics.Arcade.Sprite;

  private _activeCollider: Phaser.Physics.Arcade.Collider;

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
    this.load.tilemapTiledJSON(
      "mappa",
      "assets/images/livello1/livello1map.json"
    );
  }

  creaTerreni(): void {
    // **Creazione del terreno con collisioni corrette**
    this._terreni = this.physics.add.staticGroup();

    this._terreni
      .create(640, 810, "terreno")
      .setDisplaySize(1280, 10)
      .setOrigin(0.5, 0);

    const secondFloor = this._terreni
      .create(640, 350, "terreno")
      .setDisplaySize(1280, 40)
      .setOrigin(0.5, 1);

    // Jump-through platform
    (secondFloor.body as Phaser.Physics.Arcade.StaticBody)
      .setSize(1280, 40)
      .setOffset(0, 12).checkCollision.down = false;
  }

  creaPlayer(): void {
    // **Creazione player con posizione corretta**
    this._player = this.physics.add
      .sprite(0, 700, "player")
      .setOrigin(0.5, 0.5)
      .setScale(3)
      .setCollideWorldBounds(true);
    this._player.setCollideWorldBounds(true);
    this._player.setGravityY(100); // **Aggiunta gravità per il movimento naturale**

    // Settaggio della hitbox più precisa
    this._player.body.setSize(12, 23);

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
  }

  creaPiattaforme(): void {
    //creo mappa importata sopra, fatta con tiled
    const map = this.make.tilemap({ key: "mappa" });

    // Creiamo un gruppo statico per le piattaforme con collisioni
    this._piattaforme = this.physics.add.staticGroup();

    // Carichiamo gli oggetti di collisione dal JSON
    const piattaformeObjects = map.getObjectLayer("Collisioni").objects;
    piattaformeObjects.forEach((obj) => {
      const platform = this._piattaforme.create(obj.x, obj.y, "piattaforma");
      (platform.body as Phaser.Physics.Arcade.StaticBody).checkCollision.down =
        false;
      (platform.body as Phaser.Physics.Arcade.StaticBody).checkCollision.left =
        false;
      (platform.body as Phaser.Physics.Arcade.StaticBody).checkCollision.right =
        false;
    });
  }

  spawnChiave(): void {
    // Seleziona una piattaforma casuale
    const piattaformeArray = this._piattaforme.getChildren();
    //numero casuale tra 0 e il numero di piattaforme
    const piattaformaScelta = piattaformeArray[
      Math.floor(Math.random() * piattaformeArray.length)
    ] as Phaser.Physics.Arcade.Sprite; // Scegli la prima piattaforma (puoi cambiarlo)

    // Crea la chiave sopra la piattaforma scelta
    this._key = this.physics.add
      .sprite(piattaformaScelta.x, piattaformaScelta.y - 50, "chiave")
      .setGravityY(0);

    this._keyYCoo = this._key.y;
    this._key.play("key-anim");
  }

  setupPorta(): void {
    const terreno2 =
      this._terreni.getChildren()[1] as Phaser.Physics.Arcade.Sprite;
    this._porta = this.physics.add
      .sprite(1100, terreno2.y - 95, "porta")
      .setScale(0.6);
    this.physics.add.collider(this._porta, this._terreni);

    this._portaText = this.add
      .text(this._porta.x - 85, this._porta.y - 120, "Premi 'A'\nper entrare", {
        fontSize: "13px",
        fontFamily: "PressStart2P",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      //.setOrigin(0.5)
      .setVisible(false);
  }

  create() {
    console.log("LIVELLO 1");
    this.cameras.main.setBackgroundColor("#000000");
    this.add.image(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      "liv1BG"
    );

    this.creaTerreni();
    this.setupPorta();
    this.creaPiattaforme();
    this.creaPlayer();

    // Interazione tra player e porta
    this.physics.add.overlap(
      this._player,
      this._porta,
      () => {
        if (this._keyCounter == 1) this._portaText.setVisible(true);
        else if (this._keyCounter == 0) {
          this._portaText.setText(
            "... Per aprire\nquesta porta\nserve una chiave!"
          );
          this._portaText.setVisible(true);
        }
      },
      null,
      this
    );

    //animazione della chiave
    this.anims.create({
      key: "key-anim",
      frames: this.anims.generateFrameNumbers("chiave", { start: 0, end: 23 }), // 24 frame
      frameRate: 10,
      repeat: -1,
    });

    this.spawnChiave();

    // Aggiungi un tween per far fluttuare la chiave
    this.tweens.add({
      targets: this._key,
      y: { from: this._keyYCoo, to: this._keyYCoo + 10 }, // Movimento verticale di 10 pixel
      //duration: 1000, // Durata del movimento (1 secondo)
      yoyo: true, // Torna indietro
      repeat: -1, // Ripeti all'infinito
      ease: "Sine.easeInOut", // Movimento fluido
      onUpdate: () => {
        if (this._key.active) this._key.setVelocityY(0); // Blocca la chiave in posizione
      },
    });

    // Aggiungi interazione tra player e chiave
    this.physics.add.overlap(
      this._player,
      this._key,
      () => {
        this._key.destroy();
        this.events.emit("key-event", 1);
        this._keyCounter++;
      },
      null,
      this
    );

    // Abilitiamo le collisioni di player e chiave, con piattaforme e terreni
    this._activeCollider = this.physics.add.collider(
      [this._player, this._key],
      [this._terreni, this._piattaforme]
    );

    // setup controlli
    this._cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    // Reset della velocità del player
    this._player.setVelocityX(0);

    // Controllo movimento
    if (this._cursors.right.isDown) {
      this._player.setVelocityX(200);

      if (!this._player.body.touching.down) {
        this._player.anims.play("player-jumping-toRight", true);
      } else if (this._player.body.blocked.down) {
        this._player.anims.play("player-walking-toRight", true);
      }
    } else if (this._cursors.left.isDown) {
      this._player.setVelocityX(-200);

      if (!this._player.body.touching.down) {
        this._player.anims.play("player-jumping-toLeft", true);
      } else if (this._player.body.blocked.down) {
        this._player.anims.play("player-walking-toLeft", true);
      }

      //controllo del salto verso destra e sinistra
    } else {
      this._player.anims.play("idle", true); // Ferma l'animazione quando non si preme nulla
    }

    if (this._cursors.up.isDown && this._player.body.blocked.down) {
      this._player.setVelocityY(-400);
    }

    const secondFloor =
      this._terreni.getChildren()[1] as Phaser.Physics.Arcade.Sprite;
    //permettere al player di passare attraverso il secondo piano
    // Controlliamo se il player è sopra il secondo pavimento
    if (
      this._cursors.down.isDown &&
      this._player.body.blocked.down &&
      this._player.y < secondFloor.y
    ) {
      console.log("sopra e down");
      // Disattiva temporaneamente il collider
      this._activeCollider.active = false;

      // Riattiva il collider dopo un breve delay
      this.time.delayedCall(250, () => {
        this._activeCollider.active = true;
      });
    }

    if (
      Phaser.Math.Distance.Between(
        this._player.x,
        this._player.y,
        this._porta.x,
        this._porta.y
      ) > 50
    ) {
      this._portaText.setVisible(false);
    }

    if (
      this._portaText.visible &&
      this.input.keyboard.checkDown(this.input.keyboard.addKey("A"), 250) &&
      this._keyCounter == 1
    ) {
      console.log("porta aperta");
      this.cameras.main.flash(1000, 255, 255, 255);
      this._keyCounter--;
      this.events.emit("key-event", -1);
      //this.scene.start("nextLevelScene"); // Cambia con la tua prossima scena
    }
  }
}
