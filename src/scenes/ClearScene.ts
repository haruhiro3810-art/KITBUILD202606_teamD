import Phaser from 'phaser';
export default class ClearScene extends Phaser.Scene {
    constructor() {
        super('ClearScene')
    }


create() {
    this.add.text(400, 300, 'GAME CLEAR!', 
        {
        fontSize: '32px'
    }) .setOrigin(0.5)
   

     this.add.text(
        400,
        350,
        'PRESS SPACE TO RETURN TO TITLE',
        {
            fontSize: '24px'
        }
    ).setOrigin(0.5)

    this.input.keyboard?.once('keydown-SPACE', () => {
        this.scene.start('TitleScene')
    })
}
}