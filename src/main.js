import Phaser from 'phaser';
import TitleScene from './scenes/title';

const config = {
    type: Phaser.AUTO,
    width:800,
    height:600,
    scene: [TitleScene]
}

new Phaser.Game(config)