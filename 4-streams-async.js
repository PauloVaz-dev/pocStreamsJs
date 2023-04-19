// V2 Busca do banco local com uso knes streams, retorna um PassThrough & AsyncIterable
// Faço um for await em cada dado que vem do banco e escrevo no pass que é um Buffer PassThrough
// Com o buffer finalizado, envio para o s3
// Usei AWS V3
import knex from "knex";
import { PassThrough, pipeline, Readable } from 'stream'
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Client, S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { promisify } from 'util';
import Counter from 'passthrough-counter'

// Defining pipelineAsync method
const pipelineAsync = promisify(pipeline);

const s3 = new S3Client({
    forcePathStyle: true,
    endpoint: 'http://127.0.0.1:9000',
    credentials: {
        accessKeyId: "local",
        secretAccessKey: "locallocal"
    },
    region: 'sa-east-1',
});


const connection = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'docker',
    database: 'postgres',
    charset: 'utf8'
};
const db = knex({
    client: 'pg',
    connection
})

async function* getStatus() {
    const sql = `SELECT * FROM streamy ORDER BY id LIMIT`;
    const knexStream = db.select('*').from('status').limit(1000).stream()
    for await (const data of knexStream) {
        yield Buffer.from(JSON.stringify(data))
    }
    db.destroy()
}

async function upload(streams) {
    for await (const data of streams) {
        try {
            const input = {
                ACL: "public-read",  // ACL not needed if CloudFront can pull via OAI
                Bucket: 'poc-s3-vaz',
                Key: 'teste-bucket.txt',
                Body: data,
            }

            const multipartUpload = new Upload({
                client: s3,
                params: input,
                leavePartsOnError: true

            });
            multipartUpload.done()
            console.log("Upload file to:", `s3://${input.Bucket}/${input.Key}`);

        } catch (error) {
            console.log(error)
        }
    }
}


await pipelineAsync(
    getStatus,
    upload,
)





