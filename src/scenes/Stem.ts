export default class Stem extends Phaser.Scene {

  //

    private _bg: Phaser.GameObjects.Image;
    private _storia: Phaser.GameObjects.Text;
  
  
  
    constructor() {
      super({
        key: "Stem",
      });
  
    }
  
    preload() {
  
  
    }
    create() {
  
      //setta il background di sfondo a bianco
      this.cameras.main.setBackgroundColor("#000000");
      console.log("STEM");
  
    }
  
    update(time: number, delta: number): void {
  
      //this.bg.angle += 1;
  
    }
  
  }
  
  