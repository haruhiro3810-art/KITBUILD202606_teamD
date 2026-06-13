import Phaser from 'phaser';
export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene')
    }


create() {
    this.add.text(300, 200, 'SHooting Game', {
        fontSize: '32px'
    })
   }
}
