import { Deck, ORIGIN, Player } from "../objects";
export default class GameScene extends Phaser.Scene {
  private players: Array<Player>;
  private stageWidth: number;
  private stageHeight: number;

  constructor() {
    super({ key: "game-scene" });
    this.players = [];
  }

  preload() {
    this.load.atlas("cards", "./assets/cards.png", "./assets/cards.json");
    console.log("preloading");
  }

  create() {
    this.stageWidth = this.sys.game.canvas.width;
    this.stageHeight = this.sys.game.canvas.height;

    this.createPlayers();
    this.createDeck();
  }

  private createPlayers() {
    const margin = 40;

    const topPlayer = new Player({
      scene: this,
      name: "top-player",
      x: this.stageWidth / 2,
      y: margin,
      rotation: 0,
      isPlayer: true,
      cardSettings: {
        spacing: 40,
        scale: 0.3,
      },
    });
    this.players.push(topPlayer);

    const rightPlayer = new Player({
      scene: this,
      name: "right-player",
      x: this.stageWidth - margin,
      y: this.stageHeight / 2,
      rotation: -90,
      isPlayer: true,
      cardSettings: {
        spacing: 40,
        scale: 0.3,
      },
    });
    this.players.push(rightPlayer);

    const bottomPlayer = new Player({
      scene: this,
      name: "bottom-player",
      x: this.stageWidth / 2,
      y: this.stageHeight - margin,
      rotation: 0,
      isPlayer: true,
      cardSettings: {
        scale: 0.4,
        faceup: true,
        spacing: 40,
      },
    });
    this.players.push(bottomPlayer);

    const leftPlayer = new Player({
      scene: this,
      name: "left-player",
      x: margin,
      y: this.stageHeight / 2,
      rotation: 90,
      isPlayer: true,
      cardSettings: {
        spacing: 40,
        scale: 0.3,
      },
    });

    this.players.push(leftPlayer);
    console.log("Left player hand", leftPlayer);
  }

  private createDeck() {
    const deck = new Deck({
      scene: this,
      texture: "cards",
      suitPrefixes: {
        heart: "heart",
        spade: "spade",
        club: "club",
        diamond: "diamond",
        joker: "joker",
      },
      backFaceTextureName: "back-black",
      options: {
        rotation: 0.2,
      },
      onDeckClick: () => {
        this.players[2].removeCards(this.players[2].selectedCards, {
          x: 200,
          y: 200,
          spacing: 50,
          faceup: true,
        });
        // const topCard = deck.getTopCard();
        // this.players[2].addCard(topCard);
      },
    });

    deck.appendTo(this, this.stageWidth / 2, this.stageHeight / 2);
    deck.setScale(0.4, 0.4);
    deck.deal({
      totalCardsForEachPlayer: 5,
      players: this.players,
      options: { delay: 50, ease: "Power3" },
    });
  }
}
