# PhaserJs Playing Card Library

A playing card library based on PhaserJs

## Get Started

### Install package

```json
npm i phaser-playing-card
```

### MainScene.ts

```ts
import { Card } from "phaser-playing-card";

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload(): void {
    // Add your own card atlas
    this.load.atlas("cards", "../assets/cards.png", "../assets/cards.json");
  }

  create(): void {
    const card = new Card({
      scene: this,
      suit: "heart",
      rank: 7,
      isFaceUp: true,
      texture: "cards",
    });

    this.add.existing(card);
  }
}
```
