# Descrição:

Projeto destinado a fazer stremas do banco e salvar no S3.

## 1 - Existe um docker-compose para subir o banco e o S3

#### Rodar o container
```bash
cd docker
~/.docker/cli-plugins/docker-compose up
```
#### Criar o bucket
```bash
aws --endpoint-url=http://127.0.0.1:9000 s3api create-bucket --bucket poc-s3-vaz
```

## 2 - Para rodar alguns dos scripts:
#### Rodar o script
```bash
$npx ts-node-dev knexv4.ts
```
#### Copias do bucket para a maquina local
```bash
aws s3 --endpoint-url=http://127.0.0.1:9000 cp s3://poc-s3-vaz/sms.csv .
```


#### Certificar que o carquivo foi gerando com a quantidade de linhas
```bash
wl -l sms.csv
```

### Para ver o uso de memória

1 - Instale o climem com dev

$npm i climem -D

#### Rode o projeto passando essas variáveis
CLIMEM=8000 npx ts-node-dev -r climem  knexv4.ts

#### Em outro terminal rode
npx climem 8000




