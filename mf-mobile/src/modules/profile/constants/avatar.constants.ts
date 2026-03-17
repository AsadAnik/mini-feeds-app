export const AVATAR_OPTIONS = {
    faces: [
        { id: 'smiling', label: 'Smiling' },
        { id: 'neutral', label: 'Neutral' },
        { id: 'surprised', label: 'Surprised' },
        { id: 'cool', label: 'Cool' },
        { id: 'wink', label: 'Wink' },
        { id: 'sleepy', label: 'Sleepy' },
    ],
    hairs: [
        { id: 'none', label: 'Bald' },
        { id: 'short', label: 'Short' },
        { id: 'long', label: 'Long' },
        { id: 'spiky', label: 'Spiky' },
        { id: 'curly', label: 'Curly' },
        { id: 'bob', label: 'Bob Cut' },
        { id: 'mohawk', label: 'Mohawk' },
        { id: 'pixie', label: 'Pixie' },
    ],
    shapes: [
        { id: 'oval', label: 'Oval' },
        { id: 'round', label: 'Round' },
        { id: 'square', label: 'Square' },
        { id: 'heart', label: 'Heart' },
    ],
    skinColors: [
        '#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#74453d', '#f9c197'
    ],
    hairColors: [
        '#000000', '#4B2C20', '#A52A2A', '#F5E1A4', '#D1D5DB', '#EF4444', '#3B82F6'
    ]
};

export type AvatarConfig = {
    face: string;
    hair: string;
    shape: string;
    skinColor: string;
    hairColor: string;
};

export const PRESET_CHARACTERS = [
    {
        id: 'char_1',
        label: 'Cool Boy',
        config: { face: 'cool', hair: 'spiky', shape: 'oval', skinColor: '#F1C27D', hairColor: '#000000' }
    },
    {
        id: 'char_2',
        label: 'Sweetie',
        config: { face: 'smiling', hair: 'long', shape: 'round', skinColor: '#FFDBAC', hairColor: '#4B2C20' }
    },
    {
        id: 'char_3',
        label: 'Punk Anime',
        config: { face: 'surprised', hair: 'mohawk', shape: 'square', skinColor: '#f9c197', hairColor: '#3B82F6' }
    },
    {
        id: 'char_4',
        label: 'Gamer',
        config: { face: 'neutral', hair: 'short', shape: 'oval', skinColor: '#E0AC69', hairColor: '#EF4444' }
    },
    {
        id: 'char_5',
        label: 'Modern',
        config: { face: 'wink', hair: 'pixie', shape: 'heart', skinColor: '#FFDBAC', hairColor: '#D1D5DB' }
    },
    {
        id: 'char_6',
        label: 'Classy',
        config: { face: 'smiling', hair: 'bob', shape: 'round', skinColor: '#8D5524', hairColor: '#F5E1A4' }
    },
    {
        id: 'char_7',
        label: 'Sleepy Head',
        config: { face: 'sleepy', hair: 'curly', shape: 'round', skinColor: '#F1C27D', hairColor: '#4B2C20' }
    },
    {
        id: 'char_8',
        label: 'Cyborg',
        config: { face: 'cool', hair: 'mohawk', shape: 'square', skinColor: '#D1D5DB', hairColor: '#3B82F6' }
    },
    {
        id: 'char_9',
        label: 'Goth',
        config: { face: 'neutral', hair: 'long', shape: 'oval', skinColor: '#FFDBAC', hairColor: '#000000' }
    },
    {
        id: 'char_10',
        label: 'Anime Girl',
        config: { face: 'wink', hair: 'bob', shape: 'heart', skinColor: '#f9c197', hairColor: '#EF4444' }
    }
];

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = PRESET_CHARACTERS[0].config;
