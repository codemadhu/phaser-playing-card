# PhaserJs Playing Card Library

A playing card library based on PhaserJs

## Get Started

### Install package

```json
npm i phaser-playing-card
```

or clone the project from

```json
git clone https://github.com/codemadhu/phaser-playing-card.git
```

### MainScene.ts

#### Add Players

```ts
import { Card } from "phaser-playing-card";

export class MainScene extends Phaser.Scene {
  private players: Array<Player>;

  constructor() {
    super({ key: "MainScene" });
  }

  preload(): void {
    // Add your own card atlas
    this.load.atlas("cards", "../assets/cards.png", "../assets/cards.json");
  }

  create(): void {
    const margin = 40;
    const stageWidth = this.sys.game.canvas.width;
    const stageHeight = this.sys.game.canvas.height;

    // Add Top Player
    const topPlayer = new Player({
      scene: this,
      name: "top-player",
      x: stageWidth / 2,
      y: margin,
      rotation: 0,
      isMainPlayer: false,
      cardSettings: { spacing: 40, scale: 0.3 },
    });

    this.players.push(topPlayer);


      // Add Bottom Player (Human player)
    const bottomPlayer = new Player({
      scene: this,
      name: "top-player",
      x: stageWidth / 2,
      y: stageHeight,
      rotation: 0,
      isMainPlayer: false,
      cardSettings: { spacing: 40, scale: 0.3 },
    });

    this.players.push(bottomPlayer);
}
```

#### Add deck

```ts

  create(): void {

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
        // Removes cards from player and takes a card from deck
        bottomPlayer.removeCards(bottomPlayer.selectedCards);
        bottomPlayer.addCard(deck.getTopCard());
      },
    });

    deck.appendTo(this, stageWidth / 2, stageHeight / 2);
    deck.setScale(0.4, 0.4);

    // Call this method to distribute(deal) cards
    deck.deal({
      totalCardsToDeal: 5,
      players: this.players,
    });
}
```

#### Full code

```ts
import { Card, Deck } from "phaser-playing-card";

export class MainScene extends Phaser.Scene {
  private players: Array<Player>;

  constructor() {
    super({ key: "MainScene" });
  }

  preload(): void {
    // Add your own card atlas
    this.load.atlas("cards", "../assets/cards.png", "../assets/cards.json");
  }

  create(): void {
    const margin = 40;
    const stageWidth = this.sys.game.canvas.width;
    const stageHeight = this.sys.game.canvas.height;

    // Add Top Player
    const topPlayer = new Player({
      scene: this,
      name: "top-player",
      x: stageWidth / 2,
      y: margin,
      rotation: 0,
      isMainPlayer: false,
      cardSettings: { spacing: 40, scale: 0.3 },
    });

    this.players.push(topPlayer);

    // Add Bottom Player (Human player)
    const bottomPlayer = new Player({
      scene: this,
      name: "top-player",
      x: stageWidth / 2,
      y: stageHeight,
      rotation: 0,
      isMainPlayer: false,
      cardSettings: { spacing: 40, scale: 0.3 },
    });

    this.players.push(bottomPlayer);

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
        // Removes cards from player and takes a card from deck
        bottomPlayer.removeCards(bottomPlayer.selectedCards);
        bottomPlayer.addCard(deck.getTopCard());
      },
    });

    deck.appendTo(this, stageWidth / 2, stageHeight / 2);
    deck.setScale(0.4, 0.4);

    // Call this method to distribute(deal) cards
    deck.deal({
      totalCardsToDeal: 5,
      players: this.players,
    });
  }
}
```

Cards Assets by
Byron Knoll: http://code.google.com/p/vector-playing-cards/
