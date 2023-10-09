import "phaser";
import { ORIGIN } from ".";

export interface ICardConfig {
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

export interface ICardMoveAnimationConfig {
  x: number;
  y: number;
  rotation?: number;
  options?: {
    duration?: number;
    ease?: string;
  };
  onAnimationComplete?: (card: Card) => void;
}

export class Card extends Phaser.GameObjects.Sprite {
  private _isFaceUp: boolean;
  private _isFlipping: boolean;
  private _flipAnimationTimeline: Phaser.Time.Timeline;
  private _flipZoom: number;

  constructor(private config: ICardConfig) {
    super(config.scene, 0, 0, config.graphics.texture, "");

    this._isFaceUp = this.config.isFaceUp || false;

    const cardTexture = this._isFaceUp
      ? this.config.graphics.frontFaceTextureName
      : this.config.graphics.backFaceTextureName;

    this.setTexture(this.config.graphics.texture, cardTexture);

    const hitArea = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
    this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    this._isFlipping = false;
    this.name = this.config.graphics.frontFaceTextureName;
    this._flipZoom = this.config.animationOptions?.flipZoom || 0.1;
  }

  public flip() {
    const { centerX, centerY } = this.getBounds();
    this.setOrigin(ORIGIN.MiddleCenter.x, ORIGIN.MiddleCenter.y);

    this.x = centerX;
    this.y = centerY;

    this._flipAnimationTimeline = this.createFlipAnimationTimeline();
    if (!this._isFlipping) this._flipAnimationTimeline.play();
  }

  public getProperties(): {
    name: string;
    suit: string;
    rank: number;
    isFaceUp: boolean;
  } {
    const { suit, rank } = this.config;
    const isFaceUp = this._isFaceUp;
    const name = this.name;
    return { name, suit, rank, isFaceUp };
  }

  public moveTo(config: ICardMoveAnimationConfig) {
    const { x, y } = config;
    const rotation = config.rotation || 0;
    const duration = config.options?.duration || 500;
    const ease = config.options?.ease || "linear";

    this.scene.add.tween({
      targets: this,
      duration,
      x,
      y,
      rotation: Phaser.Math.DegToRad(rotation),
      ease,
      onComplete: () => {
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
            const name = this._isFaceUp
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
            this._isFaceUp = !this._isFaceUp;
            if (this.config?.animationOptions?.onFlipAnimationComplete)
              this.config.animationOptions.onFlipAnimationComplete(this);
          },
        },
      },
    ]);
  }
}
