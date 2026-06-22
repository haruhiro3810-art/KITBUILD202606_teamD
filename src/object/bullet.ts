import Phaser from 'phaser';

// ─── ⚙️ 弾の設定 ───
const BULLET_CONFIG = {
    radius: 6,         // 🟡 弾の大きさ（半径）
    color: 0xfbc531,   // 🟡 弾の色（黄色）
    speedY: -12        // 🟡 弾のスピード（マイナスを大きくすると速くなる）
};

// 🟡 弾（たま）を作るための仕組み
export default class Bullet {
    public sprite: Phaser.GameObjects.Arc;
    private speedY: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // 設定を使って、丸い弾を画面に出す
        this.sprite = scene.add.circle(x, y, BULLET_CONFIG.radius, BULLET_CONFIG.color);
        this.speedY = BULLET_CONFIG.speedY;
    }

    // 弾を動かす処理
    update() {
        this.sprite.y += this.speedY; // 毎フレーム上に進める
    }
}