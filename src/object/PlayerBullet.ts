import Phaser from 'phaser';

// ─── ⚙️ プレイヤー弾の設定 ───
const PLAYER_BULLET_CONFIG = {
    width: 10,
    height: 20,
    color: 0x00ffff,
    speedY: -12
};

export default class PlayerBullet {

    public sprite!: Phaser.GameObjects.Rectangle;

    private scene!: Phaser.Scene;

    private x: number;
    private y: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {

        this.scene = scene;

        this.x = x;
        this.y = y;

    }

    // ─── プレイヤー弾生成 ───
    create() {

        this.sprite = this.scene.add.rectangle(
            this.x,
            this.y,
            PLAYER_BULLET_CONFIG.width,
            PLAYER_BULLET_CONFIG.height,
            PLAYER_BULLET_CONFIG.color
        );

        this.scene.physics.add.existing(this.sprite);

    }

    // ─── 毎フレーム処理 ───
    update() {

        this.sprite.y += PLAYER_BULLET_CONFIG.speedY;

    }

}