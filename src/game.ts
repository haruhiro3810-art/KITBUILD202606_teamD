import Phaser from 'phaser';

/**
 * 【メインゲームシーンクラス】
 * 画面上の文字UIを一切排除した、ストイックな縦スクロールシューティングゲーム。
 * ザコ敵の連携行動、自機狙い弾、ボスの無敵登場演出＆発狂弾幕を搭載。
 */
export default class MyGameScene extends Phaser.Scene {
    constructor() {
        super('MyGameScene');
    }

    // ─── 📐 型定義（変数の中身の宣言） ───
    private player: any;                        // プレイヤーの数値データ
    private enemies: any[] = [];                // 画面上の敵を管理する配列
    private playerBullets: any;                  // プレイヤーと分身の弾を管理する配列
    private enemyBullets: any;                  // 敵の弾を管理する配列
    private items: any;                         // パワーアップアイテムを管理する配列
    private options: any;                       // 分身（オプション）の座標データ配列
    private cursors: any;                       // 矢印キーの入力を管理するオブジェクト
    private spaceKey: any;                      // スペースキーの入力を管理するオブジェクト
    private optionSettings: any;                // 分身と分身の弾の基本設定

    private playerGraphic: any;                 // プレイヤーの見た目（青い四角）
    private optionGraphics: any = [];           // 分身の見た目を管理する配列
    private playerHistory: { x: number, y: number }[] = []; // 分身の追従用にプレイヤーの過去の座標を記録する配列

    private enemySpawnQueue: any[] = [];        // 敵の出現スケジュール（待ち行列）
    private spawnTimer: number = 0;             // 次の敵を出すための時間カウント用タイマー
    private boss: any = null;                   // ボスの数値データ（出現前はnull）
    private bossGraphic: any = null;            // ボスの見た目（赤い長方形）
    private lastSpawnX: number = 300;           // 赤い連隊敵を縦に並べるために、直前のX座標を記憶する変数

