import Phaser from 'phaser';
import PlayerBullet from '../object/PlayerBullet';

const PLAYER_CONFIG = {
    width: 40,
    height: 40,
    color: 0x00ff00,
    moveSpeed: 5,
    fireInterval: 12,
    bulletOffsetY: 20,
    maxLife: 3
};

export default class Player {

    public player!: Phaser.GameObjects.Rectangle;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private scene!: Phaser.Scene;

    public bullets: PlayerBullet[] = [];
    public fireTimer: number = 0;
    public life: number = 0;

    constructor(
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        scene: Phaser.Scene
    ) {

        this.cursors = cursors;
        this.scene = scene;

    }

    create() {

        this.player = this.scene.add.rectangle(
            100,
            500,
            PLAYER_CONFIG.width,
            PLAYER_CONFIG.height,
            PLAYER_CONFIG.color
        );

        this.scene.physics.add.existing(this.player);

        this.bullets = [];

        this.life = PLAYER_CONFIG.maxLife;

    }

    // ライフを減らす
    public damage() {

        if (this.life > 0) {

            this.life--;

        }

    }

    // ライフを増やす
    public heal() {

        this.life++;

    }

    // 生きてるか死んでるか
    public isAlive(): boolean {

        return this.life > 0;

    }

    update() {

        // 右移動
        if (
            this.cursors.right?.isDown &&
            this.player.x + PLAYER_CONFIG.moveSpeed <= 780
        ) {

            this.player.x += PLAYER_CONFIG.moveSpeed;

        }

        // 左移動
        if (
            this.cursors.left?.isDown &&
            this.player.x - PLAYER_CONFIG.moveSpeed >= 20
        ) {

            this.player.x -= PLAYER_CONFIG.moveSpeed;

        }

        // 発射間隔
        if (this.fireTimer > 0) {

            this.fireTimer--;

        }

        const spaceKey =
            this.scene.input.keyboard?.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            );

        if (spaceKey?.isDown && this.fireTimer === 0) {

            const bullet = new PlayerBullet(
                this.scene,
                this.player.x,
                this.player.y - PLAYER_CONFIG.bulletOffsetY
            );

            bullet.create();

            this.bullets.push(bullet);

            this.fireTimer = PLAYER_CONFIG.fireInterval;

        }

        // 弾更新
        for (let i = this.bullets.length - 1; i >= 0; i--) {

            const bullet = this.bullets[i];

            bullet.update();

            if (bullet.sprite.y < -50) {

                bullet.sprite.destroy();

                this.bullets.splice(i, 1);

            }

        }

    }

}