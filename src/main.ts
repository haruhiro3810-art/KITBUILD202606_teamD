import Phaser from 'phaser';
import TitleScene from './scenes/title';
import GameScene from './scenes/GameScene';
import StageScene from './scenes/StageScene';
import ClearScene from './scenes/ClearScene';
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width:800,
        height:600,
    },

    physics:{
        default: 'arcade',
        arcade: {
            debug: true
        
        }
    },
    scene: [TitleScene,
            GameScene,
            StageScene,
            ClearScene
    ]
}

new Phaser.Game(config)