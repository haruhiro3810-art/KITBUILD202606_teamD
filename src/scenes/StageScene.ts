import Phaser from 'phaser';
import Score from '../UI/score';
import Player from '../player/player';

export default class StageScene extends Phaser.Scene {
    player!: Player;
    private score!: Score;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('StageScene')
    }
    // プレイヤーの作成とスコアの初期化
create() {
    console.log('StageScene')
  
    this.cursors = this.input.keyboard!.createCursorKeys();
  this.player = new Player(this.cursors, this);
    this.player.create();

    this.score = new Score(this.cursors, this);
    this.score.create();
  }
// プレイヤーの移動処理
update(){
    this.score.update();
  this.player.update();
  }
  
 }
