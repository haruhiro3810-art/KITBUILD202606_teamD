import Phaser from 'phaser';

export default class StageScene extends Phaser.Scene {
    player!: Phaser.GameObjects.Rectangle;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('StageScene')
    }
create() {
    console.log('StageScene')
    this.player = this.add.rectangle(100, 500, 40, 40, 0x00ff00);
    //this.physics.add.existing(this.player);

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

update(){
    if (this.cursors.right?.isDown && this.player.x + 5 <= 780){
        this.player.x += 5;
    }
    if (this.cursors.left?.isDown && this.player.x -5 >= 20){
        this.player.x -= 5;
    }
  }
 }

