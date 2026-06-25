import Phaser from 'phaser';
import Enemy from './enemy.ts';   
import Player from '../player/player.ts'; 

const BULLET_CONFIG = {
    radius: 6,
    color: 0xfbc531
};

export default class Bullet {
    public sprite: Phaser.GameObjects.Arc;
    private speedY: number;
    private scene: Phaser.Scene; 

    constructor(scene: Phaser.Scene, x: number, y: number, isEnemyBullet: boolean = false) {
        this.scene = scene; 

        // 物理エンジン付きの円を作成
        this.sprite = this.scene.add.circle(x, y, BULLET_CONFIG.radius, BULLET_CONFIG.color);
        this.scene.physics.add.existing(this.sprite); 
        
        // 敵の弾なら下へ、プレイヤーの弾なら上へ
        if (isEnemyBullet) {
            this.speedY = 5;  // ⏬ 敵の弾（少しゆっくり）
        } else {
            this.speedY = -12; // ⬆️ プレイヤーの弾（高速）
        }
    }

    public hitEnemy(enemy: Enemy) {
        enemy.damage(); 
    }

    public hitPlayer(player: Player) {
        player.damage(); 
    }

    update() {
        this.sprite.y += this.speedY;
    }
}