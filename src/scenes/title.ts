import Phaser from 'phaser';
export default class TitleScene extends Phaser.Scene {
    
    titleg!: Phaser.GameObjects.Image;
   
    constructor() {
        super('TitleScene')
    }

    preload(): void {

        console.log("TitleScene preload");

        this.load.setBaseURL('/');

        this.load.image("titleg","assets/titleg.png");
    }
create() {
    
    this.titleg = this.add.image(
            400,
            300,
            "titleg"
        );
        this.titleg.setDepth(0);
    
    
     //this.add.text(
       // 400,
        //350,
        //'PRESS SPACE TO START',
       // {
            //fontSize: '24px'
       // }
    //).setOrigin(0.5)

    this.input.keyboard?.once('keydown-SPACE', () => {
        this.scene.start('GameScene')
    })
}
}
