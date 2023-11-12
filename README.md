<img
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Deno.svg/120px-Deno.svg.png"
  style="float: right; vertical-align: top; width:5rem; height:5rem; color: #ffffff;"
  alt="Logo DenoLand"
/>

# Deno FileHandler
É um serviço voltado para a partir de um arquivo CSV com dados massivos popular o banco de dados, foi escolhido o Deno pelo fato de não precisar de node_modules para importar bibliotecas e também pelo fato de rodar nativamente TypeScript sem a necessidade de um bundler.

Foi Utilizado MySQL para utilizarmos um banco de dados relacional. Para trazer mais performance caso queira fazer diversas tabelas para inserção desses dados massivos no banco de dados.

Projeto está dockerizado rodando o LocalStack imagem que abstrai a AWS, para também subirmos esse arquivo num bucket do S3.
Projeto também visa solucionar o mesmo problema caso o S3 esteja comprometido, ele fica escutando uma mensagem no SQS da AWS, para também popular uma tabela no banco de dados.

Chamei essa tabela de tb_person, mas ela pode ser facilmente mudada na migration que eu criei juntamente de um model que componha os atributos dessa tabela.

Neste projeto também foi incluido Cron Jobs, para ele ficar escutando o banco de dados, sempre que o status do arquivo for zero que é, pendente, ele mandar para um dos serviços da AWS para a aplicação assim popular o banco de dados de acordo com esse status, e somente depois de concluido atualizar para status um que seria disparado.

Projeto feito com muito carinho, obviamente tem muito a melhorar, mas o intuito foi pegar algo que eu desconhecia completamente que era o Deno, juntamente da AWS e completar esse projeto.

### Comandos para rodar o projeto
Para rodar o projeto com docker em background: `docker-compose up -d`
Este comando vai baixar a imagem do MySQL na versão 8, do LocalStack na ultima versão e do Deno na última versão LTS.

Para rodar o projeto em local basta rodar o comando `deno task local` na máquina

#### Rotas Principais:

```http
POST localhost:5001/v1/api/uploadFile/
```
| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `file` | `multipart/form-data` | **Obrigatório**. arquivo .csv de exemplo no projeto|

Retorno de sucesso:
```json
{
  "message": "File upload with success!",
  "file": "bd40728a-e82b-4dce-91e0-c6d4701ab7ef.csv"
}
```
----
```http
GET localgost:5001/v1/api/listAllFiles/
```
```json
[
  {
    "id": "63997d71-80d5-11ee-b9ca-0242ac1a0002",
    "name": "b1efa05c-e596-47db-b02e-54801d9ab054.csv",
    "created_at": "2023-11-12T00:00:48.000Z"
  },
  {
    "id": "64e96761-80d1-11ee-b9ca-0242ac1a0002",
    "name": "59254608-8743-4527-849d-2e0f832cbfe1.csv",
    "created_at": "2023-11-11T23:32:12.000Z"
  }
]
```

----
```http
POST localhost:5001/v1/api/createPerson/
```
| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `filename` | `string` | **Obrigatório**. nome do arquivo .csv de exemplo no projeto|

Exemplo:
```json
{
  "filename":  "59254608-8743-4527-849d-2e0f832cbfe1.csv"
}
```
Retorno de sucesso:
```json
[
  {
    "name": "João",
    "age": 25,
    "sex": "M",
    "size": 175,
    "weight": 70
  },
  {
    "name": "Maria",
    "age": 30,
    "sex": "F",
    "size": 160,
    "weight": 55
  },
  {
    "name": "Carlos",
    "age": 22,
    "sex": "M",
    "size": 180,
    "weight": 75
  },
  {
    "name": "Ana",
    "age": 28,
    "sex": "F",
    "size": 165,
    "weight": 60
  },
  ...
]
```
----
```http
GET localgost:5001/v1/api/listPersons/
```
Retorno de Sucesso:
```json
{
 [
  {
    "id": "cd42905b-8105-11ee-b9ca-0242ac1a0002",
    "name": "João",
    "age": 25,
    "sex": "M",
    "size": "175.00",
    "weight": "70.00"
  },
  {
    "id": "cd45cb43-8105-11ee-b9ca-0242ac1a0002",
    "name": "Maria",
    "age": 30,
    "sex": "F",
    "size": "160.00",
    "weight": "55.00"
  },
  {
    "id": "cd4ccb2d-8105-11ee-b9ca-0242ac1a0002",
    "name": "Carlos",
    "age": 22,
    "sex": "M",
    "size": "180.00",
    "weight": "75.00"
  },
  {
    "id": "cd50c0bf-8105-11ee-b9ca-0242ac1a0002",
    "name": "Ana",
    "age": 28,
    "sex": "F",
    "size": "165.00",
    "weight": "60.00"
  },
  ...
 ]
}
```