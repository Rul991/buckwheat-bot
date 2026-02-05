import EffectMethod from './EffectMethod'

export default class extends EffectMethod<[string, string, number]> {
    protected _filename: string = 'effect-last-step'
}