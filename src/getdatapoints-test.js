import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

export const options = {
    stages: [
        { duration: "1m", target: 100 }, //low traffic
        { duration: "1m", target: 200 }, //ramp up to average traffic
        { duration: "5m", target: 300 }, //slowly ramp up to high traffic
        { duration: "1m", target: 0 }, //ramp down to 0 logins 
    ],

    thresholds: {
        http_req_duration: [{ threshold: 'p(90) <500', abortOnFail: false }],
    },
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
        'has status 200': (res) => res.status === 200,
        'response body has metals': (res) => res.body.includes('LME-CU', 'LME-SN', 'LME-CO'),
    })
    console.log(res.timings.duration + 'ms' + "VU" + __VU);
};