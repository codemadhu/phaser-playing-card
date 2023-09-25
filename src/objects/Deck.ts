export class Deck extends Phaser.GameObjects.GameObject {
  private _suits: Array<string> = ["spade", "diamond", "club", "heart"];
  // private _ranks: Array<number> = {}
  //   public hand: Array<Card> = [];
  //   public selectedCard: Card;
  //   public x: integer;
  //   public y: integer;

  constructor(scene: Phaser.Scene) {
    super(scene, "deck-ui");
  }

  private createDeck() {
    const maxSuitLength = 13;
    this._suits.forEach((suit) => {
      for (let i = 0; i <= 13; i += 1) {
        console.log("cards:", suit + i);
      }
    });
  }

  // public createDeck(cards: Array<any>) {
  //   const tempDeck = cards;
  //   Phaser.Actions.Shuffle(tempDeck);
  //   for (let i = 0; i < tempDeck.length; i += 1) {
  //     const _card = tempDeck[i];
  //     const id = i;
  //     const config = {
  //       scene: this.scene,
  //       position: { x: 0, y: 0 },
  //       texture: "cards",
  //       isFaceup: false,
  //       suit: _card.suit,
  //       rank: _card.rank,
  //       id: id,
  //     };
  //     const card = new Card(config);
  //     card.setScale(0.5);
  //     this.Hand.push(card);
  //     card.x = this.x + i * 0.2;
  //     card.y = this.y;
  //   }
  // }

  //   public deal(count: number) {
  //     let i = 0;
  //     const totalCount = count * players.length;
  //     const deck = this.Hand;
  //     const _this = this;

  //     function dealOne() {
  //       if (i < totalCount) {
  //         let lastCard: Card = _this.Hand.pop();
  //         const card: Card = lastCard;
  //         const currentIndex = i % players.length;
  //         const currentPlayer: Player = players[currentIndex];
  //         currentPlayer.addCard(card);
  //       } else {
  //         timer.remove();
  //         // _this.startDeckCardSelection();
  //         _this.scene.events.emit(DEAL_END);
  //       }
  //       i += 1;
  //     }
  //     const delay = 100;
  //     const timer = this.scene.time.addEvent({
  //       delay: delay,
  //       callback: dealOne,
  //       args: [],
  //       loop: true,
  //       repeat: 0,
  //       startAt: 0,
  //       timeScale: 1,
  //       paused: false,
  //     });
  //   }

  //   public topCard(): Card {
  //     const card: Card = this.Hand[this.Hand.length - 1];
  //     return card;
  //   }

  //   public startDeckCardSelection() {
  //     this.Hand.forEach((card) => {
  //       card.setInteractive();
  //       card.on("pointerup", () => {
  //         if (this.isTopCard(card)) {
  //           this.selectedCard = card;
  //           console.log("TOP CARD SELECTED");
  //           this.selectedCard.removeAllListeners();
  //           this.Hand.pop();
  //           this.scene.events.emit(DECK_CARD_SELECTED);
  //         }
  //       });
  //     });
  //   }

  //   public isTopCard(card: Card): boolean {
  //     const topCard = this.Hand[this.Hand.length - 1].cardName;
  //     if (card.cardName === topCard) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
}
