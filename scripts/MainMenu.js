class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('bg', 'assets/bg.jpg');
        this.load.image('play', 'assets/play.png');
        this.load.audio('click', 'audios/click.mp3');
    }

    create() {
        this.add.image(400, 300, 'bg');

        const playButton = this.add.sprite(400, 300, 'play').setScale(0.3);
        const soundClick = this.sound.add('click');

        const shape = new Phaser.Geom.Rectangle(0, 0, playButton.width, playButton.height);
        playButton.setInteractive(shape, Phaser.Geom.Rectangle.Contains);

        this.followText = this.add.text(0, 0, 'Play').setFontSize(24);
        this.followText.setPosition(playButton.x, playButton.y);
        this.followText.setOrigin(0.5);

        playButton.on('pointerover', () => {
            playButton.setTint(0x7878ff);
        })

        playButton.on('pointerdown', () => {
            soundClick.play();
            this.scene.start('Scene1');
        })

        playButton.on('pointerout', () => {
            playButton.clearTint();
        })
    }
}

export default MainMenu;