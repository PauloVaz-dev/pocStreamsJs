// V2 Busca do banco local com uso knes streams, retorna um PassThrough & AsyncIterable
// Faço um for await em cada dado que vem do banco e escrevo no pass que é um Buffer PassThrough
// Com o buffer finalizado, envio para o s3
// Usei AWS V3
import knex from "knex";
import { PassThrough, pipeline, Readable, Transform, Writable } from 'stream'
import AWS  from 'aws-sdk'
import { randomUUID as uuid} from 'crypto'


const s3 = new AWS.S3({
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://127.0.0.1:9000'),
    credentials: {
        accessKeyId: "local",
        secretAccessKey: "locallocal"
    },
    region: 'sa-east-1',
});


const readable = Readable({
    read() {
      for(let index = 0; index < 2; index++){
        const user = { id: uuid(),  name: `user-${index}\n`}
        // É necessário transformar em uma string, pois o Buffer suporta string 
        this.push(JSON.stringify(user))
      }
      this.push(null)
    }
  })

const writeToS3 = Writable({
    write(chunk, encoding, cb) {  
        console.log(chunk)   
        s3.upload({
            Bucket: 'poc-s3-vaz',
            Key: 'teste-bucket.txt',
            Body: chunk
        }, (err, data) => {
            if (err) throw err;
            console.log('Arquivo enviado com sucesso para o S3!');
        });
    }
  })

readable.pipe(writeToS3)