    /**
     * 【create メソッド】
     * ゲーム開始時に1度だけ実行される、初期化・準備を行う場所。
     */
    create() {
        // 🎨 画面の背景色を設定（暗い灰色。#000000 にすれば真っ黒になります）
        this.cameras.main.setBackgroundColor('#1a1a1a');

        // 🚀 【プレイヤー（自機）のパラメータ調整】
        this.player = {
            width: 16, height: 32,              // 自機のサイズ（横幅、縦幅）
            x: 300, y: 700,                     // 初期出現位置（X座標、Y座標）
            speedX: 5, speedY: 5,               // 移動速度（数値を大きくすると速くなる）
            hp: 5,                              // プレイヤーの体力（0になるとゲームオーバー）
            invincibleTimer: 0,                 // 被弾後の無敵時間カウント用
            powerLevel: 0,                      // パワーアップ段階（アイテムを取ると増える）
            bulletWidthCustom: 8, bulletHeight: 16, // 通常弾のサイズ
            bulletSpeed: -12,                   // 通常弾の速度（マイナスで上方向へ飛ぶ。大きくすると高速化）
            fireInterval: 10,                   // 弾の連射間隔（数値を小さくすると超連射になる）
            fireTimer: 0,                       // 連射制御用のタイマー
            strongBulletWidth: 16, strongBulletHeight: 24, // パワーアップ弾のサイズ
            strongBulletSpeed: -16              // パワーアップ弾の速度
        };

        // 🛸 【分身（オプション）のパラメータ調整】
        this.optionSettings = { 
            width: 12, height: 12,              // 分身のサイズ
            bulletWidth: 6, bulletHeight: 12    // 分身が撃つ弾のサイズ
        };

        // 各種配列・タイマーの初期化
        this.playerBullets = []; 
        this.enemyBullets = []; 
        this.items = []; 
        this.options = []; 
        this.optionGraphics = []; 
        this.playerHistory = [];
        this.enemies = [];
        this.spawnTimer = 0;
        this.boss = null;
        this.bossGraphic = null;

        // 分身の追従用に、あらかじめ100コマ分の初期座標で歴史を埋めておく
        for (let i = 0; i < 100; i++) {
            this.playerHistory.push({ x: this.player.x, y: this.player.y });
        }

        // プレイヤーのグラフィックを画面に生成（水色: 0x00a8ff）
        this.playerGraphic = this.add.rectangle(this.player.x, this.player.y, this.player.width, this.player.height, 0x00a8ff);
        this.playerGraphic.setOrigin(0);

        // ─── 📦 【敵の出現スケジュール・パラメータ設定】 ───
        // type: 'normal'（赤・ザコ）、'fast'（黄・自機狙い）、'hard'（紫・中ボス拡散弾）
        // hp: 敵の耐久力 / speedX: 左右の移動速度 / offsetY: 連隊を作るための縦のズレ
        this.enemySpawnQueue = [
            // ① 開幕：赤い敵が4体、同じX座標から縦に綺麗に数珠つなぎで出現
            { type: 'normal', color: 0xe84118, hp: 3, speedX: 3, speedY: 0.2, offsetY: 0 },
            { type: 'normal', color: 0xe84118, hp: 3, speedX: 3, speedY: 0.2, offsetY: -40 },  // 上に40pxズラす
            { type: 'normal', color: 0xe84118, hp: 3, speedX: 3, speedY: 0.2, offsetY: -80 },  // 上に80pxズラす
            { type: 'normal', color: 0xe84118, hp: 3, speedX: 3, speedY: 0.2, offsetY: -120 }, // 上に120pxズラす

            // ② 黄色い高速機（プレイヤーの位置をピンポイントで狙ってくるスナイパー）が2体同時進入
            { type: 'fast',   color: 0xeccc68, hp: 2, speedX: 6, speedY: 0.1, offsetY: 0 },
            { type: 'fast',   color: 0xeccc68, hp: 2, speedX: -5, speedY: 0.1, offsetY: -30 },

            // ③ 3方向弾をバラまく危険な紫の中ボスが降臨
            { type: 'hard',   color: 0x9c88ff, hp: 15, speedX: 2, speedY: 0.2, offsetY: 0 },

            // ④ 後半戦：再び赤い4連隊 ＋ 黄色いスナイパーの複合波状攻撃
            { type: 'normal', color: 0xe84118, hp: 3, speedX: -3, speedY: 0.2, offsetY: 0 },
            { type: 'normal', color: 0xe84118, hp: 3, speedX: -3, speedY: 0.2, offsetY: -40 },
            { type: 'normal', color: 0xe84118, hp: 3, speedX: -3, speedY: 0.2, offsetY: -80 },
            { type: 'normal', color: 0xe84118, hp: 3, speedX: -3, speedY: 0.2, offsetY: -120 },
            { type: 'fast',   color: 0xeccc68, hp: 3, speedX: 7, speedY: 0.1, offsetY: -20 },
            
            // ⑤ ボス直前の壁：さらに硬くなった強化紫中ボス
            { type: 'hard',   color: 0x9c88ff, hp: 20, speedX: -2.5, speedY: 0.2, offsetY: 0 }
        ];

        // キーボード入力（矢印キーとスペースキー）の有効化
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        }
    }

    /**
     * 【update メソッド】
     * ゲーム実行中に1秒間に60回（60fps）ループで呼び出され続ける、メインの処理。
     */
    update() {
        // 🛡️ プレイヤーの被弾後無敵タイマーのカウントダウンと点滅処理
        if (this.player.invincibleTimer > 0) {
            this.player.invincibleTimer--;
            // 4フレームごとに透明度（alpha）を切り替えてチカチカ点滅させる
            this.playerGraphic.alpha = (this.player.invincibleTimer % 4 < 2) ? 0.2 : 1.0;
        } else {
            this.playerGraphic.alpha = 1.0; // 通常時は不透明
        }

        // 🕹️ 【自機の移動制御】
        let isMoving = false;
        if (this.cursors.up.isDown)    { this.player.y -= this.player.speedY; isMoving = true; } // 上移動
        if (this.cursors.down.isDown)  { this.player.y += this.player.speedY; isMoving = true; } // 下移動
        if (this.cursors.left.isDown)  { this.player.x -= this.player.speedX; isMoving = true; } // 左移動
        if (this.cursors.right.isDown) { this.player.x += this.player.speedX; isMoving = true; } // 右移動

        // 画面外に出ていかないように上下左右をロック（600x800の画面幅）
        this.player.x = Phaser.Math.Clamp(this.player.x, 0, 600 - this.player.width);
        this.player.y = Phaser.Math.Clamp(this.player.y, 0, 800 - this.player.height);
        this.playerGraphic.x = this.player.x; this.playerGraphic.y = this.player.y;

        // 🐍 移動している時だけ自機の位置の歴史（軌跡）を記録（分身の追従用）
        if (isMoving) {
            this.playerHistory.unshift({ x: this.player.x, y: this.player.y }); // 配列の先頭に追加
            if (this.playerHistory.length > 200) this.playerHistory.pop();     // 古い歴史は削除
        }

        // 🛸 【分身（オプション）の移動：グラディウス方式の追従】
        for (let i = 0; i < this.options.length; i++) {
            let delay = (i + 1) * 15; // 15フレーム前の自機の位置を参照（数値を大きくすると間隔が広がる）
            if (delay < this.playerHistory.length) {
                let point = this.playerHistory[delay];
                let opt = this.options[i];
                // 自機の中心位置に合うように計算して配置
                opt.x = point.x + (this.player.width / 2) - (this.optionSettings.width / 2);
                opt.y = point.y + (this.player.height / 2) - (this.optionSettings.height / 2);
                this.optionGraphics[i].x = opt.x; this.optionGraphics[i].y = opt.y;
            }
        }

        // ─── ⏱️ 【ザコ敵の時間差出現（スポーン）システム】 ───
        if (this.enemySpawnQueue.length > 0) {
            this.spawnTimer++;
            // 60コマ（約1秒）ごとにキューから次の敵を1体ずつ引っ張り出して画面に出す
            // ※「30」に変えると、2倍の超ハイペースで敵が次々エントリーするようになります
            if (this.spawnTimer >= 60) {
                this.spawnTimer = 0;
                let t = this.enemySpawnQueue.shift(); // 先頭の出現データを取得
                
                // 連隊の先頭（offsetY === 0）の時だけランダムな横位置（X）を決める
                // 2体目以降（offsetYがマイナス）は先頭と同じX座標を使うことで縦に綺麗な列になる
                if (t.offsetY === 0) {
                    this.lastSpawnX = Phaser.Math.Between(100, 500); // 画面の左右端に寄りすぎないランダム位置
                }

                let spawnY = -40 + t.offsetY; // 画面上部の見えない位置に配置
                let graphic = this.add.rectangle(this.lastSpawnX, spawnY, 24, 24, t.color);
                graphic.setOrigin(0);

                // 敵のリアルタイム動的データを生成して管理配列に入れる
                this.enemies.push({
                    type: t.type, width: 24, height: 24, x: this.lastSpawnX, y: spawnY,
                    speedX: t.speedX, speedY: 3,
                    targetMinY: Phaser.Math.Between(60, 220), // どこまで画面内に降りてきてうろつくか
                    hp: t.hp, maxHp: t.hp, isAlive: true, graphic: graphic,
                    // 紫中ボスなら遅め(100コマ)、その他はランダム(60〜90コマ)の弾発射ペース
                    fireInterval: t.type === 'hard' ? 100 : Phaser.Math.Between(60, 90), fireTimer: 0,
                    survivalTimer: 660, // 画面内にいられる寿命（約11秒経ったら上へ逃げていく）
                    isRetreating: false
                });
            }
        }

        // ─── 🔫 【プレイヤーと分身の弾発射処理】 ───
        if (this.player.fireTimer > 0) this.player.fireTimer--;
        if (this.spaceKey.isDown && this.player.fireTimer === 0) {
            // 弾のデータを生成するインナー関数
            const createBullet = (bx: number, by: number, bw: number, bh: number, bs: number) => {
                let bGraphic = this.add.rectangle(bx, by, bw, bh, 0xfbc531); bGraphic.setOrigin(0); // 黄色い弾
                this.playerBullets.push({ x: bx, y: by, width: bw, height: bh, speedY: bs, graphic: bGraphic });
            };

            // パワーレベルに応じた自機のショット分岐
            if (this.player.powerLevel === 0) {
                // 初期状態：センターから1発
                createBullet(this.player.x + this.player.width / 2 - 4, this.player.y - 16, this.player.bulletWidthCustom, this.player.bulletHeight, this.player.bulletSpeed);
            } else if (this.player.powerLevel === 1) {
                // パワー1：自機の両脇から2連装ショット
                createBullet(this.player.x, this.player.y - 16, this.player.bulletWidthCustom, this.player.bulletHeight, this.player.bulletSpeed);
                createBullet(this.player.x + this.player.width - 8, this.player.y - 16, this.player.bulletWidthCustom, this.player.bulletHeight, this.player.bulletSpeed);
            } else if (this.player.powerLevel >= 2) {
                // パワー2以上：中央から極太の強力弾幕
                createBullet(this.player.x + this.player.width / 2 - 8, this.player.y - 24, this.player.strongBulletWidth, this.player.strongBulletHeight, this.player.strongBulletSpeed);
            }

            // 分身（オプション）がいれば、分身の位置からも同時に弾を発射
            for (let i = 0; i < this.options.length; i++) {
                let opt = this.options[i];
                if (this.player.powerLevel === 0 || this.player.powerLevel === 1) {
                    createBullet(opt.x + this.optionSettings.width / 2 - 3, opt.y - 12, this.optionSettings.bulletWidth, this.optionSettings.bulletHeight, this.player.bulletSpeed);
                } else if (this.player.powerLevel >= 2) {
                    createBullet(opt.x + this.optionSettings.width / 2 - 6, opt.y - 18, this.player.strongBulletWidth, this.player.strongBulletHeight, this.player.strongBulletSpeed);
                }
            }
            this.player.fireTimer = this.player.fireInterval; // 再装填タイマーをリセット
        }

        // ─── 👾 【ザコ敵・中ボスのAI・攻撃ルーチン】 ───
        this.enemies.forEach((enemy) => {
            if (!enemy.isAlive) return;

            // ■ 1. 敵の弾発射攻撃AI
            if (!enemy.isRetreating && enemy.y > 40) { // 画面の一番上にいる時と撤退中は撃たない
                if (enemy.fireTimer > 0) enemy.fireTimer--;
                if (enemy.fireTimer === 0) {
                    
                    if (enemy.type === 'fast') {
                        // 🎯 【黄色い敵：自機狙い弾の計算】
                        // 自機の中心座標と敵の中心座標の間の「角度(ラジアン)」を計算する
                        let angle = Phaser.Math.Angle.Between(enemy.x + 12, enemy.y + 12, this.player.x + 8, this.player.y + 16);
                        let bulletSpeed = 5; // 黄色の弾の飛んでいく速度（大きくすると超高速スナイパーになります）
                        let vx = Math.cos(angle) * bulletSpeed; // 横方向の移動量に変換
                        let vy = Math.sin(angle) * bulletSpeed; // 縦方向の移動量に変換

                        let ebGraphic = this.add.circle(enemy.x + 12, enemy.y + 24, 6, 0xeccc68); // 黄色の丸弾
                        this.enemyBullets.push({ x: enemy.x + 6, y: enemy.y + 24, width: 12, height: 12, speedY: vy, speedX: vx, graphic: ebGraphic });
                    } 
                    else if (enemy.type === 'hard') {
                        // 🔮 【紫の敵：3方向へのワイド拡散弾】
                        // vx（横スピード）を -3（左斜め）、0（真下）、3（右斜め）の3パターン同時に放流
                        [-3, 0, 3].forEach((vx) => {
                            let ebGraphic = this.add.circle(enemy.x + 12, enemy.y + 24, 6, 0x9c88ff); // 紫の丸弾
                            this.enemyBullets.push({ x: enemy.x + 6, y: enemy.y + 24, width: 12, height: 12, speedY: 4, speedX: vx, graphic: ebGraphic });
                        });
                    } 
                    else {
                        // 🔴 【赤い敵：普通の真下直線弾】
                        let ebGraphic = this.add.circle(enemy.x + 12, enemy.y + 24, 6, 0xff3333); // 赤の丸弾
                        this.enemyBullets.push({ x: enemy.x + 6, y: enemy.y + 24, width: 12, height: 12, speedY: 4.5, speedX: 0, graphic: ebGraphic });
                    }
                    enemy.fireTimer = enemy.fireInterval; // 次の射撃までのウェイトをリセット
                }
            }

            // ■ 2. 撤退（一定時間で画面上に帰っていく）処理
            if (!enemy.isRetreating) {
                enemy.survivalTimer--;
                if (enemy.survivalTimer <= 0) {
                    enemy.isRetreating = true;
                    enemy.speedY = -6; // 上向きの高速移動に切り替え
                    enemy.speedX = 0;
                }
            }

            // ■ 3. 敵の移動ロジック
            if (enemy.isRetreating) {
                enemy.y += enemy.speedY; // 撤退中：上へ
                enemy.graphic.alpha = 0.5; // 逃げてる時は半透明にする演出
                if (enemy.y < -50) { enemy.isAlive = false; enemy.graphic.destroy(); } // 画面外に出たら消去
            } else {
                if (enemy.y < enemy.targetMinY) {
                    enemy.y += 2.5; // スポーン直後：定位置までスッと降りてくる
                } else {
                    // 通常うろつき移動：左右に往復しつつ、ゆらゆら上下運動
                    enemy.x += enemy.speedX;
                    if (enemy.y < 50 || enemy.y > 320) enemy.speedY *= -1; // 上下の反転壁
                    enemy.y += enemy.speedY;

                    if (enemy.x < 10 || enemy.x > 560) {
                        enemy.speedX *= -1; // 左右の画面端にぶつかったら反転
                        enemy.x = Phaser.Math.Clamp(enemy.x, 11, 559);
                    }
                }
            }
            enemy.graphic.x = enemy.x; enemy.graphic.y = enemy.y; // 見た目の座標を同期
        });

        // ─── 👑 【ラスボスの出現＆超激化AIルーチン】 ───
        let activeEnemies = this.enemies.filter(e => e.isAlive);
        // 全部の予定の敵が湧き終わり、かつ画面上の敵が全滅したら、満を持してボスが登場
        if (this.enemySpawnQueue.length === 0 && activeEnemies.length === 0 && !this.boss) {
            this.bossGraphic = this.add.rectangle(200, -100, 200, 60, 0xff0055); // ボスの巨大なピンク長方形
            this.bossGraphic.setOrigin(0);

            this.boss = {
                width: 200, height: 60, x: 200, y: -100,
                speedX: 3,                      // ボスの左右の横移動スピード
                hp: 100, maxHp: 100,            // ボスの体力（100発当てると撃破）
                fireTimer: 0, isAlive: true,
                canAttack: false                // 攻撃開始フラグ（最初はfalse＝登場デモ中で無敵）
            };
        }

        // ■ ボスの実際の行動と弾幕パターン
        if (this.boss && this.boss.isAlive) {
            if (this.boss.y < 120) {
                // 定位置（Y=120）にゆっくり降りてくるフェーズ
                this.boss.y += 1.5;
                this.bossGraphic.alpha = 0.4; // 💡登場中は半透明（無敵のサイン、攻撃を受け付けない）
            } else {
                // 定位置に到着！ここで初めて無敵解除＆超激化攻撃が始まる
                if (!this.boss.canAttack) {
                    this.boss.canAttack = true; // 攻撃開始！
                    this.bossGraphic.alpha = 1.0; // 本来の不透明な色に戻す
                }

                // ボスの左右うろつき移動
                this.boss.x += this.boss.speedX;
                if (this.boss.x < 20 || this.boss.x > 380) this.boss.speedX *= -1; // 画面端で跳ね返り

                this.boss.fireTimer++;
                
                // 💀 【攻撃パターン1：超高速の激しい3方向拡散弾】
                // 「20」フレームごと（約0.3秒に1回）に、下・左斜め・右斜めへ一斉発射！
                // 「20」を「10」に縮めると地獄のような弾幕になります。speedY: 6 を変えると弾の速度が変わります。
                if (this.boss.fireTimer % 20 === 0) {
                    [-5, 0, 5].forEach((vx) => {
                        let ebGraphic = this.add.circle(this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height, 8, 0xff0055);
                        this.enemyBullets.push({ x: this.boss.x + this.boss.width / 2 - 8, y: this.boss.y + this.boss.height, width: 16, height: 16, speedY: 6, speedX: vx, graphic: ebGraphic });
                    });
                }

                // 💀 【攻撃パターン2：逃げ場を奪う超高速の自機狙いピンポイント弾】
                // 3方向弾のスキマを縫うように、「35」フレームごとにあなたの座標を精密狙撃。
                // bulletSpeed = 7.5 はザコ敵(5)よりはるかに高速。立ち止まると即死します。
                if (this.boss.fireTimer % 35 === 0) {
                    let angle = Phaser.Math.Angle.Between(this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height, this.player.x + 8, this.player.y + 16);
                    let bulletSpeed = 7.5; 
                    let vx = Math.cos(angle) * bulletSpeed;
                    let vy = Math.sin(angle) * bulletSpeed;

                    let ebGraphic = this.add.circle(this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height, 8, 0xeccc68); // 黄色い狙撃弾
                    this.enemyBullets.push({ x: this.boss.x + this.boss.width / 2 - 8, y: this.boss.y + this.boss.height, width: 16, height: 16, speedY: vy, speedX: vx, graphic: ebGraphic });
                }
            }
            this.bossGraphic.x = this.boss.x; this.bossGraphic.y = this.boss.y; // 座標の同期
        }

        // ─── 🌐 【弾・アイテムの自動前進と画面外消去】 ───
        // 自機の弾の移動（上へ）
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            let b = this.playerBullets[i]; b.y += b.speedY; b.graphic.y = b.y;
            if (b.y < -50) { b.graphic.destroy(); this.playerBullets.splice(i, 1); }
        }
        // 敵の弾の移動（縦・横それぞれの速度を加算）
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            let eb = this.enemyBullets[i]; 
            eb.y += eb.speedY; eb.graphic.y = eb.y;
            if (eb.speedX) { eb.x += eb.speedX; eb.graphic.x = eb.x; } // 自機狙い弾・拡散弾用
            if (eb.y > 850 || eb.x < -20 || eb.x > 620) { eb.graphic.destroy(); this.enemyBullets.splice(i, 1); }
        }
        // パワーアップアイテムの移動（ふわふわと下へ降りてくる）
        for (let i = this.items.length - 1; i >= 0; i--) {
            let item = this.items[i]; item.y += 1.5; item.graphic.y = item.y; // 1.5の数値を大きくすると落下が早くなる
            if (item.y > 850) { item.graphic.destroy(); this.items.splice(i, 1); }
        }

        // ─── 💥 【衝突（当たり判定）処理ルーチン】 ───

        // ⚔️ 【1. 自機の弾 × ザコ敵】
        this.enemies.forEach((enemy) => {
            if (!enemy.isAlive) return;
            for (let i = this.playerBullets.length - 1; i >= 0; i--) {
                let b = this.playerBullets[i];
                // 四角形同士の重なり（ヒット）判定
                if (b.x < enemy.x + enemy.width && b.x + b.width > enemy.x && b.y < enemy.y + enemy.height && b.y + b.height > enemy.y) {
                    b.graphic.destroy(); this.playerBullets.splice(i, 1); // 当たった自機の弾を消す
                    enemy.hp--; // 敵のHPを減らす
                    
                    // 被弾エフェクト：一瞬だけ敵を少し透明にする（明滅効果）
                    enemy.graphic.alpha = 0.3; 
                    this.time.delayedCall(50, () => { if(enemy.graphic) enemy.graphic.alpha = enemy.isRetreating ? 0.5 : 1.0; });

                    // 敵の撃破処理
                    if (enemy.hp <= 0) {
                        enemy.isAlive = false; enemy.graphic.destroy();
                        // 敵が死んだ場所にパワーアップアイテム（緑の丸: 0x4cd137）をドロップ生成
                        let itemGraphic = this.add.circle(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8, 0x4cd137);
                        this.items.push({ x: enemy.x + enemy.width / 2 - 8, y: enemy.y + enemy.height / 2 - 8, width: 16, height: 16, graphic: itemGraphic });
                    }
                }
            }
        });

        // ⚔️ 【2. 自機の弾 × ラスボス】
        if (this.boss && this.boss.isAlive) {
            for (let i = this.playerBullets.length - 1; i >= 0; i--) {
                let b = this.playerBullets[i];
                if (b.x < this.boss.x + this.boss.width && b.x + b.width > this.boss.x && b.y < this.boss.y + this.boss.height && b.y + b.height > this.boss.y) {
                    
                    // 💡重要：ボスへの攻撃が当たったら、弾自体は常に消滅する（吸い込まれるエフェクトになる）
                    b.graphic.destroy(); this.playerBullets.splice(i, 1);
                    
                    // ボスが定位置について攻撃を開始している（＝無敵が解除されている）場合のみ、ダメージを通す
                    if (this.boss.canAttack) {
                        this.boss.hp--;
                        // ボスの被弾明滅エフェクト
                        this.bossGraphic.alpha = 0.5; this.time.delayedCall(30, () => { if(this.bossGraphic) this.bossGraphic.alpha = 1.0; });

                        // ボス撃破（ゲームクリア）処理
                        if (this.boss.hp <= 0) {
                            this.boss.isAlive = false; this.bossGraphic.destroy();
                            // 余韻を持たせるため、文字は出さずに2秒間（2000ms）静寂を保ったあと自動リスタート
                            this.time.delayedCall(2000, () => { this.scene.restart(); });
                        }
                    }
                }
            }
        }

        // ⚔️ 【3. 自機 × パワーアップアイテム】
        for (let i = this.items.length - 1; i >= 0; i--) {
            let item = this.items[i];
            if (item.x < this.player.x + this.player.width && item.x + item.width > this.player.x && item.y < this.player.y + this.player.height && item.y + item.height > this.player.y) {
                item.graphic.destroy(); this.items.splice(i, 1); // アイテムを消す
                this.player.powerLevel++; // パワーレベル上昇
                
                // パワーレベルが3以上、かつ分身がまだ上限（最大4体）に達していなければ、分身を1体追加する
                if (this.player.powerLevel >= 3 && this.options.length < 4) {
                    let optGraphic = this.add.rectangle(this.player.x, this.player.y, this.optionSettings.width, this.optionSettings.height, 0xeccc68); // 黄色い四角の分身
                    optGraphic.setOrigin(0);
                    this.options.push({ x: this.player.x, y: this.player.y }); 
                    this.optionGraphics.push(optGraphic);
                }
            }
        }

        // ⚔️ 【4. 敵の弾 × 自機（プレイヤーへの被弾判定）】
        if (this.player.invincibleTimer === 0) { // プレイヤーが無敵状態ではない時だけ判定
            for (let i = 0; i < this.enemyBullets.length; i++) {
                let eb = this.enemyBullets[i];
                if (eb.x < this.player.x + this.player.width && eb.x + eb.width > this.player.x && eb.y < this.player.y + this.player.height && eb.y + eb.height > this.player.y) {
                    eb.graphic.destroy(); this.enemyBullets.splice(i, 1); // 当たった敵の弾を消す
                    
                    this.player.hp--; // ライフを1減らす
                    this.player.invincibleTimer = 60; // 被弾したので60フレーム（約1秒）の無敵時間を付与
                    
                    // 体力が尽きたらその場で即座にステージを最初からリスタート（ゲームオーバー）
                    if (this.player.hp <= 0) this.scene.restart();
                    break;
                }
            }
        }
    }
}

// ─── 📐 【Phaser3 ゲーム起動設定】 ───
new Phaser.Game({
    type: Phaser.AUTO, 
    width: 600, height: 800, // 画面解像度（横600px、縦800px）
    // 横縦比を維持したまま、ブラウザの画面いっぱいに綺麗に自動拡大・中央配置する設定
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: MyGameScene
});