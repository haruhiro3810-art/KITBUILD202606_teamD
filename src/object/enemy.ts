import Phaser from 'phaser';

// ─── ⚙️ 敵の設定 ───
const ENEMY_CONFIG = {
    width: 40,
    height: 40,
    color: 0xff0000,   // 👿 敵の色は赤
    speedY: 2,         // 👿 下に向かって進むスピード
    maxLife: 1         // 👾 設計図通りライフは1
};

export default class Enemy {
    public sprite!: Phaser.GameObjects.Rectangle;
    private scene!: Phaser.Scene;
    public life: number = 0; // 👾 敵の今のライフを入れる変数

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        
        // 赤い四角形の敵を作る
        this.sprite = this.scene.add.rectangle(x, y, ENEMY_CONFIG.width, ENEMY_CONFIG.height, ENEMY_CONFIG.color);
        this.scene.physics.add.existing(this.sprite); // 当たり判定のために物理エンジンに登録

        this.life = ENEMY_CONFIG.maxLife; // ライフを1にする
    }

    // 💥 ライフを減らす()
    public damage() {
        if (this.life > 0) {
            this.life--;
        }
    }

    // 🟢 ライフを増やす()
    public heal() {
        this.life++;
    }

    // 💥 爆散する() 【ライフが0かどうか】
    public explode(): boolean {
        if (this.life <= 0) {
            this.sprite.destroy(); // 画面から消す
            return true;           // 爆散した！
        }
        return false;              // まだ生きてる
    }

    // 敵を動かす処理
    update() {
        this.sprite.y += ENEMY_CONFIG.speedY; // 毎フレーム下にちょっとずつ進める
    }
}