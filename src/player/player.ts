import Phaser from 'phaser';
import Bullet from '../object/bullet';

export default class Player {
    private scene: Phaser.Scene;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private player!: Phaser.GameObjects.Rectangle; // 🟢 プレイヤーの本体
    
    public bullets: Bullet[] = [];
    public life: number = 3; // プレイヤーの体力

    constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene: Phaser.Scene) {
        this.cursors = cursors;
        this.scene = scene;
    }

    create() {
        // 画面の下の方（X: 400, Y: 500）に緑色のプレイヤーを作成
        this.player = this.scene.add.rectangle(400, 500, 40, 40, 0x00ff00);
        this.scene.physics.add.existing(this.player);
        
        // 画面外に出ないように壁を突き抜けない設定
        if (this.player.body instanceof Phaser.Physics.Arcade.Body) {
            this.player.body.setCollideWorldBounds(true);
        }
    }

    public damage() {
        if (this.life > 0) {
            this.life--;
        }
    }

    update() {
        if (!this.player || !this.player.active) return;

        const body = this.player.body as Phaser.Physics.Arcade.Body;
        if (!body) return;

        // キーボード移動処理（上下左右）
        body.setVelocity(0);

        if (this.cursors.left.isDown) {
            body.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            body.setVelocityX(300);
        }

        if (this.cursors.up.isDown) {
            body.setVelocityY(-300);
        } else if (this.cursors.down.isDown) {
            body.setVelocityY(300);
        }

        // スペースキーで弾を発射する処理（お友達のコードにある場合はそちらに合わせてください）
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            // プレイヤーの弾（4番目の穴は何も入れない＝自動で上に行く）
            const playerBullet = new Bullet(this.scene, this.player.x, this.player.y - 25);
            this.bullets.push(playerBullet);
        }

        // 自分が撃った弾の移動と画面外お掃除
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