<img
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Deno.svg/120px-Deno.svg.png"
  style="float: right; vertical-align: top; width:5rem; height:5rem;"
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