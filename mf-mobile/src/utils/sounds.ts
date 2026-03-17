import { createAudioPlayer } from 'expo-audio';

const SOUNDS = {
    messageReceived: require('@/assets/sounds/receive-msg.wav'),
    messageSent: require('@/assets/sounds/send-msg.wav'),
};

// Create players once at module scope
const players = {
    messageReceived: createAudioPlayer(SOUNDS.messageReceived),
    messageSent: createAudioPlayer(SOUNDS.messageSent),
};

export const playChatSound = async (type: keyof typeof SOUNDS) => {
    try {
        const player = players[type];
        // Restart if already playing or finished
        player.seekTo(0);
        player.play();
    } catch (error) {
        console.warn('Could not play chat sound:', error);
    }
};

