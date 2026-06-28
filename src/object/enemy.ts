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

    // 初期座標
    private x: number;
    private y: number;

    // 生存フラグ
    public isAlive: boolean = true;

    // ライフ
    public life: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {

        this.scene = scene;

        this.x = x;
        this.y = y;

    }

    // ─── 敵を作成 ───
    create() {

        this.sprite = this.scene.add.rectangle(
            this.x,
            this.y,
            ENEMY_CONFIG.width,
            ENEMY_CONFIG.height,
            ENEMY_CONFIG.color
        );

        this.scene.physics.add.existing(this.sprite);

        this.life = ENEMY_CONFIG.maxLife;

        this.isAlive = true;

    }

    // ─── ダメージ ───
    public damage() {

        if (this.life > 0) {

            this.life--;

        }

    }

    // ─── 回復 ───
    public heal() {

        this.life++;

    }

    // ─── 爆発(削除) ───
    public explode(): boolean {

        if (this.life <= 0) {

            this.isAlive = false;

            this.sprite.destroy();

            return true;

        }

        return false;

    }

    // ─── 毎フレーム処理 ───
    update() {

        this.sprite.x += ENEMY_CONFIG.speedX;

    }

}