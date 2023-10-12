import "phaser";
import { Utils } from ".";

export interface ICard {
  scene: Phaser.Scene;
  suit: string;
  rank: number;
  isFaceUp?: boolean;
  graphics: {
    texture: string;
    frontFaceTextureName: string;
    backFaceTextureName: string;
  };
  animationOptions?: {
    flipSpeed?: number;
    flipZoom?: number;
    onFlipAnimationComplete?: (card: Card) => void;
  };
}

export interface ICardMoveAnimation {
  x: number;
  y: number;
  rotation?: number;
  scale?: number;
  options?: {
    duration?: number;
    ease?: string;
  };
  onAnimationComplete?: (card?: Card) => void;
}

export class Card extends Phaser.GameObjects.Sprite {
  public name: string;
  public suit: string;
  public rank: number;
  public isFaceUp: boolean;

  private _isFlipping: boolean;
  private _isSelected: boolean;
  private _flipAnimationTimeline: Phaser.Time.Timeline;
  private _flipZoom: number;

  constructor(private config: ICard) {
    super(config.scene, 0, 0, config.graphics.texture, "");

    this.name = config.graphics.frontFaceTextureName;
    this.suit = config.suit;
    this.rank = config.rank;
    this.isFaceUp = config.isFaceUp || false;

    this._isSelected = false;
    this._isFlipping = false;
    this._flipZoom = config.animationOptions?.flipZoom || 0.1;

    const cardTexture = this.isFaceUp
      ? config.graphics.frontFaceTextureName
      : config.graphics.backFaceTextureName;

    this.setTexture(config.graphics.texture, cardTexture);

    const hitArea = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
  }

  public flip() {
    const { centerX, centerY } = this.getBounds();
    this.setOrigin(Utils.ORIGIN.MiddleCenter.x, Utils.ORIGIN.MiddleCenter.y);

    this.x = centerX;
    this.y = centerY;

    this._flipAnimationTimeline = this.createFlipAnimationTimeline();
    if (!this._isFlipping) this._flipAnimationTimeline.play();
  }

  public showFace(value: boolean) {
    const { frontFaceTextureName, backFaceTextureName } = this.config.graphics;
    const cardTexture = value ? frontFaceTextureName : backFaceTextureName;

    this.setTexture(this.config.graphics.texture, cardTexture);

    this.isFaceUp = value;
  }

  public selected(value?: boolean): boolean {
    if (value !== undefined) {
      this._isSelected = value;
    }
    return this._isSelected;
  }

  public moveTo(config: ICardMoveAnimation) {
    const { x, y } = config;
    const scale = config.scale || this.scale;
    const rotation = config.rotation || 0;
    const duration = config.options?.duration || 500;
    const ease = config.options?.ease || "linear";

    const animation = this.scene.add.tween({
      targets: this,
      duration,
      x,
      y,
      scale,
      rotation: Phaser.Math.DegToRad(rotation),
      ease,
      onComplete: () => {
        animation.destroy();
        if (config.onAnimationComplete) config.onAnimationComplete(this);
      },
    });
  }

  private createFlipAnimationTimeline(): Phaser.Time.Timeline {
    const totalTween = 4;
    const flipSpeed = this.config.animationOptions?.flipSpeed || 500;
    const duration = flipSpeed / totalTween;

    return this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: this,
          scale: this.scale + this._flipZoom,
          duration,
          onStart: () => {
            this._isFlipping = true;
          },
        },
      },
      {
        at: duration,
        tween: {
          targets: this,
          scaleX: 0,
          duration,
          onComplete: () => {
            const { texture, frontFaceTextureName, backFaceTextureName } =
              this.config.graphics;
            const name = this.isFaceUp
              ? backFaceTextureName
              : frontFaceTextureName;
            this.setTexture(texture, name);
          },
        },
      },
      {
        at: duration * 2,
        tween: {
          targets: this,
          scale: this.scale + this._flipZoom,
          duration,
        },
      },
      {
        at: duration * 3,
        tween: {
          targets: this,
          scale: this.scale,
          duration,
          onComplete: () => {
            this._isFlipping = false;
            this.isFaceUp = !this.isFaceUp;
            if (this.config?.animationOptions?.onFlipAnimationComplete)
              this.config.animationOptions.onFlipAnimationComplete(this);
          },
        },
      },
    ]);
  }
}
