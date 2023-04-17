// Exemplo de vendo um arquivo ou criando um readable streams gero o mesmo resultado
import AWS from 'aws-sdk'
import { Readable, Transform } from 'stream'

// Crie um cliente do S3
const s3 = new AWS.S3({
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://127.0.0.1:9000'),
    credentials: {
        accessKeyId: "local",
        secretAccessKey: "locallocal"
    },
    region: 'sa-east-1',
});

// Crie uma `readable stream` que contém o texto "Olá, mundo!"
const readableStream = new Readable({
    read() {
        this.push('{"id":"8934d0f0-8f53-4efe-b77b-dcb825ce18ef","name":"user-0"}\n');
        this.push('{"id":"8934d0f0-8f53-4efe-b77b-dcb825ce18ef","name":"user-0"}\n');
        this.push('{"id":"8934d0f0-8f53-4efe-b77b-dcb825ce18ef","name":"user-0"}\n');
        this.push(null);
    }
});

// Envie o conteúdo da `readable stream` para o S3
s3.upload({
    Bucket: 'poc-s3-vaz',
    Key: 'teste-bucket.txt',
    Body: readableStream
}, (err, data) => {
    if (err) throw err;
    console.log('Arquivo enviado com sucesso para o S3!');
});


