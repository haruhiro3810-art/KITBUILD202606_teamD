import Phaser from 'phaser';
import TitleScene from './scenes/title';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width:800,
        height:600,
    },
    scene: [TitleScene,
            GameScene
    ]
}

new Phaser.Game(config)