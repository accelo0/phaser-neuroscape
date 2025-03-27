export default class Crediti extends Phaser.Scene {
  private titolo_Crediti: Phaser.GameObjects.Text;
  private _Menu: Phaser.GameObjects.Text;
  private border: Phaser.GameObjects.Graphics;
  private _bgcrediti: Phaser.GameObjects.Image;

  constructor() {
      super({ key: "Stem" });
  }
  preload() {
      // Preload the images
      this.load.image("bgstem", "./assets/images/bg/bgstem.jpg");
  }

  create() {
      // Aggiungi l'immagine di sfondo
      this._bgcrediti = this.add.image(
          this.game.canvas.width / 2,
          this.game.canvas.height / 2,
          "bgstem"
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
              color: "#000000", // Testo Nero
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
              color: "#000000",
              fontFamily: "PressStart2P",
          }
      );
      this.titolo_Crediti.setOrigin(0.5, 0);

      // Lista dei nomi
      const nomi = [
          "Pruscino Angelo | Game Developer;",
          "Barbato Umberto | Game Developer;",
          "Cassella Gabriele | Game Developer;",
          "Giordano Andrea | Visual Designer;",
          "Gambuti Giovanni | Visual Designer;",
          "Tanzillo Mario | Sound Designer;",
          "Gernetti Andrea | Sound Designer;",
          "Romano Pasquale | Game Presenter;",
          "Melone Francesco | Game Presenter.",
      ];

      // Posizione iniziale per i nomi
      let startY = 100; // Posizione verticale iniziale sotto il titolo
      const lineSpacing = 70; // Spaziatura tra le righe

      // Aggiungi i nomi uno sotto l'altro
      nomi.forEach((nome) => {
          const nomeText = this.add.text(
              this.game.canvas.width / 2, // Posizione orizzontale centrata
              startY, // Posizione verticale
              nome,
              {
                  fontSize: "30px",
                  color: "#000000",
                  fontFamily: "PressStart2P", 
              }
          );
          nomeText.setOrigin(0.5, 0); // Centra il testo orizzontalmente
          startY += lineSpacing; // Incrementa la posizione verticale per il prossimo nome
      });
  }
}
