import {ADD_SOUND, REMOVE_SOUND} from './type';

export const addSound = (item) => {
    return {
        type: ADD_SOUND,
        payload: item
    };
};

export const removeSound = (index) => {
    return {
        type: REMOVE_SOUND,
        payload: index
    };
};
