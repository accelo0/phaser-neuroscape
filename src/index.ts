//importiamo la libreria phaser
import "phaser";
//importiamo le nostre scene
import Boot from "./scenes/system/Boot";
import Preloader from "./scenes/system/Preloader";

import Hud from "./scenes/Hud";
import GamePlay from "./scenes/GamePlay";
import GameOver from "./scenes/GameOver";
import Intro from "./scenes/Intro";
import Stem from "./scenes/Stem";
import Livello1 from "./scenes/Livello1";

import testLivello1 from "./scenes/test/newLiv1";

//importiamo GameData che contiene i valori globali del gioco
import { GameData } from "./GameData";

//il listener per l'evento load della pagina
//questo evento viene lanciato quando la pagina è stata caricata
//e tutti gli elementi della pagina sono disponibili
window.addEventListener("load", () => {
  //creiamo un oggetto di configurazione per il gioco
  //questo oggetto viene passato al costruttore di Phaser.Game
  // e contiene i parametri di configurazione del gioco
  // come il tipo di rendering, le dimensioni del canvas, le scene, ecc.
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    backgroundColor: GameData.globals.bgColor,
    parent: "my-game",
    scale: {
      mode: Phaser.Scale.FIT,
      width: GameData.globals.gameWidth,
      height: GameData.globals.gameHeight,
    },

    scene: [
      Boot,
      Hud,
      Preloader,
      Intro,
      GamePlay,
      GameOver,
      Stem,
      Livello1,

      testLivello1,
    ],
    physics: {
      default: "arcade",
      arcade: {
        debug: GameData.globals.debug,
        gravity: { y: 500, x: 0 },
      },
    },

    input: {
      activePointers: 2,
      keyboard: true,
    },
    render: {
      pixelArt: true,
      antialias: true,
    },
  };

  //inizializziamo il gioco passando la configurazione
  const game = new Phaser.Game(config);
});
