import Skill from "../../../duels/classes/Skill"

export const testSkill = new Skill({
    id: 0,
    level: 50,
    key: 'test',
    methods: {
        target: [

        ],
        caster: [
            
        ]
    }
})

export const skills: Skill[] = [
    testSkill
]