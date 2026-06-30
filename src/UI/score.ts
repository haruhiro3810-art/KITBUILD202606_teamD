export default class Score  {
    score!: number;
    scoreText!: Phaser.GameObjects.Text;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    scene: Phaser.Scene;
    constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, scene: Phaser.Scene) {
        this.cursors = cursors;
        this.scene = scene;
    }
    create() {
        this.score = 0;
        this.scoreText = this.scene.add.text(10, 10, 'score: 0');
        this.scoreText.setDepth(50);
    }
    update() {
        if (this.cursors.space?.isDown) {
            this.addScore();
        }
    }
    addScore() {
        this.score += 100;
        this.scoreText.setText('Score: ' + this.score);
    }
}