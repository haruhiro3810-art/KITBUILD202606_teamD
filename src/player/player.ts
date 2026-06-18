export default class Player {
    private player!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private scene!: Phaser.Scene;
    
    constructor( 
        cursors: Phaser.Types.Input.Keyboard.CursorKeys, 
        scene: Phaser.Scene
    ) {
        this.cursors = cursors;
        this.scene = scene;
    }
    create() {
        this.player = this.scene.add.rectangle(100, 500, 40, 40, 0x00ff00);
        this.scene.physics.add.existing(this.player);
    }
    // プレイヤーの移動処理
    update(){
        if (this.cursors.right?.isDown && this.player.x + 5 <= 780){
            this.player.x += 5;
        }
        if (this.cursors.left?.isDown && this.player.x -5 >= 20){
            this.player.x -= 5;
        }
  }
}