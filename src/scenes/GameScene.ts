import { Deck, Player, POSITIONS } from "../objects";
export default class GameScene extends Phaser.Scene {
  private players: Array<Player>;
  constructor() {
    super({ key: "game-scene" });
    this.players = [];
  }

  preload() {
    this.load.image("qr", "./assets/qr.png");
    this.load.atlas("cards", "./assets/cards.png", "./assets/cards.json");
    console.log("preloading");
  }

  create() {
    // const rect = new Phaser.GameObjects.Rectangle(
    //   this,
    //   400,
    //   300,
    //   15,
    //   15,
    //   0x6666ff
    // );

    // this.add.existing(rect);
    this.createPlayers();
    this.createDeck();
  }

  private createPlayers() {
    const gameWidth = this.sys.game.canvas.width;
    const gameHeight = this.sys.game.canvas.height;
    const offset = 60;
    const topPlayer = new Player({
      scene: this,
      name: "top-player",
      x: gameWidth / 2,
      y: offset,
      position: POSITIONS.Top,
    });
    this.players.push(topPlayer);

    const rightPlayer = new Player({
      scene: this,
      name: "right-player",
      x: gameWidth - offset,
      y: gameHeight / 2,
      position: POSITIONS.Right,
    });
    this.players.push(rightPlayer);

    const bottomPlayer = new Player({
      scene: this,
      name: "bottom-player",
      x: gameWidth / 2,
      y: gameHeight - offset,
      faceup: true,
      position: POSITIONS.Bottom,
    });
    this.players.push(bottomPlayer);

    const leftPlayer = new Player({
      scene: this,
      name: "left-player",
      x: offset,
      y: gameHeight / 2,
      position: POSITIONS.Left,
    });
    this.players.push(leftPlayer);
  }

  private createDeck() {
    const deck = new Deck({
      scene: this,
      texture: "cards",
      suitInitials: ["heart", "spade", "club", "diamond"],
      backFaceTextureName: "back-black",
      options: {
        xOffset: 0.2,
      },
      onDeckClick: () => {
        deck.deal({
          totalCardsForEachPlayer: 5,
          players: this.players,
          options: { delay: 50, ease: "Power3" },
        });
      },
    });

    deck.addTo(this, 400, 300);
    deck.setScale(0.4, 0.4);
  }
}
