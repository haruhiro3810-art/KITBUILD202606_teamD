import Phaser from 'phaser';
import Enemy from './enemy.ts';   // 敵のファイルを読み込む
import Player from '../player/player.ts'; // 🚀 プレイヤーのファイルを新しく読み込む
import Enemy from './enemy.ts';   // 敵のファイルを読み込む
import Player from '../player/player.ts'; // 🚀 プレイヤーのファイルを新しく読み込む

const BULLET_CONFIG = {
    radius: 6,
    color: 0xfbc531,
    speedY: -12
    radius: 6,
    color: 0xfbc531,
    speedY: -12
};

export default class Bullet {
    public sprite: Phaser.GameObjects.Arc;
    private speedY: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.sprite = scene.add.circle(x, y, BULLET_CONFIG.radius, BULLET_CONFIG.color);
        this.speedY = BULLET_CONFIG.speedY;
    }

    // 🎯 プレイヤー弾：触れる(敵) 【敵のライフを減らす()】
    public hitEnemy(enemy: Enemy) {
        enemy.damage(); // 触れた敵のライフを1減らす
    }

    // 💥 敵弾：触れる(プレイヤー) 【プレイヤーのライフを減らす()】  ← 🚀ここを追加！
    public hitPlayer(player: Player) {
        player.damage(); // 触れたプレイヤーのライフを1減らす
    }

    update() {
        this.sprite.y += this.speedY;
        this.sprite.y += this.speedY;
    }
}