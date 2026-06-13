import Phaser from 'phaser';
import TitleScene from './scenes/title';

const config = {
    type: Phaser.AUTO,
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width:800,
        height:600,
    },
    scene: [TitleScene]
}

new Phaser.Game(config)