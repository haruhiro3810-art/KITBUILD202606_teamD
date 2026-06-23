import Phaser from 'phaser';

// ─── ⚙️ 敵の設定 ───
const ENEMY_CONFIG = {
    width: 40,
    height: 40,
    color: 0xff0000,   
    speedX: -3,        
    maxLife: 1         
};

export default class Enemy {
    public sprite!: Phaser.GameObjects.Rectangle;
    private scene!: Phaser.Scene;
    public life: number = 0; 

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        
        // 出現位置（x, y）に赤い四角形を作る
        this.sprite = this.scene.add.rectangle(x, y, ENEMY_CONFIG.width, ENEMY_CONFIG.height, ENEMY_CONFIG.color);
        this.scene.physics.add.existing(this.sprite); 

        this.life = ENEMY_CONFIG.maxLife; 
    }

    public damage() {
        if (this.life > 0) { this.life--; }
    }

    public heal() {
        this.life++;
    }

    public explode(): boolean {
        if (this.life <= 0) {
            this.sprite.destroy(); 
            return true;           
        }
        return false;              
    }

    update() {
        this.sprite.x += ENEMY_CONFIG.speedX; 
    }
}