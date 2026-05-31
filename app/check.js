const https = require('https');
https.get('https://video.musclewiki.com/v-mp4/Neck-Stretch-Male.mp4', (res) => {
  console.log(res.statusCode);
});
