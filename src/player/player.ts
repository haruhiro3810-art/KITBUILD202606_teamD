import Phaser from 'phaser';
// 💡 分けた弾のファイルを読み込む
import Bullet from '../object/bullet.ts';

// ─── ⚙️ ここを変えるとプレイヤーの設定が変わる ───
const PLAYER_CONFIG = {
    width: 40,         // 🚀 プレイヤーの横幅
    height: 40,        // 🚀 プレイヤーの縦幅
    color: 0x00ff00,   // 🚀 プレイヤーの色（緑）
    moveSpeed: 5,      // 🚀 プレイヤーの動くスピード
    fireInterval: 12,  // 🔫 弾の連射スピード（数字を小さくすると超連射になる）
    bulletOffsetY: 20, // 🔫 弾をプレイヤーのちょっと上から出すための隙間
    maxLife: 3         // ❤️ ライフの最大値（最初は3機スタートにする）
};

// 🚀 プレイヤーを動かすためのメインの仕組み
export default class Player {
    private player!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private scene!: Phaser.Scene;

    // 弾を管理するための入れ物
    public bullets: Bullet[] = []; // 撃った弾を全部覚えさせておく配列
    public fireTimer: number = 0;   // 弾が連射されすぎないように制限する用のタイマー

    // ❤️ 新しく作ったライフ用の変数
    public life: number = 0;

    constructor(
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        scene: Phaser.Scene
    ) {
        this.cursors = cursors;
        this.scene = scene;
    }

    // 最初に1回だけ動く、プレイヤーを作る処理
    create() {
        // 設定したサイズと色で緑の四角形を作る
        this.player = this.scene.add.rectangle(
            100, 
            500, 
            PLAYER_CONFIG.width, 
            PLAYER_CONFIG.height, 
            PLAYER_CONFIG.color
        );
        this.scene.physics.add.existing(this.player); // 当たり判定とかで使う物理エンジンに登録

        this.bullets = [];

        // ❤️ ゲーム開始時にライフを満タン（3）にする
        this.life = PLAYER_CONFIG.maxLife;
    }

    // 💥 敵の弾に当たった時などに、ライフを1減らす関数
    public damage() {
        if (this.life > 0) {
            this.life--; // ライフを1減らす
        }
    }

    // 🟢 アイテムを拾った時などに、ライフを1増やす関数
    public heal() {
        this.life++; // ライフを1増やす
    }

    // ⚖️ いま生きてるかどうかをチェックする関数（0より多ければtrue、0ならfalseを返す）
    public isAlive(): boolean {
        if (this.life > 0) {
            return true;  // 生きてる
        } else {
            return false; // ゲームオーバー
        }
    }

    // ゲーム中、ずーっとループして動き続ける処理
    update() {
        // 🕹️ キーボードの左右でプレイヤーを動かす処理
        if (this.cursors.right?.isDown && this.player.x + PLAYER_CONFIG.moveSpeed <= 780) {
            this.player.x += PLAYER_CONFIG.moveSpeed;
        }
        if (this.cursors.left?.isDown && this.player.x - PLAYER_CONFIG.moveSpeed >= 20) {
            this.player.x -= PLAYER_CONFIG.moveSpeed;
        }

        // 🔫 スペースキーで弾を撃つ処理
        if (this.fireTimer > 0) {
            this.fireTimer--; // 次に弾を撃てるまでの待ち時間を減らしていく
        }

        // 直接スペースキーの状態を見る
        const spaceKeyObj = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const isSpaceDown = spaceKeyObj?.isDown;

        // スペースが押されていて、待ち時間が0なら弾を発射する
        if (isSpaceDown && this.fireTimer === 0) {
            const bullet = new Bullet(this.scene, this.player.x, this.player.y - PLAYER_CONFIG.bulletOffsetY);
            this.bullets.push(bullet); // 作った弾を配列に保存する

            this.fireTimer = PLAYER_CONFIG.fireInterval; // 待ち時間をリセット
        }

        // 🌐 画面に出ている弾を全部動かして、消す処理
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.update(); // 弾を上に動かす

            // もし弾が上の画面の外に飛び出したら、消して配列からも削除する
            if (b.sprite.y < -50) {
                b.sprite.destroy();
                this.bullets.splice(i, 1);
            }
        }
    }
}