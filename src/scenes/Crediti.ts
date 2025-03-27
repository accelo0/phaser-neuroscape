export default class Crediti extends Phaser.Scene {
  private titolo_Crediti: Phaser.GameObjects.Text;
  private _Menu: Phaser.GameObjects.Text;
  private border: Phaser.GameObjects.Graphics;
  private _bgcrediti: Phaser.GameObjects.Image;

  constructor() {
    super({ key: "Crediti" });
  }
  preload() {
    // Preload the images
    this.load.image("bgcrediti", "./assets/images/bg/bgcrediti.jpg");
  }

  create() {
    // Aggiungi l'immagine di sfondo
    this._bgcrediti = this.add.image(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2,
      "introBG-blur"
    );

    // Testo "Torna Al Menù"
    const _buttonSpacing = 60;
    this._Menu = this.add.text(
      this.game.canvas.width / 2,
      this.game.canvas.height - _buttonSpacing,
      "Torna Al Menù",
      {
        fontSize: "25px",
        fontFamily: "PressStart2P",
        color: "#ffffff", // Testo Nero
      }
    );
    this._Menu.setOrigin(0.5, 0.5);

    // Rendi il testo interattivo
    this._Menu.setInteractive().on("pointerdown", () => {
      console.log("Pulsante cliccato!");
      this.scene.start("Intro"); // Redirect alla intro
    });

    // Testo "Crediti" posizionato centrato in alto
    this.titolo_Crediti = this.add.text(
      this.game.canvas.width / 2,
      30, // Posizione verticale in alto
      "Crediti:",
      {
        fontSize: "35px",
        color: "#ffffff",
        fontFamily: "PressStart2P",
      }
    );
    this.titolo_Crediti.setOrigin(0.5, 0);

    // Modifica la struttura dei dati per includere chi ha presentato
    const credits = [
      { name: "Pruscino Angelo", role: "Game Developer", hasPresented: false },
      { name: "Barbato Umberto", role: "Game Developer", hasPresented: false },
      {
        name: "Cassella Gabriele",
        role: "Game Developer",
        hasPresented: true,
      },
      { name: "Giordano Andrea", role: "Visual Designer", hasPresented: true },
      {
        name: "Gambuti Giovanni",
        role: "Visual Designer",
        hasPresented: true,
      },
      { name: "Tanzillo Mario", role: "Sound Designer", hasPresented: false },
      { name: "Gernetti Andrea", role: "Sound Designer", hasPresented: true },
      { name: "Romano Pasquale", role: "Game Presenter", hasPresented: true },
      { name: "Melone Francesco", role: "Game Presenter", hasPresented: true },
    ];

    let startY = 100;
    const lineSpacing = 70;
    const separator = " | ";
    const normalColor = "#ffffff";
    const presenterColor = "#FFD700"; // Colore oro per chi ha presentato

    credits.forEach((credit) => {
      const container = this.add.container(this.game.canvas.width / 2, startY);

      // Aggiungi il nome con colore condizionale
      const nameText = this.add
        .text(0, 0, credit.name, {
          fontSize: "30px",
          stroke: "#000000",
          strokeThickness: 2,
          color: credit.hasPresented ? presenterColor : normalColor,
          fontFamily: "PressStart2P",
        })
        .setOrigin(1, 0);

      const separatorText = this.add
        .text(20, 0, separator, {
          fontSize: "30px",
          stroke: "#000000",
          strokeThickness: 2,
          color: normalColor,
          fontFamily: "PressStart2P",
        })
        .setOrigin(0.5, 0);

      const roleText = this.add
        .text(40, 0, credit.role, {
          fontSize: "30px",
          stroke: "#000000",
          strokeThickness: 2,
          color: normalColor,
          fontFamily: "PressStart2P",
        })
        .setOrigin(0, 0);

      container.add([nameText, separatorText, roleText]);
      startY += lineSpacing;
    });
  }
}
