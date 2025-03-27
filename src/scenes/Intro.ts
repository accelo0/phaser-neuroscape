export default class Intro extends Phaser.Scene {
  private _bg: Phaser.GameObjects.Image;
  private _giocaButton: Phaser.GameObjects.Text;
  private _creditiButton: Phaser.GameObjects.Text;
  private _storiaButton: Phaser.GameObjects.Text;
  private _title: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: "Intro",
    });
  }

  preload() {
    // Preload the images
    this.load.image("introBG", "path/to/introBG.png");
    this.load.image("Title", "path/to/title_finished.png");
  }

  create() {
    // Set the background color to black
    this.cameras.main.setBackgroundColor("#000000");

    // Add the background image
    this._bg = this.add.image(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      "introBG"
    );

    // Add the title image and position it higher and 10 pixels to the right
    this._title = this.add.image(
      this.game.canvas.width / 2 + 25,
      this.game.canvas.height / 2 - 90,
      "Title"
    );

    const centerX = this.game.canvas.width / 2;
    const centerY = this.game.canvas.height - 150; // Position y to center the buttons at the bottom of the image

    const buttonSpacing = 70; // Distance between buttons
    const startY = centerY - buttonSpacing; // Initial y position for the first button

    this._giocaButton = this.add
      .text(centerX, startY, "Gioca", {
        fontSize: "50px",
        fontFamily: "PressStart2P",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    this._creditiButton = this.add
      .text(centerX, startY + buttonSpacing, "Crediti", {
        fontSize: "50px",
        fontFamily: "PressStart2P",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    this._storiaButton = this.add
      .text(centerX, startY + 2 * buttonSpacing, "STEM", {
        fontSize: "50px",
        fontFamily: "PressStart2P",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Button interactions
    this._giocaButton.setInteractive().on(
      "pointerdown",
      () => {
        this.scene.stop("Intro");
        //this.scene.start("Livello1");
        this.scene.start("Livello1");
        //faccio partire la scena HUD
        this.scene.start("Hud");
        //porto la scena HUD in primo piano
        this.scene.bringToTop("Hud");
      },
      this
    );

    this._creditiButton.setInteractive().on(
      "pointerdown",
      () => {
        this.scene.stop("Intro");
        this.scene.start("Stem");
      },
      this
    );

    this._storiaButton.setInteractive().on(
      "pointerdown",
      () => {
        this.scene.stop("Intro");
        this.scene.start("");
      },
      this
    );
  }

  update(time: number, delta: number): void {
    // this.bg.angle += 1;
  }
}
