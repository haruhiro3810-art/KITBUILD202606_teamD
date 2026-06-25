import Phaser from 'phaser';
import Score from '../UI/score';
import Player from '../player/player';

export default class StageScene extends Phaser.Scene {
    player!: Player;
    private score!: Score;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    framePosition!: number;
    scrollSpeed!: number;
    background!: Phaser.GameObjects.Image;
    background2!: Phaser.GameObjects.Image;

    constructor() {
        super('StageScene')

    }
// 背景画像の読み込み
preload(): void {
     console.log("StageScene preload")
     this.load.setBaseURL('/');
     this.load.image("background", 'assets/background.png');
     this.load.image("background2", 'assets/background2.png');
}

    // プレイヤーの作成とスコアの初期化
create() {
    console.log('StageScene')
  
    this.cursors = this.input.keyboard!.createCursorKeys();
  this.player = new Player(this.cursors, this);
    this.player.create();

    this.score = new Score(this.cursors, this);
    this.score.create();
    // 背景画像の初期位置とスクロール速度を設定
    this.framePosition = 0;
    this.scrollSpeed = 2;
    // 背景画像を追加
    this.background = this.add.image(400, 300, "background");
    this.background2 = this.add.image(400, this.background.y - this.background.height, "background2") 
    

  }
// プレイヤーの移動処理
update(){
    this.score.update();
  this.player.update();
  this.framePosition += 1;
// 背景画像のスクロール処理
  this.background.y += this.scrollSpeed;
  this.background2.y += this.scrollSpeed;
  if (this.background.y >= 1140) {
    this.background.y = this.background2.y - this.background2.height;
  }
  if (this.background2.y >= 1140) {
    this.background2.y = this.background.y - this.background.height;
  }
   }


}
