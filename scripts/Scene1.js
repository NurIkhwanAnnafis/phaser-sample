const listButtonKey = [
    { key: 'exit', y: 770, x: 30, scale: 0.2 },
    { key: 'door', y: 400, x: 300, scale: 3 },
    { key: 'prev', y: 50, x: 300, scale: 0.2, hidden: true },
    { key: 'next', y: 750, x: 300, scale: 0.2, hidden: true },
    { key: 'lift', y: 400, x: 300, scale: 1, hidden: true },
];

const placementKey = [
    { id: 0, key: 'bg', sprite: [4], spriteHidden: [] },
    { id: 1, key: 'bg2', hidden: true, sprite: [], spriteHidden: [4] },
    { id: 2, key: 'bg3', hidden: true, sprite: [], spriteHidden: [4] },
];

const hintPosition = [
    { minX: 50, maxX: 350, minY: 50, maxY: 250 },
    { minX: 350, maxX: 800, minY: 50, maxY: 250 },
    { minX: 50, maxX: 350, minY: 250, maxY: 600 },
    { minX: 350, maxX: 800, minY: 250, maxY: 600 },
]

class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
    }

    preload() {
        this.load.image('bg', 'assets/bg.jpg');
        this.load.image('bg2', 'assets/bg2.jpg');
        this.load.image('bg3', 'assets/bg3.jpg');
        this.load.image('prev', 'assets/prev.png');
        this.load.image('next', 'assets/next.png');
        this.load.image('exit', 'assets/exit.png');
        this.load.spritesheet('door', 'assets/door2.png', { frameWidth: 68, frameHeight: 96 });
        this.load.image('lift', 'assets/lift.png');
        this.load.image('chestClose', 'assets/chestClose.png');
        this.load.image('chestOpen', 'assets/chestOpen.png');
        this.load.image('victory', 'assets/victory.png');

        this.load.audio('click', 'audios/click.mp3');
        this.load.audio('doorOpen', 'audios/doorOpen.mp3');
        this.load.audio('error', 'audios/error.mp3');
        this.load.audio('liftOpen', 'audios/liftOpen.mp3');
        this.load.audio('winning', 'audios/winning.mp3');
        this.load.audio('jumpscare', 'audios/jumpscare.mp3');
        this.load.audio('scrollOpen', 'audios/scrollOpen.mp3');

        this.load.html('passwordForm', 'forms/passwordForm.html');
        this.load.html('jumpscareHtml', 'forms/jumpscare.html');
        this.load.html('scroll1', 'forms/scroll1.html');
        this.load.html('scroll2', 'forms/scroll2.html');
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    create() {
        const bgs = [];
        const buttons = [];
        let place = 0;
        const hintArea1 = [];
        const hintArea1Status = [];
        const hintArea2 = [];
        const hintArea2Status = [];
        let hintCollected = 0;

        const soundClick = this.sound.add('click');
        const soundDoorOpen = this.sound.add('doorOpen');
        const soundError = this.sound.add('error');
        const liftOpen = this.sound.add('liftOpen');
        const winning = this.sound.add('winning');
        const jumpscare = this.sound.add('jumpscare');
        const scrollOpen = this.sound.add('scrollOpen');

        this.add.image(400, 300, 'bg');

        for (let i = 0; i < 3; i++) {
            bgs.push(this.add.image(400, 300, placementKey[i].key))

            if (placementKey[i].hidden) {
                bgs[i].setActive(false);
                bgs[i].setVisible(false);
            }
        }

        for (let i = 0; i < 5; i++) {
            buttons.push(this.add.sprite(listButtonKey[i].y, listButtonKey[i].x, listButtonKey[i].key).setScale(listButtonKey[i].scale))
            const shape = new Phaser.Geom.Rectangle(0, 0, buttons[i].width, buttons[i].height);
            buttons[i].setInteractive(shape, Phaser.Geom.Rectangle.Contains);

            if (listButtonKey[i].hidden) {
                buttons[i].setActive(false);
                buttons[i].setVisible(false);
            }
        }

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('door', { frames: [7] }),
            frameRate: 0,
            repeat: 0,
        });

        this.anims.create({
            key: 'open',
            frames: this.anims.generateFrameNumbers('door', { frames: [8, 9, 10, 11, 12, 13, 14, 15] }),
            frameRate: 6,
            repeat: 0,
        });
        buttons[1].play('idle');

        for (let i = 0; i < 4; i++) {
            hintArea1.push(this.add.sprite(this.getRandomInt(hintPosition[i].minX, hintPosition[i].maxX), this.getRandomInt(hintPosition[i].minY, hintPosition[i].maxY), 'chestClose').setScale(0.1));
            const shape2 = new Phaser.Geom.Rectangle(0, 0, hintArea1[i].width, hintArea1[i].height);
            hintArea1[i].setInteractive(shape2, Phaser.Geom.Rectangle.Contains);
            if (hintArea1Status.some(x => !x.zonk)) {
                hintArea1Status.push({ open: false, zonk: true });
            } else if (i === 3) {
                hintArea1Status.push({ open: false, zonk: false });
            } else {
                hintArea1Status.push({ open: false, zonk: !!Math.floor(Math.random() * 2) });
            }

            hintArea1[i].setActive(false);
            hintArea1[i].setVisible(false);

            hintArea2.push(this.add.sprite(this.getRandomInt(hintPosition[i].minX, hintPosition[i].maxX), this.getRandomInt(hintPosition[i].minY, hintPosition[i].maxY), 'chestClose').setScale(0.1));
            const shape3 = new Phaser.Geom.Rectangle(0, 0, hintArea2[i].width, hintArea2[i].height);
            hintArea2[i].setInteractive(shape3, Phaser.Geom.Rectangle.Contains);
            if (hintArea2Status.some(x => !x.zonk)) {
                hintArea2Status.push({ open: false, zonk: true });
            } else if (i === 3) {
                hintArea2Status.push({ open: false, zonk: false });
            } else {
                hintArea2Status.push({ open: false, zonk: !!Math.floor(Math.random() * 2) });
            }

            hintArea2[i].setActive(false);
            hintArea2[i].setVisible(false);
        }

        const handleOpenDoor = () => {
            setTimeout(() => {
                buttons[1].setActive(false);
                buttons[1].setVisible(false);
                for (let i = 2; i < 5; i++) {
                    buttons[i].setActive(true);
                    buttons[i].setVisible(true);
                }
            }, 1500)
        }

        const handleChangePlace = (type) => {
            if (type === 'next') {
                place = place === 2 ? 0 : place + 1;
            } else if (type === 'prev') {
                place = place === 0 ? 2 : place - 1;
            }

            for (let i = 0; i < 3; i++) {
                if (i === place) {
                    bgs[i].setActive(true);
                    bgs[i].setVisible(true);
                    placementKey[i].sprite.map(x => {
                        buttons[x].setActive(true);
                        buttons[x].setVisible(true);
                    })
                    placementKey[i].spriteHidden.map(x => {
                        buttons[x].setActive(false);
                        buttons[x].setVisible(false);
                    })
                } else {
                    bgs[i].setActive(false);
                    bgs[i].setVisible(false);
                }
            }

            if (place === 0) {
                for (let i = 0; i < 4; i++) {
                    hintArea1[i].setActive(false);
                    hintArea1[i].setVisible(false);
                    hintArea2[i].setActive(false);
                    hintArea2[i].setVisible(false);
                }
            } else if (place === 1) {
                for (let i = 0; i < 4; i++) {
                    hintArea1[i].setActive(true);
                    hintArea1[i].setVisible(true);
                    hintArea2[i].setActive(false);
                    hintArea2[i].setVisible(false);
                }
            } else if (place === 2) {
                for (let i = 0; i < 4; i++) {
                    hintArea1[i].setActive(false);
                    hintArea1[i].setVisible(false);
                    hintArea2[i].setActive(true);
                    hintArea2[i].setVisible(true);
                }
            }
        }

        const handleHideNavigation = () => {
            buttons[2].setActive(false);
            buttons[2].setVisible(false);
            buttons[3].setActive(false);
            buttons[3].setVisible(false);
        }

        const handleShowNavigation = () => {
            buttons[2].setActive(true);
            buttons[2].setVisible(true);
            buttons[3].setActive(true);
            buttons[3].setVisible(true);
        }

        const handleShowForm = () => {
            element.setActive(true);
            element.setVisible(true);
        }

        const handleHideHint = () => {
            for (let i = 0; i < 4; i++) {
                if (place === 1) {
                    hintArea1[i].setActive(false);
                    hintArea1[i].setVisible(false);
                } else if (place === 2) {
                    hintArea2[i].setActive(false);
                    hintArea2[i].setVisible(false);
                }
            }
        }

        const handleShowHint = () => {
            for (let i = 0; i < 4; i++) {
                if (place === 1) {
                    hintArea1[i].setActive(true);
                    hintArea1[i].setVisible(true);
                } else if (place === 2) {
                    hintArea2[i].setActive(true);
                    hintArea2[i].setVisible(true);
                }
            }
        }

        buttons[0].on('pointerdown', () => {
            this.scene.start('MainMenu');
            soundClick.play();
            //  Turn off the click events
            this.removeListener('click');
        })

        buttons[1].on('pointerdown', () => {
            soundDoorOpen.play();
            soundDoorOpen.setVolume(0.3);
            buttons[1].play('open');
            handleOpenDoor();
        })

        buttons[2].on('pointerdown', () => {
            soundClick.play();
            handleChangePlace('prev');
        })

        buttons[3].on('pointerdown', () => {
            soundClick.play();
            handleChangePlace('next');
        })

        buttons[4].on('pointerdown', () => {
            soundClick.play();
            handleHideNavigation();
            handleShowForm();
            buttons[4].setActive(false);
            buttons[4].setVisible(false);
        })

        const elementJumpscare = this.add.dom(0, 0).createFromCache('jumpscareHtml');
        elementJumpscare.setPerspective(800);
        elementJumpscare.addListener('click');
        elementJumpscare.setActive(false);
        elementJumpscare.setVisible(false);

        const elementScroll1 = this.add.dom(400, -200).createFromCache('scroll1');
        elementScroll1.setPerspective(800);
        elementScroll1.addListener('click');
        elementScroll1.setActive(false);
        elementScroll1.setVisible(false);
        elementScroll1.on('click', (event) => {
            soundClick.play();
            this.tweens.add({
                targets: elementScroll1,
                y: -200,
                duration: 500,
                ease: 'Power3'
            });
            setTimeout(() => {
                elementScroll1.setActive(false);
                elementScroll1.setVisible(false);
                elementScroll1.removeListener('click');
            }, 500)
        });

        const elementScroll2 = this.add.dom(400, -200).createFromCache('scroll2');
        elementScroll2.setPerspective(800);
        elementScroll2.addListener('click');
        elementScroll2.setActive(false);
        elementScroll2.setVisible(false);
        elementScroll2.on('click', (event) => {
            soundClick.play();
            this.tweens.add({
                targets: elementScroll2,
                y: -200,
                duration: 500,
                ease: 'Power3'
            });
            setTimeout(() => {
                elementScroll2.setActive(false);
                elementScroll2.setVisible(false);
                elementScroll2.removeListener('click');
            }, 500)
        });

        const handleShowScrollHint = () => {
            if (place === 1) {
                elementScroll1.setActive(true);
                elementScroll1.setVisible(true);
                this.tweens.add({
                    targets: elementScroll1,
                    y: 300,
                    duration: 500,
                    ease: 'Power3'
                });
            } else if (place === 2) {
                elementScroll2.setActive(true);
                elementScroll2.setVisible(true);
                this.tweens.add({
                    targets: elementScroll2,
                    y: 300,
                    duration: 500,
                    ease: 'Power3'
                });
            }
        }

        const handleClickChest = (hintAreaStatus, hintArea) => {
            if (!hintAreaStatus.open) {
                soundClick.play();
                if (hintAreaStatus.zonk) {
                    handleHideNavigation();
                    handleHideHint();
                    jumpscare.play();
                    elementJumpscare.setActive(true);
                    elementJumpscare.setVisible(true);
                } else {
                    scrollOpen.play();
                    handleShowScrollHint();
                    hintCollected++;
                }
                hintArea.setTexture('chestOpen')
                hintAreaStatus.open = true;
            }
        }
        jumpscare.on('complete', () => {
            handleShowNavigation();
            handleShowHint();
            elementJumpscare.setActive(false);
            elementJumpscare.setVisible(false);
        })

        hintArea1[0].on('pointerdown', () => {
            handleClickChest(hintArea1Status[0], hintArea1[0])
        })
        hintArea1[1].on('pointerdown', () => {
            handleClickChest(hintArea1Status[1], hintArea1[1])
        })
        hintArea1[2].on('pointerdown', () => {
            handleClickChest(hintArea1Status[2], hintArea1[2])
        })
        hintArea1[3].on('pointerdown', () => {
            handleClickChest(hintArea1Status[3], hintArea1[3])
        })

        hintArea2[0].on('pointerdown', () => {
            handleClickChest(hintArea2Status[0], hintArea2[0])
        })
        hintArea2[1].on('pointerdown', () => {
            handleClickChest(hintArea2Status[1], hintArea2[1])
        })
        hintArea2[2].on('pointerdown', () => {
            handleClickChest(hintArea2Status[2], hintArea2[2])
        })
        hintArea2[3].on('pointerdown', () => {
            handleClickChest(hintArea2Status[3], hintArea2[3])
        })

        const element = this.add.dom(400, 300).createFromCache('passwordForm');
        element.setPerspective(800);
        element.addListener('click');
        element.setActive(false);
        element.setVisible(false);
        element.on('click', (event) => {
            if (event.target.name === 'submit') {
                const inputPassword = element.getChildByName('password');

                //  Have they entered anything?
                if (inputPassword.value === 'password' && hintCollected === 2) {
                    inputPassword.value = '';
                    // handleShowNavigation();
                    buttons[4].setActive(true);
                    buttons[4].setVisible(true);
                    element.setActive(false);
                    element.setVisible(false);
                    liftOpen.play();
                    setTimeout(() => {
                        winning.play();
                        this.tweens.add({
                            targets: this.add.sprite(400, 0, 'victory').setScale(0.4),
                            y: 300,
                            duration: 1000,
                            ease: 'Power3'
                        });
                    }, 1500)
                } else {
                    //  Flash the prompt
                    soundError.play();
                }
            } else if (event.target.name === 'cancel') {
                soundClick.play();
                handleShowNavigation();
                buttons[4].setActive(true);
                buttons[4].setVisible(true);
                element.setActive(false);
                element.setVisible(false);
            }
        });

        winning.on('complete', () => this.scene.start('MainMenu'));
    }
}

export default Scene1;