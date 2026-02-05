import Character from '../../interfaces/duel/Character'
import Characteristics from '../../interfaces/duel/Characteristics'
import StartUp from '../../interfaces/other/StartUp'
import { DuelFilename } from '../values/types/types'
import CharacterUtils from './CharacterUtils'

export default class {
    static getDummyCharacteristics(): Characteristics {
        return {
            hp: 0,
            mana: 0
        }
    }

    static getMaxCharacteristic(startUp: StartUp<number>, level: number): number {
        const {
            start,
            up
        } = startUp

        return start + up * (level - 1)
    }

    static getMaxCharacteristicsByCharacter(chars: Character['characteristics'] | undefined, level: number): Characteristics {
        if (!chars) return this.getDummyCharacteristics()

        const getMax = (key: keyof Characteristics) => {
            return this.getMaxCharacteristic(chars[key], level)
        }

        return {
            hp: getMax('hp'),
            mana: getMax('mana'),
        }
    }

    static getMaxCharacteristicsByClass(filename: DuelFilename, level: number): Characteristics {
        const character = CharacterUtils.get(filename)
        const chars = character.characteristics
        return this.getMaxCharacteristicsByCharacter(chars, level)
    }
}