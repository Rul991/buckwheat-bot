export default class PaymentUtils {
    static getMoneyByStars(stars: number): number {
        return Math.ceil(stars ** 1.15 * 1000)
    }
}