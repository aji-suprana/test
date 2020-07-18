**1. Cannot Create Update Delete Checkout on expired cart**
  * check Date() < expiredate

**2. Block signPaymentToken on ./controller/payment-gateway.js if expired**
  * hubungi saya jika tidak paham mengenai note nomor (2)
  * check cart.expiredate > Date()

**3. Merge branch ini dengan tags, add expired tag ke cart jika expired**
  * mungkin bisa https://www.npmjs.com/package/node-schedule tp sy belum research betul mengenai modul ini. 
  * pada intinya schedule untuk check all carts, yg expired di tag expired
  