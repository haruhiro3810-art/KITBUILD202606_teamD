import Phaser from 'phaser';
import Bullet from './bullet.ts'; 

const ENEMY_CONFIG = {
    width: 40,
    height: 40,
    color: 0xff0000,   
    speedX: -2,        // 左に進むスピード
    maxLife: 1,         
    fireInterval: 45   // 弾を撃つ間隔（約0.7秒）
};

export default class Enemy {
    public sprite!: Phaser.GameObjects.Rectangle;
    private scene!: Phaser.Scene;
    public life: number = 0; 

    public bullets: Bullet[] = []; // 撃った弾を一時的に入れておく箱
    private fireTimer: number = 0;   

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        
        this.sprite = this.scene.add.rectangle(x, y, ENEMY_CONFIG.width, ENEMY_CONFIG.height, ENEMY_CONFIG.color);
        this.scene.physics.add.existing(this.sprite); 

        this.life = ENEMY_CONFIG.maxLife; 
        this.fireTimer = 0; // 出現直後にまず1発目をすぐ撃つ
    }

    public damage() {
        if (this.life > 0) { this.life--; }
    }

    public explode(): boolean {
        if (this.life <= 0) {
            this.sprite.destroy(); 
            return true;           
        }
        return false;              
    }

    update() {
        if (!this.sprite || !this.sprite.active) return;

        // 左へ進む
        this.sprite.x += ENEMY_CONFIG.speedX; 

        // 連射タイマーのカウントダウン
        if (this.fireTimer > 0) {
            this.fireTimer--;
        }

        // タイマーが0になったら弾を発射
        if (this.fireTimer === 0) {
            // 敵の少し下から、4番目の穴に「true」を入れて敵の弾として発射
            const enemyBullet = new Bullet(this.scene, this.sprite.x, this.sprite.y + 25, true);
            this.bullets.push(enemyBullet);
            this.fireTimer = ENEMY_CONFIG.fireInterval;
        }
    }
}