// src/musica.ts

import { Pool } from "pg";
const readlineSync = require("readline-sync");

// Configuração da conexão
// CORREÇÃO: Voltando para 'db_profedu' que é o nome do DB visível na sua árvore de objetos.
const dbConfig = {
    user: "aluno",
    host: "Wesley",
    database: "db_profedu", // CORRIGIDO: Assumindo que a tabela está aqui.
    password: "102030",
    port: 5432,
};

const pool = new Pool(dbConfig);

async function inserirMusica(): Promise<void> {
    console.log("--- Cadastro de Nova Música ---");

    const titulo = readlineSync.question("Título da música: ");
    const artista = readlineSync.question("Artista: ");
    const album = readlineSync.question("Álbum (opcional): ");
    const genero = readlineSync.question("Gênero: ");
    const duracao = readlineSync.question("Duração (ex: 3:45): ");
    const ano = readlineSync.questionInt("Ano de lançamento: ");

    if (!titulo || !artista || !genero || !duracao || !ano) {
        console.error("Erro: Campos obrigatórios ausentes.");
        return;
    }

    let client;
    try {
        client = await pool.connect();
        
        // --- INÍCIO DA TRANSAÇÃO PARA GARANTIR O COMMIT ---
        await client.query('BEGIN');

        // Criação da tabela caso ainda não exista
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

        // Inserção dos dados
        const insertQuery = `
            INSERT INTO public.musicas (titulo, artista, album, genero, duracao, ano)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [titulo, artista, album, genero, duracao, ano];

        await client.query(insertQuery, values);
        
        // COMMIT: Salva as alterações permanentemente
        await client.query('COMMIT'); 
        
        // --- FIM DA TRANSAÇÃO ---

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
        if (client) {
            // ROLLBACK: Desfaz a transação em caso de erro
            await client.query('ROLLBACK');
        }
        console.error("Erro ao interagir com o banco de dados:", error);
    } finally {
        if (client) {
            // Devolve o cliente ao pool
            client.release();
        }
        await pool.end();
        console.log("Conexão com o banco de dados encerrada.");
    }
}

inserirMusica();