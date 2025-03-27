export default class Intro extends Phaser.Scene {
  private _bg: Phaser.GameObjects.Image;
  private _giocaButton: Phaser.GameObjects.Text;
  private _creditiButton: Phaser.GameObjects.Text;
  private _storiaButton: Phaser.GameObjects.Text;
  private _title: Phaser.GameObjects.Image;
  private _music: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: "Intro" });
  }

  preload() {
    // Load assets
    this.load.image("introBG", "path/to/introBG.png");
    this.load.image("Title", "path/to/title_finished.png");
    //this.load.audio("intro_gioco", "path/to/intro_gioco.ogg");
  }

  create() {
    // Set background color
    this.cameras.main.setBackgroundColor("#000000");

    // Play background music (looping)
    //this._music = this.sound.add("intro_gioco", { loop: true, volume: 1 });
    //this._music.play();

    // Add background image
    this._bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "introBG"
    );

    // Add title image, positioned slightly higher and to the right
    this._title = this.add.image(
      this.scale.width / 2 + 25,
      this.scale.height / 2 - 90,
      "Title"
    );

    // Button positioning
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height - 150;
    const buttonSpacing = 70;
    const startY = centerY - buttonSpacing;

    //Create buttons
    this._giocaButton = this.createButton(centerX, startY, "Gioca", () => {
      this.scene.start("Livello1");
      this.scene.start("Hud");
        //porto la scena HUD in primo piano
        this.scene.bringToTop("Hud");
    }); 

    this._creditiButton = this.createButton(
      centerX,
      startY + buttonSpacing,
      "Crediti",
      () => {
        this.scene.stop("Intro");
        //this.scene.start("Livello1");
        this.scene.start("Crediti");
        //faccio partire la scena HUD
        
      },
      
    );

    this._storiaButton = this.createButton(
      centerX,
      startY + 2 * buttonSpacing,
      "Storia", // Fixed from "STEM" if it was a mistake
      () => {
        this.scene.start("Storia");
      }
    );
  }

  private createButton(x: number, y: number, label: string, callback: () => void) {
    const button = this.add
      .text(x, y, label, {
        fontSize: "50px",
        fontFamily: "PressStart2P",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", callback);

    return button;
  }
/* 
  private startGame() {
    this.scene.stop("Intro");
    this.scene.start("Livello1");
    this.scene.start("Hud");
    this.scene.bringToTop("Hud");
  }
 */
  update() {
    // Optional: Uncomment this to add rotation to the background
    // this._bg.angle += 0.1;
  }
}
