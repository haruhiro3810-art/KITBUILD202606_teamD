import Phaser from 'phaser';

// ─── ⚙️ 敵弾の設定 ───
const ENEMY_BULLET_CONFIG = {
    width: 10,
    height: 20,
    color: 0xffff00,
    speedY: 5
};

export default class EnemyBullet {

   public sprite!: Phaser.Physics.Arcade.Sprite;
    private scene!: Phaser.Scene;

    private x: number;
    private y: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {

        this.scene = scene;

        this.x = x;
        this.y = y;

    }

    // ─── 敵弾生成 ───
    create() {

        this.sprite = this.scene.physics.add.sprite(
    this.x,
    this.y,
    "enemyBullet"
);
this.sprite.setScale(0.10);
        this.scene.physics.add.existing(this.sprite);

    }

    // ─── 毎フレーム処理 ───
    update() {

        this.sprite.y += ENEMY_BULLET_CONFIG.speedY;

    }

}