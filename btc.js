var rest = require('restler');
var seconds = 0;
var interval = 31;
var cookie = process.env.LOBBOT;
resultstr = '';
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}
if (!cookie) {
	throw new Error('Please include your Cookie: header as process.env.LOBBOT')
}
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return hour + ":" + min + ":" + sec;

}
setInterval(function() {
rest.get('http://www.landofbitcoin.com/index/update?r=' + Date.now(), {headers: {'Cookie': process.env.LOBBOT}}).on('complete', function(result) {
	seconds++;
  if (result instanceof Error) {
    console.log('Error: ' + result.message);
  } else {
  	result = JSON.parse(result);
  	if (!result.balance) {
  		process.stdout.write('\x08'.repeat(resultstr.length));
  	resultstr = 'Error: Could not get balance. Please make sure you have configured this correctly'
    process.stdout.write(resultstr);
    return;
  	}
  	if (!resultstr) {
  		resultstr = '';
  	}
  	if (result.action) {
  		if (result.action === 'show_open_facuet_offer') {
  			resultstr = 'ALERT: CAPTCHA needed. Please solve at landofbitcoin.com! ¦ ' + result.balance
  		}
  	}
  	else {
  	process.stdout.write('\x08'.repeat(resultstr.length * 2));
  	resultstr = 'Running ¦ ' + result.balance + ' gathered so far ¦ ' + (interval - seconds) + ' secs to payout ¦ ' + getDateTime();
  	if (seconds >= interval) {
  		seconds = 0;
  	}
    process.stdout.write(resultstr);
}
  }
});
}, 1000);
process.on('SIGTERM', function() {
	console.log('\n\nThanks for using landofbitcoin-bot by whiskers75!');
	process.exit(0);
})