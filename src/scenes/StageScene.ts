import Phaser from 'phaser';
import Score from '../UI/score';
import Player from '../player/player';
import Enemy from '../object/enemy';
import Boss from '../object/boss';
import EnemyBullet from '../object/EnemyBullet';

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

    // ★敵弾をSceneで一括管理
    enemyBullets: EnemyBullet[] = [];

    constructor() {

        super('StageScene');

    }

    preload(): void {

        console.log("StageScene preload");

        this.load.setBaseURL('/');

        this.load.image("background","assets/background.png");
        this.load.image("background2","assets/background2.png");

    }

    create() {

        console.log("StageScene");

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.player = new Player(this.cursors,this);
        this.player.create();

        this.score = new Score(this.cursors,this);
        this.score.create();

        this.scrollSpeed = 120;

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

        this.enemyBullets = [];

    }

    update(_time:number,delta:number) {

        this.score.update();

        this.player.update();

        // 背景スクロール
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

        // 敵更新
        for (let i = this.enemies.length - 1; i >= 0; i--) {

            this.enemies[i].update();

        }

        // ボス更新
        if (this.boss) {

            this.boss.update();

        }

        // ★敵弾更新（敵が死んでも飛び続ける）
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {

            const bullet = this.enemyBullets[i];

            bullet.update();

            if (bullet.sprite.y > 650) {

                bullet.sprite.destroy();

                this.enemyBullets.splice(i,1);

            }

        }

        this.checkCollision();

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

            delay: 3000,

            loop: true,

            callback: () => {

                this.spawnEnemies1();

            }

        });

    }

    startPhase2() {

        this.spawnTimer.remove();

        this.spawnTimer = this.time.addEvent({

            delay: 3000,

            loop: true,

            callback: () => {

                this.spawnEnemies2();

            }

        });

    }

    startPhase3() {

        this.spawnTimer.remove();

        this.spawnTimer = this.time.addEvent({

            delay: 1000,

            loop: true,

            callback: () => {

                this.spawnEnemies1();

            }

        });

    }

    startPhase4() {

        this.spawnTimer.remove();

        this.spawnTimer = this.time.addEvent({

            delay: 1000,

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

            delay: 5000,

            loop: true,

            callback: () => {

                this.spawnEnemies3();

            }

        });

    }

    spawnEnemies1() {

        for (let i = 0; i < 3; i++) {

            const enemy = new Enemy(this, 850, 200);

            enemy.create();

            this.enemies.push(enemy);

        }

        console.log("敵の数:", this.enemies.length);

    }

    spawnEnemies2() {

        for (let i = 0; i < 5; i++) {

            const enemy = new Enemy(this, 850, 200);

            enemy.create();

            this.enemies.push(enemy);

        }

        console.log("敵の数:", this.enemies.length);

    }

    spawnBoss() {

        this.boss = new Boss(this, 400, -100);

        this.boss.create();

        console.log("ボス出現");

    }

    spawnEnemies3() {

        for (let i = 0; i < 2; i++) {

            const enemy = new Enemy(this, 850, 200);

            enemy.create();

            this.enemies.push(enemy);

        }

        console.log("敵の数:", this.enemies.length);

    }
    private checkCollision() {

    // ─── プレイヤー弾と敵 ───
    for (let i = this.enemies.length - 1; i >= 0; i--) {

        const enemy = this.enemies[i];

        for (let j = this.player.bullets.length - 1; j >= 0; j--) {

            const bullet = this.player.bullets[j];

            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    bullet.sprite.getBounds(),
                    enemy.sprite.getBounds()
                )
            ) {

                enemy.damage();

                bullet.sprite.destroy();
                this.player.bullets.splice(j, 1);

                if (enemy.explode()) {

                    this.enemies.splice(i, 1);

                    this.score.addScore();

                }

                break;

            }

        }

    }

    // ─── プレイヤー弾とボス ───
    if (this.boss && this.boss.isAlive) {

        for (let i = this.player.bullets.length - 1; i >= 0; i--) {

            const bullet = this.player.bullets[i];

            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    bullet.sprite.getBounds(),
                    this.boss.sprite.getBounds()
                )
            ) {

                this.boss.damage();

                bullet.sprite.destroy();

                this.player.bullets.splice(i, 1);

                this.boss.explode();

                break;

            }

        }

    }

    // ─── ボス弾とプレイヤー ───
    if (this.boss && this.boss.isAlive) {

        for (let i = this.boss.bullets.length - 1; i >= 0; i--) {

            const bullet = this.boss.bullets[i];

            if (
                Phaser.Geom.Intersects.RectangleToRectangle(
                    bullet.sprite.getBounds(),
                    this.player.player.getBounds()
                )
            ) {

                this.player.damage();

                bullet.sprite.destroy();

                this.boss.bullets.splice(i, 1);

                console.log("Player HP:", this.player.life);

                if (!this.player.isAlive()) {

                    console.log("GAME OVER");

                }

            }

        }

    }

    // ─── 敵弾とプレイヤー ───
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {

        const bullet = this.enemyBullets[i];

        if (
            Phaser.Geom.Intersects.RectangleToRectangle(
                bullet.sprite.getBounds(),
                this.player.player.getBounds()
            )
        ) {

            this.player.damage();

            bullet.sprite.destroy();

            this.enemyBullets.splice(i, 1);

            console.log("Player HP:", this.player.life);

            if (!this.player.isAlive()) {

                console.log("GAME OVER");

            }

        }

    }
    }
}