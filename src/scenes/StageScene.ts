import Phaser from 'phaser';
import Score from '../UI/score';
import Player from '../player/player';
import Enemy from '../object/enemy';
import Boss from '../object/boss';

export default class StageScene extends Phaser.Scene {
    player!: Player;
    boss!: Boss;

    private score!: Score;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    scrollSpeed!: number;
    background!: Phaser.GameObjects.Image;
    background2!: Phaser.GameObjects.Image;

    gameTime!: number;
    phase!: number;

    phase1Started = false;
    phase2Started = false;
    phase3Started = false;
    phase4Started = false;
    phase5Started = false;

    spawnTimer!: Phaser.Time.TimerEvent;

    enemies: Enemy[] = [];

    constructor() {
        super('StageScene');
    }

    // 背景画像の読み込み
    preload(): void {

        console.log("StageScene preload");

        this.load.setBaseURL('/');

        this.load.image("background", "assets/background.png");
        this.load.image("background2", "assets/background2.png");

    }

    // プレイヤーの作成とスコアの初期化
    create() {

        console.log("StageScene");

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.player = new Player(this.cursors, this);
        this.player.create();

        this.score = new Score(this.cursors, this);
        this.score.create();

        // 背景画像の初期位置とスクロール速度を設定
        this.scrollSpeed = 120;

        // 背景画像を追加
        this.background = this.add.image(
            400,
            300,
            "background"
        );

        this.background2 = this.add.image(
            400,
            this.background.y - this.background.height,
            "background2"
        );

        this.background.setDepth(0);
        this.background2.setDepth(0);

        this.gameTime = 0;

        this.phase = 0;

    }

    // プレイヤーの移動処理
    update(_time: number, delta: number) {

        this.score.update();

        this.player.update();

        // 背景画像のスクロール処理
        this.background.y += this.scrollSpeed * (delta / 1000);
        this.background2.y += this.scrollSpeed * (delta / 1000);

        if (this.background.y >= 1140) {
            this.background.y =
                this.background2.y - this.background2.height;
        }

        if (this.background2.y >= 1140) {
            this.background2.y =
                this.background.y - this.background.height;
        }

        this.gameTime = this.time.now / 1000;

        this.phaseUpdate();

        this.handlePhase();
                for (let i = this.enemies.length - 1; i >= 0; i--) {

            const enemy = this.enemies[i];

            enemy.update();

            //if (enemy.sprite.y > 650) {
            //    enemy.sprite.destroy();
            //    this.enemies.splice(i, 1);
            //}

        }

        if (this.boss) {

            this.boss.update();

        }

    }

    phaseUpdate() {

        if (this.gameTime < 6) {

            this.phase = 0;

        }
        else if (this.gameTime < 21) {

            this.phase = 1;

        }
        else if (this.gameTime < 36) {

            this.phase = 2;

        }
        else if (this.gameTime < 41) {

            this.phase = 3;

        }
        else if (this.gameTime < 46) {

            this.phase = 4;

        }
        else if (this.gameTime < 52) {

            this.phase = 5;

        }

    }

    // 敵の出現処理
    handlePhase() {

        //↓フラグ
        if (this.phase === 1 && !this.phase1Started) {

            this.phase1Started = true;

            this.startPhase1();

        }

        if (this.phase === 2 && !this.phase2Started) {

            this.phase2Started = true;

            this.startPhase2();

        }

        if (this.phase === 3 && !this.phase3Started) {

            this.phase3Started = true;

            this.startPhase3();

        }

        if (this.phase === 4 && !this.phase4Started) {

            this.phase4Started = true;

            this.startPhase4();

        }

        if (this.phase === 5 && !this.phase5Started) {

            this.phase5Started = true;

            this.startPhase5();

        }

    }
    startPhase1() {

    this.spawnTimer = this.time.addEvent({

        delay: 3000, // 3秒ごとに敵を出現させる
        loop: true,

        callback: () => {

            this.spawnEnemies1();

        }

    });

}

startPhase2() {

    this.spawnTimer.remove();

    this.spawnTimer = this.time.addEvent({

        delay: 3000, // 3秒ごとに敵を出現させる
        loop: true,

        callback: () => {

            this.spawnEnemies2();

        }

    });

}

startPhase3() {

    this.spawnTimer.remove();

    this.spawnTimer = this.time.addEvent({

        delay: 1000, // 1秒ごとに敵を出現させる
        loop: true,

        callback: () => {

            this.spawnEnemies1();

        }

    });

}

startPhase4() {

    this.spawnTimer.remove();

    this.spawnTimer = this.time.addEvent({

        delay: 1000, // 1秒ごとに敵を出現させる
        loop: true,

        callback: () => {

            this.spawnEnemies2();

        }

    });

}

startPhase5() {

    this.spawnTimer.remove();

    this.spawnBoss();

    this.spawnTimer = this.time.addEvent({

        delay: 5000, // 5秒ごとに敵を出現させる
        loop: true,

        callback: () => {

            this.spawnEnemies3();

        }

    });

}

spawnEnemies1() {

    for (let i = 0; i < 3; i++) {

        const enemy = new Enemy(
            this,
            850,
            Phaser.Math.Between(50, 550)
        );

        enemy.create();

        this.enemies.push(enemy);

    }

    console.log("敵の数:", this.enemies.length);

}

spawnEnemies2() {

    for (let i = 0; i < 5; i++) {

        const enemy = new Enemy(
            this,
            850,
            Phaser.Math.Between(50, 550)
        );

        enemy.create();

        this.enemies.push(enemy);

    }

    console.log("敵の数:", this.enemies.length);

}

spawnBoss() {

    this.boss = new Boss(
        this,
        400,
        -100
    );

    this.boss.create();

    console.log("ボス出現");

}

spawnEnemies3() {

    for (let i = 0; i < 2; i++) {

        const enemy = new Enemy(
            this,
            850,
            Phaser.Math.Between(50, 550)
        );

        enemy.create();

        this.enemies.push(enemy);

    }

    console.log("敵の数:", this.enemies.length);

}

}