import Phaser from 'phaser';
export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene')
    }


create() {
    this.add.text(400, 300, 'SHooting Game', 
        {
        fontSize: '32px'
    }) .setOrigin(0.5)
   

     this.add.text(
        400,
        350,
        'PRESS SPACE TO START',
        {
            fontSize: '24px'
        }
    ).setOrigin(0.5)

    this.input.keyboard?.once('keydown-SPACE', () => {
        this.scene.start('GameScene')
    })
}
}
