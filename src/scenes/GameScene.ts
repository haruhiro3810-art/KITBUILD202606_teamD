import Phaser from 'phaser';
export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }


create() {
    this.add.text(
        50,
        50,
        'Game Scene',
    {
        fontSize: '32px'
    }
    ).setOrigin(0)
  }
}
