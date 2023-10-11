import "phaser";
import GameScene from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 414,
  height: 725,
  zoom: 1,
  backgroundColor: "0xcccccc",
  input: {
    keyboard: true,
    gamepad: true,
  },
  disableContextMenu: true,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: false,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {
        y: 0,
      },
    },
  },
  scene: [GameScene],
};

window.addEventListener("load", () => new Phaser.Game(config));
