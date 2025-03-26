import Phaser from "phaser";

enum playerState {
  IDLE,
  WALKING,
  RUNNING,
  JUMPING,
}

import Player from "../player/Player";

export default class testLivello1 extends Phaser.Scene {
  //private _liv1BG: Phaser.GameObjects.Image;
  private _terreni: Phaser.Physics.Arcade.StaticGroup;
  private _piattaforme: Phaser.Physics.Arcade.StaticGroup;
  private _player: Phaser.Physics.Arcade.Sprite;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _testiPiattaforme: Phaser.GameObjects.Group;

  private _key: Phaser.Physics.Arcade.Sprite;
  private _keyCounter: number = 0;
  private _keyYCoo: number;

  constructor() {
    super({ key: "testLivello1" });
  }

  preload() {
    this.load.tilemapTiledJSON(
      "mappa",
      "assets/images/livello1/livello1map.json"
    );
    //this.load.image('tileset', 'assets/tileset.png');
    //this.load.image('piattaforma', 'assets/piattaforma.png'); // Texture per piattaforme
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
  }

  creaPiattaforme(): void {
    //creo mappa importata sopra, fatta con tiled
    const map = this.make.tilemap({ key: "mappa" });

    // Creiamo un gruppo statico per le piattaforme con collisioni
    this._piattaforme = this.physics.add.staticGroup();

    // Carichiamo gli oggetti di collisione dal JSON
    const piattaformeObjects = map.getObjectLayer("Collisioni").objects;
    piattaformeObjects.forEach((obj) => {
      this._piattaforme.create(obj.x, obj.y, "piattaforma");
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

  create() {
    console.log("livelliDi1test");
    this.cameras.main.setBackgroundColor("#000000");
    this.add.image(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      "liv1BG"
    );

    this.creaTerreni();
    this.creaPlayer();
    this.creaPiattaforme();

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
        this.events.emit("key-picked", 1);
        this._keyCounter++;
      },
      null,
      this
    );

    // Abilitiamo le collisioni di player e chiave, con piattaforme e terreni
    this.physics.add.collider(
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
    // this.physics.add.overlap(_player, , collideCallback, processCallback, callbackContext);
  }
}
