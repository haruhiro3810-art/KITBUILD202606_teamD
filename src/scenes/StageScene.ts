import Phaser from 'phaser';

export default class StageScene extends Phaser.Scene {
    player!: Phaser.GameObjects.Rectangle;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    score!: number ;
    scoreText!: Phaser.GameObjects.Text;


    constructor() {
        super('StageScene')
    }
    // プレイヤーの作成とスコアの初期化
create() {
    console.log('StageScene')
    this.player = this.add.rectangle(100, 500, 40, 40, 0x00ff00);
    this.physics.add.existing(this.player);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'Score: 0')
  }
// プレイヤーの移動処理
update(){
    if (this.cursors.right?.isDown && this.player.x + 5 <= 780){
        this.player.x += 5;
    }
    if (this.cursors.left?.isDown && this.player.x -5 >= 20){
        this.player.x -= 5;
    }
    if (this.cursors.space?.isDown) {
        this.addScore();
    }
  }
  // スコアを増やすメソッド
addScore() {
    this.score += 100;
    this.scoreText.setText('Score: ' + this.score);
    
 }
 }

