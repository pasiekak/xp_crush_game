class SoundPlayer {
    constructor() {
        this.sounds = {
            crush: new Audio('/sounds/Windows XP Balloon.mp3'),
            move: new Audio('/sounds/Windows XP Start.mp3'),
            startGame: new Audio('/sounds/Windows XP Logon Sound.mp3'),
            endGame: new Audio('/sounds/Windows XP Logoff Sound.mp3'),
            background: new Audio('/sounds/Windows XP background song.mp3')
        };
    }

    playSound(soundName) {
        const sound = this.sounds[soundName];
        if(sound) {
            sound.play();
        } else {
            console.error(`Sound '${soundName}' not found.`);
        }
    }

    getBackgroundPlayer() {
        const sound = this.sounds['background'];
        if(sound) {
            return sound;
        } else {    
            console.error(`Sound not found.`);
        }
    }
}

export default SoundPlayer;