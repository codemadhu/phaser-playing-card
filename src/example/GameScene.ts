import { Deck, Player } from "../objects";
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
      isMainPlayer: false,
      cardSettings: { spacing: 40, scale: 0.3 },
    });

    this.players.push(topPlayer);

    const rightPlayer = new Player({
      scene: this,
      name: "right-player",
      x: this.stageWidth - margin,
      y: this.stageHeight / 2,
      rotation: -90,
      isMainPlayer: false,
      cardSettings: { spacing: 40, scale: 0.3 },
    });
    this.players.push(rightPlayer);

    const bottomPlayer = new Player({
      scene: this,
      name: "bottom-player",
      x: this.stageWidth / 2,
      y: this.stageHeight - margin,
      rotation: 0,
      isMainPlayer: true,
      cardSettings: { spacing: 40, scale: 0.3, isFaceUp: true },
    });

    bottomPlayer.setCardThrowAnimation({
      cardSpacing: 30,
      isFaceUp: true,
      animationOptions: {
        x: bottomPlayer.x,
        y: 400,
        rotation: 0,
        scale: 0.3,
      },
    });
    this.players.push(bottomPlayer);

    const leftPlayer = new Player({
      scene: this,
      name: "left-player",
      x: margin,
      y: this.stageHeight / 2,
      rotation: 90,
      isMainPlayer: false,
      cardSettings: { spacing: 40, scale: 0.3 },
    });

    this.players.push(leftPlayer);
  }

  private createDeck() {
    const deck = new Deck({
      scene: this,
      texture: "cards",
      textureNames: {
        suits: {
          heartPrefix: "hearts",
          spadePrefix: "spades",
          clubPrefix: "clubs",
          diamondPrefix: "diamonds",
          jokers: ["red_joker", "black_joker"],
        },
        backside: "back-side",
      },

      options: {
        rotation: 0.2,
      },
      onDeckClick: () => {
        this.players[2].removeCards(this.players[2].selectedCards);
        this.players[2].addCard(deck.getTopCard());
      },
    });

    deck.appendTo(this, this.stageWidth / 2, this.stageHeight / 2);
    deck.setScale(0.4, 0.4);

    deck.deal({
      totalCardsToDeal: 5,
      players: this.players,
      options: { delay: 100, ease: "Power3" },
    });
  }
}
