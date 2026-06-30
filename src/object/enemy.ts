import Phaser from 'phaser';
import EnemyBullet from './EnemyBullet';

// ─── ⚙️ 敵の設定 ───
const ENEMY_CONFIG = {
    width: 40,
    height: 40,
    color: 0xff0000,

    speedX: -3,

    maxLife: 6,

    // 弾
    fireInterval: 90
};

export default class Enemy {

    public sprite!: Phaser.Physics.Arcade.Sprite;

    private scene!: Phaser.Scene;

    // 初期座標
    private x: number;
    private y: number;

    // 生存フラグ
    public isAlive: boolean = true;

    // ライフ
    public life: number = 0;

    // 発射タイマー
    private fireTimer: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {

        this.scene = scene;

        this.x = x;
        this.y = y;

    }

    // ─── 敵を作成 ───
    create() {

        this.sprite = this.scene.physics.add.sprite(
    this.x,
    this.y,
    "enemy"
);
this.sprite.setScale(0.15);
        this.scene.physics.add.existing(this.sprite);

        this.life = ENEMY_CONFIG.maxLife;

        this.isAlive = true;

        this.fireTimer = 0;

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

    // ─── 弾を撃つ ───
    private shoot() {

        const bullet = new EnemyBullet(
            this.scene,
            this.sprite.x,
            this.sprite.y
        );

        bullet.create();

        // StageSceneのenemyBulletsへ追加
        (this.scene as any).enemyBullets.push(bullet);

    }

    // ─── 毎フレーム処理 ───
    update() {

        // 左へ移動
        this.sprite.x += ENEMY_CONFIG.speedX;

        // 発射タイマー
        this.fireTimer++;

        if (this.fireTimer >= ENEMY_CONFIG.fireInterval) {

            this.shoot();

            this.fireTimer = 0;

        }

    }

}