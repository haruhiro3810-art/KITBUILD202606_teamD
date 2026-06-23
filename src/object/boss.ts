import Phaser from 'phaser';

// ─── ⚙️ ボスの設定 ───
const BOSS_CONFIG = {
    width: 100,        
    height: 100,       
    color: 0xff00ff,   
    speedY: 2,         
    stopY: 150,        
    maxLife: 10        
};

export default class Boss {
    public sprite!: Phaser.GameObjects.Rectangle;
    private scene!: Phaser.Scene;
    public life: number = 0; 

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        
        // 出現位置（x, y）に大きい紫の四角形を作る
        this.sprite = this.scene.add.rectangle(x, y, BOSS_CONFIG.width, BOSS_CONFIG.height, BOSS_CONFIG.color);
        this.scene.physics.add.existing(this.sprite); 

        this.life = BOSS_CONFIG.maxLife; 
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
        if (this.sprite.y < BOSS_CONFIG.stopY) {
            this.sprite.y += BOSS_CONFIG.speedY; 
        }
    }
}