import Phaser from 'phaser';
import EnemyBullet from './EnemyBullet';

// ─── ⚙️ ボスの設定 ───
const BOSS_CONFIG = {
    width: 100,
    height: 100,
    color: 0xff00ff,

    // 登場
    speedY: 2,
    stopY: 150,

    // 左右移動
    speedX: 3,
    leftLimit: 150,
    rightLimit: 650,

    // ライフ
    maxLife: 10,

    // 弾
    fireInterval: 90
};

export default class Boss {

    public sprite!: Phaser.GameObjects.Rectangle;

    private scene!: Phaser.Scene;

    private x: number;
    private y: number;

    // 生存フラグ
    public isAlive: boolean = true;

    // 無敵
    public isInvincible: boolean = true;

    // ライフ
    public life: number = 0;

    // 左右移動
    private direction: number = 1;

    // 発射タイマー
    private fireTimer: number = 0;

    // ボスの弾
    public bullets: EnemyBullet[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number) {

        this.scene = scene;

        this.x = x;
        this.y = y;

    }

    // ─── ボス生成 ───
    create() {

        this.sprite = this.scene.add.rectangle(
            this.x,
            this.y,
            BOSS_CONFIG.width,
            BOSS_CONFIG.height,
            BOSS_CONFIG.color
        );

        this.scene.physics.add.existing(this.sprite);

        this.life = BOSS_CONFIG.maxLife;

        this.isAlive = true;

        // 登場中は無敵
        this.isInvincible = true;

        this.fireTimer = 0;

        this.bullets = [];

    }

    // ─── ダメージ ───
    public damage() {

        if (this.isInvincible) {
            return;
        }

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
            this.sprite.y + BOSS_CONFIG.height / 2
        );

        bullet.create();

        this.bullets.push(bullet);

    }

    // ─── 毎フレーム処理 ───
    update() {

        // 上から登場
        if (this.sprite.y < BOSS_CONFIG.stopY) {

            this.sprite.y += BOSS_CONFIG.speedY;

            // 登場中は無敵
            this.isInvincible = true;

        }
        else {

            // 停止したら無敵解除
            this.isInvincible = false;

            // 左右移動
            this.sprite.x += BOSS_CONFIG.speedX * this.direction;

            if (this.sprite.x <= BOSS_CONFIG.leftLimit) {

                this.direction = 1;

            }

            if (this.sprite.x >= BOSS_CONFIG.rightLimit) {

                this.direction = -1;

            }

            // 発射タイマー
            this.fireTimer++;

            if (this.fireTimer >= BOSS_CONFIG.fireInterval) {

                this.shoot();

                this.fireTimer = 0;

            }

        }

        // ボス弾更新
        for (let i = this.bullets.length - 1; i >= 0; i--) {

            const bullet = this.bullets[i];

            bullet.update();

            if (bullet.sprite.y > 650) {

                bullet.sprite.destroy();

                this.bullets.splice(i, 1);

            }

        }

    }

}