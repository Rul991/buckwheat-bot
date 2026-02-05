import { basename, join } from 'path'
import Character from '../../interfaces/duel/Character'
import FileUtils from '../FileUtils'
import ObjectValidator from '../ObjectValidator'
import { characterSchema } from '../values/schemas'
import { CharactersMap, DuelFilename } from '../values/types/types'
import Logging from '../Logging'

export default class {
    private static _folderPath = 'json/duels/characters'
    private static readonly _cachedCharacters: CharactersMap = new Map()

    static getDummy(): Character {
        return {
            characteristics: {
                hp: {
                    start: 0,
                    up: 0
                },
                mana: {
                    start: 0,
                    up: 0
                }
            },
            skill: {
                showable: [],
                main: '',
                effects: []
            }
        }
    }

    private static async _loadFromFile(filename: DuelFilename) {
        const json = await FileUtils.readJsonFromResource(
            join(this._folderPath, `${filename}.json`)
        )

        if (!ObjectValidator.isValidatedObject(json, characterSchema)) {
            return this.getDummy()
        }

        this._cachedCharacters.set(filename, json)
        return json
    }

    static async setup() {
        const filenames = await FileUtils.readFilesFromResourse(this._folderPath)
        await Promise.all(
            filenames.map(async path => {
                return await this._loadFromFile(
                    basename(
                        path, 
                        '.json'
                    ) as DuelFilename
                )
            })
        )

        Logging.log(
            'CharacterUtils.setup',
            {
                characters: Array.from(this._cachedCharacters.entries())
            }
        )
    }

    static get(filename: DuelFilename) {
        return this._cachedCharacters.get(filename) ?? this.getDummy()
    }
    
    static get characters(): CharactersMap {
        return this._cachedCharacters
    }
}