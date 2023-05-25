import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

export const options = {
    executor: "shared-iterations",

    stages: [
        { duration: "1m", target: 50 }, //low traffic
        { duration: "1m", target: 100 }, //ramp up to average traffic
        { duration: "5m", target: 300 }, //slowly ramp up to high traffic
        { duration: "1m", target: 0 }, //ramp down to 0 logins 
    ],

    thresholds: {
        http_req_duration: [{ threshold: 'p(90) <500', abortOnFail: false }],
    },

};

export default function () {
    const url = 'https://testing.dev.metalradar.com/api/auth/login';
    const payload = JSON.stringify({
        email: `${__ENV.ADMINEMAIL}`, // run -e ADMINEMAIL=
        password: `${__ENV.ADMINPASSWORD}`, //run -e ADMINPASSWORD= 
    })

    const params = {
        headers: {
            'Content-type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);
    check(res, {
        'has status 200': (r) => r.status === 200,
        'response body has email': (r) => r.body.includes(`${__ENV.ADMINEMAIL}`),
    })
    console.log(res.timings.duration + 'ms' + "VU" + __VU);
};
