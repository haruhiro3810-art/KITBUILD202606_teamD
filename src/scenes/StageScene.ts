import Phaser from 'phaser';
import Score from '../UI/score';
import Player from '../player/player';

export default class StageScene extends Phaser.Scene {
    player!: Player;
    private score!: Score;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    framePosition!: number;
    scrollSpeed!: number;
    backgroundY!: number;
    background!: Phaser.GameObjects.Image;
    background2!: Phaser.GameObjects.Image;

    constructor() {
        super('StageScene')

    }

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

    this.framePosition = 0;
    this.scrollSpeed = 2;
    this.backgroundY = 300;

    this.background = this.add.image(400, 300, "background");
    this.background2 = this.add.image(400, this.background.y - this.background.height, "background2") 
    

  }
// プレイヤーの移動処理
update(){
    this.score.update();
  this.player.update();
  this.framePosition += 1;

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
