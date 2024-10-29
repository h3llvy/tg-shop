import axios from 'axios'

export const paymentService = {
  async createPayment(giftId: string, amount: number) {
    const { data } = await axios.post('/api/payments', {
      giftId,
      amount
    })
    return data.paymentUrl // URL для оплаты через Crypto Pay
  }
}
