export default interface Idea {
    name: string
    text: string
    voters?: number[]
    coolVote?: number
    badVote?: number
}