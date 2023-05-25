import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

export const options = {
    
}

export default function () {
    const url = 'https://development.dev.metalradar.com/api/data/datapoint';
    const payload = JSON.stringify({
        email: `${__ENV.ADMINEMAIL}`, // run -e ADMINEMAIL=
        password: `${__ENV.ADMINPASSWORD}`, //run -e ADMINPASSWORD= 
    });
    const params = {
        headers: {
            'Content-type': 'application/json',
        },
    }
    const res = http.get(url, payload, params);
    check(res, {
        'has status 200': (r) => r.status === 200,
        'response body has metals': (r) => r.body.includes('LME-CU', 'LME-SN', 'LME-CO'),
    })
    console.log(res.timings.duration + 'ms' + "VU" + __VU);
}