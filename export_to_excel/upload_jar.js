const fs = require('fs');
const http = require('http');

const filePath = 'maximo-server-jxls/target/maximo-server-jxls-1.0.0.jar';
const fileName = 'maximo-server-jxls-1.0.0.jar';
const uploadUrl = 'http://36.134.146.70:5550/upload';

const fileContent = fs.readFileSync(filePath);

const boundary = '----WebKitFormBoundary' + Math.random().toString(16);
const crlf = '\r\n';

const parts = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
    'Content-Type: application/java-archive',
    '',
    fileContent,
    `--${boundary}--`,
    ''
];

const body = Buffer.concat(parts.map(part => 
    typeof part === 'string' ? Buffer.from(part + crlf) : part
));

const options = {
    hostname: '36.134.146.70',
    port: 5550,
    path: '/upload',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Response status:', res.statusCode);
        console.log('Response:', data);
        if (res.statusCode === 200) {
            console.log('Upload successful!');
        } else {
            console.log('Upload failed!');
        }
    });
});

req.on('error', (e) => {
    console.error('Error:', e.message);
});

req.write(body);
req.end();