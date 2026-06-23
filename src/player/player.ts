import Phaser from 'phaser';
import Bullet from '../object/bullet.ts';

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
    private player!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private scene!: Phaser.Scene;

    public bullets: Bullet[] = [];
    public fireTimer: number = 0;
    public life: number = 0; 

    constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene: Phaser.Scene) {
        this.cursors = cursors;
        this.scene = scene;
    }

    create() {
        this.player = this.scene.add.rectangle(100, 500, PLAYER_CONFIG.width, PLAYER_CONFIG.height, PLAYER_CONFIG.color);
        this.scene.physics.add.existing(this.player);

        this.bullets = [];
        this.life = PLAYER_CONFIG.maxLife; 
    }

    //  ライフを減らす
    public damage() {
        if (this.life > 0) {
            this.life--; // ライフを1減らす
        }
    }

    //  ライフを増やす
    public heal() {
        this.life++; // ライフを1増やす
    }

    //  生きてるか死んでるか 【ライフが0かどうか】
    public isAlive(): boolean {
        return this.life > 0; // 0より大きければtrue、0ならfalse
    }

    update() {
        if (this.cursors.right?.isDown && this.player.x + PLAYER_CONFIG.moveSpeed <= 780) {
            this.player.x += PLAYER_CONFIG.moveSpeed;
        }
        if (this.cursors.left?.isDown && this.player.x - PLAYER_CONFIG.moveSpeed >= 20) {
            this.player.x -= PLAYER_CONFIG.moveSpeed;
        }

        if (this.fireTimer > 0) {
            this.fireTimer--;
        }

        const spaceKeyObj = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const isSpaceDown = spaceKeyObj?.isDown;

        if (isSpaceDown && this.fireTimer === 0) {
            const bullet = new Bullet(this.scene, this.player.x, this.player.y - PLAYER_CONFIG.bulletOffsetY);
            this.bullets.push(bullet);
            this.fireTimer = PLAYER_CONFIG.fireInterval;
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.update();
            if (b.sprite.y < -50) {
                b.sprite.destroy();
                this.bullets.splice(i, 1);
            }
        }
    }
}