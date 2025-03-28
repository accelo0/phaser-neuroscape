export let GameData: gameData = {
  globals: {
    gameWidth: 1280,
    gameHeight: 800,
    bgColor: "#ffffff",
    debug: false,
  },

  preloader: {
    bgColor: "ffffff",
    image: "logo",
    imageX: 1280 / 2,
    imageY: 800 / 2,
    loadingText: "Caricamento...",
    loadingTextFont: "roboto",
    loadingTextComplete: "Tappa/clicca per iniziare!!",
    loadingTextY: 700,
    loadingBarColor: 0xff0000,
    loadingBarY: 630,
  },

  spritesheets: [
    {
      name: "player",
      path: "assets/images/charPlayer.png",
      width: 64,
      height: 64,
      frames: 64,
    },
    {
      name: "chiave",
      path: "assets/images/objects/key_32x32_24f.png",
      width: 32,
      height: 32,
      frames: 24,
    },
  ],
  images: [
    // { name: "phaser", path: "assets/images/bg-template/logo-phaser.png" },
    // { name: "freedoom", path: "assets/images/bg-template/freedoom.png" },

    { name: "Title", path: "assets/images/bg/title_finished.png" },

    { name: "introBG", path: "assets/images/bg/introBG.png" },
    { name: "introBG-blur", path: "assets/images/bg/introBG-blur.png" },
    { name: "terrenoBlack", path: "assets/images/livello1/terreno.png" },

    //Livello 1
    { name: "liv1BG", path: "assets/images/livello1/Background.png" },
    { name: "terreno", path: "assets/images/livello1/groundGrass.png" },

    { name: "piattaforma", path: "assets/images/livello1/platform.png" },
    { name: "porta", path: "assets/images/livello1/porta1livello.png" },

    //Livello2
    { name: "liv2BG", path: "assets/images/livello2/2livello.png" },
    { name: "piattaforma2", path: "assets/images/livello2/platformLab.png" },
    { name: "bluemeth", path: "assets/images/objects/bluemeth.png" },
    { name: "waltMeth", path: "assets/images/livello2/walt&meth.png" },
    {name: "metheffect", path: "assets/video/meth_effect.mp4" },
    

    // { name: "liv2BG", path: "assets\images\bg\liv2BG.png" },

    /* { name: "bg-2", path: "assets/images/bg/2.png" },
    { name: "bg-3", path: "assets/images/bg/3.png" },
    { name: "bg-4", path: "assets/images/bg/4.png" },
    { name: "bg-5", path: "assets/images/bg/5.png" },
    { name: "bg-6", path: "assets/images/bg/6.png" },
    { name: "bg-7", path: "assets/images/bg/7.png" }, */
  ],
  atlas: [],
  sounds: [
    {
      name: "IntroGame",
      paths: ["assets/sounds/intro_gioco.ogg"], //"assets/sounds/intro.m4a"],
    },
  ],

  videos: [
    // { name: "video", path: "/assets/video/video.mp4" },
  ],
  audios: [
    /*{
    name: "sfx",
    jsonpath: "assets/sounds/sfx.json",
    paths: ["assets/sounds/sfx.ogg", "assets/sounds/sfx.m4a"],
    instances: 10,
  }*/
  ],

  scripts: [],
  fonts: [
    {
      key: "ralewayRegular",
      path: "assets/fonts/raleway.regular.ttf",
      type: "truetype",
    },
    {
      key: "PressStart2P",
      path: "assets/fonts/PressStart2P-Regular.ttf",
      type: "truetype",
    },
  ],
  webfonts: [
    { key: "Nosifer" },
    { key: "Roboto" },
    { key: "Press+Start+2P" },
    { key: "Rubik+Doodle+Shadow" },
    { key: "Rubik+Glitch" },
  ],
  bitmapfonts: [],
};
