const CronJob = require('cron').CronJob;

const checkExpiredCarts = new CronJob(
  '0 0 * * *', // job started every 00:00
  async function () {
    try {
      console.log('Checking carts...\n');

      const carts = await Cart.findAll();
      const checkCarts = carts.map((cart) => {
        let expired = false;
        const checkDate = Date.now() > cart.expiry_date;

        if (checkDate) {
          expired = true;
        }

        return {
          cart_id: cart.id,
          user_id: cart.user_id,
          is_expired: expired,
        };
      });

      const createTag = checkCarts.map(async (cart) => {
        const data = {
          name: 'Expired',
          cart_id: cart.cart_id,
          user_id: cart.user_id,
        };

        const checkTag = await Tag.findOne({
          where: data,
        });

        let tag;
        if (checkTag) {
          console.log(
            `Tag Expired already exist for Cart with id: ${cart.cart_id}`
          );
          return tag;
        }

        if (!cart.is_expired) {
          console.log(`Cart with id: ${cart.cart_id} is not expired yet`);
          return tag;
        }

        tag = await Tag.create(data);
        console.log(`Tag Expired created for Cart with id: ${cart.cart_id}`);
        return tag;
      });

      Promise.all(createTag).then(() => {
        console.log('\n...checking completed!');
      });
    } catch (err) {
      console.log(err);
    }
  },
  null,
  true
);

checkExpiredCarts.start();
