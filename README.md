// Gabriel Caire Nomura       2501980   
// Heringson Lima             2404307   
// Rafael Ienne Manoel        2519853   
// Wesley da Silva Santos     2522594

# Consultar_Musica

# Primeiro Passo - Verifique se você tem tudo instalado
  
Você precisa ter instalado no seu computador:

Docker → para rodar o banco dentro de um contêiner

Node.js e npm → para rodar o código TypeScript

TypeScript e ts-node → para executar o .ts diretamente

Se ainda não tiver o TypeScript e o ts-node:

    npm install -g typescript ts-node

 #  Primeiro passo - Criar o container do PostgreSQL

Execute este comando no Git Bash ou no PowerShell:

    docker run --name meu_postgres -e POSTGRES_USER=aluno -e POSTGRES_PASSWORD=102030 -e POSTGRES_DB=db_profedu -p 5432:5432 -d postgres

 O que ele faz:

--name meu_postgres → nome do container

-e POSTGRES_USER=aluno → cria o usuário aluno

-e POSTGRES_PASSWORD=102030 → define a senha

-e POSTGRES_DB=db_profedu → cria o banco db_profedu

-p 5432:5432 → mapeia a porta do container para a do seu PC

-d postgres → usa a imagem oficial do PostgreSQL e roda em background

# Terceiro Passo
Verificar se o container está rodando

Rode:

      docker ps


Você deve ver algo como:

    CONTAINER ID   IMAGE      COMMAND                  STATUS         PORTS
    abc123...      postgres   "docker-entrypoint..."   Up ...         0.0.0.0:5432->5432/tcp


Se não estiver “Up”, inicie manualmente:

    docker start meu_postgres

    💻 4️⃣ Ajustar o host no código (se necessário)

No seu src/musica.ts, este trecho:

    host: "Wesley",


→ Troque por localhost se você estiver executando o Node fora do Docker (no seu computador).

Ficando assim:

    host: "localhost",


Use "Wesley" apenas se for o nome de rede que seu contêiner reconhece internamente — no caso mais comum, é localhost.

#  Estrutura do projeto

Exemplo de estrutura mínima:

    projeto-musica/
     ├── src/
     │   └── musica.ts
     ├── package.json
     └── tsconfig.json


Se não tiver package.json, crie com:

      npm init -y

E instale os pacotes necessários:

    npm install pg readline-sync

#  Compilar ou executar direto com ts-node

Você pode rodar direto sem compilar:

    npx ts-node src/musica.ts


# Ou, se preferir compilar e rodar o .js:

    npx tsc src/musica.ts
    node src/musica.js

# Testando o programa

Ao rodar, você verá:

    --- Cadastro de Nova Música ---
    Título da música:


Digite os valores pedidos (ex: título, artista, álbum etc.).
Quando terminar, ele criará a tabela musicas e inserirá o registro.

#  Conferir se deu certo dentro do banco

Você pode “entrar” no container e consultar direto:

    docker exec -it meu_postgres psql -U aluno -d db_profedu


Dentro do psql, execute:

    SELECT * FROM public.musicas;


Você verá suas músicas cadastradas.

#  Parar ou excluir o container (opcional)

Parar o container:

    docker stop meu_postgres


Excluir completamente:

    docker rm -f meu_postgres
