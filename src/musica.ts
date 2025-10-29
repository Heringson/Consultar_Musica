// ==========================================
// SISTEMA DE CADASTRO DE MÚSICAS
// ==========================================

// Importa o módulo 'pg' (PostgreSQL) para conexão com o banco de dados
import { Pool } from "pg";

// Importa o pacote readline-sync para capturar dados digitados pelo usuário no terminal
const readlineSync = require("readline-sync");

// ------------------------------------------
// CONFIGURAÇÃO DA CONEXÃO COM O BANCO DE DADOS
// ------------------------------------------
// Aqui são informados os dados necessários para o PostgreSQL:
// - user: nome do usuário do banco
// - host: endereço do servidor (pode ser localhost ou o nome do container Docker)
// - database: nome do banco de dados
// - password: senha do usuário
// - port: porta padrão do PostgreSQL (5432)
const dbConfig = {
    user: "aluno",
    host: "Wesley",
    database: "db_profedu",
    password: "102030",
    port: 5432,
};

// Cria uma instância do Pool, que gerencia conexões com o banco
const pool = new Pool(dbConfig);

// ------------------------------------------
// FUNÇÃO PRINCIPAL DE INSERÇÃO DE MÚSICA
// ------------------------------------------
async function inserirMusica(): Promise<void> {
    console.log("--- Cadastro de Nova Música ---");

    // Solicita ao usuário os dados da música
    const titulo = readlineSync.question("Título da música: ");
    const artista = readlineSync.question("Artista: ");
    const album = readlineSync.question("Álbum (opcional): ");
    const genero = readlineSync.question("Gênero: ");
    const duracao = readlineSync.question("Duração (ex: 3:45): ");
    const ano = readlineSync.questionInt("Ano de lançamento: ");

    // Verifica se os campos obrigatórios foram preenchidos
    if (!titulo || !artista || !genero || !duracao || !ano) {
        console.error("Erro: Campos obrigatórios ausentes.");
        return; // Sai da função sem continuar
    }

    let client; // Variável que armazenará a conexão ativa
    try {
        // Obtém uma conexão (client) do pool
        client = await pool.connect();
        
        // Inicia uma transação para garantir que as operações ocorram juntas
        await client.query('BEGIN');

        // Cria a tabela 'musicas' se ela ainda não existir
        // Isso evita erros caso seja a primeira execução
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.musicas (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(100) NOT NULL,
                artista VARCHAR(100) NOT NULL,
                album VARCHAR(100),
                genero VARCHAR(50),
                duracao VARCHAR(10),
                ano INT
            );
        `);

        // Monta o comando SQL para inserir uma nova linha na tabela
        // O uso de $1, $2... garante segurança contra SQL Injection
        const insertQuery = `
            INSERT INTO public.musicas (titulo, artista, album, genero, duracao, ano)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        // Prepara o vetor com os valores informados pelo usuário
        const values = [titulo, artista, album, genero, duracao, ano];

        // Executa o comando de inserção
        await client.query(insertQuery, values);
        
        // Confirma a transação, salvando definitivamente no banco
        await client.query('COMMIT'); 
        
        // Exibe os dados cadastrados no console
        console.log("-----------------------------------------");
        console.log("Música cadastrada com sucesso!");
        console.log(`Título: ${titulo}`);
        console.log(`Artista: ${artista}`);
        console.log(`Álbum: ${album}`);
        console.log(`Gênero: ${genero}`);
        console.log(`Duração: ${duracao}`);
        console.log(`Ano: ${ano}`);
        console.log("-----------------------------------------");

    } catch (error) {
        // Se algo der errado, desfaz a transação (ROLLBACK)
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error("Erro ao interagir com o banco de dados:", error);
    } finally {
        // Libera o cliente de volta ao pool, mesmo que tenha dado erro
        if (client) {
            client.release();
        }

        // Encerra o pool (fecha todas as conexões)
        await pool.end();
        console.log("Conexão com o banco de dados encerrada.");
    }
}

// Chama a função principal para iniciar o cadastro
inserirMusica();
