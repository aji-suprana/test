const axios = require('axios');
module.exports = async (req,res)=>{
  try{
    console.log(req.query);
    const hub = (await axios.get(`${process.env.FB_HOST}/3336348869710750/subscriptions`, {
      params: {
          access_token: "3336348869710750|c26cf953c27e54010ddd408fac501cb0"
      }
  })).data;
      console.log('test123');
      return res.status(200).send(req.query['hub.challenge'])
  }    catch (err) {
    console.log(err.message);
    return res
        .status(err.code === 'E_NOT_FOUND' ? 404 : 500)
        .json({
            status: 'failed',
            message: err.message
        });
}


}