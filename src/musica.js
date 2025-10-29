"use strict";
// src/musica.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var readlineSync = require("readline-sync");
// Configuração da conexão
// CORREÇÃO: Voltando para 'db_profedu' que é o nome do DB visível na sua árvore de objetos.
var dbConfig = {
    user: "aluno",
    host: "Wesley",
    database: "db_profedu", // CORRIGIDO: Assumindo que a tabela está aqui.
    password: "102030",
    port: 5432,
};
var pool = new pg_1.Pool(dbConfig);
function inserirMusica() {
    return __awaiter(this, void 0, void 0, function () {
        var titulo, artista, album, genero, duracao, ano, client, insertQuery, values, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("--- Cadastro de Nova Música ---");
                    titulo = readlineSync.question("Título da música: ");
                    artista = readlineSync.question("Artista: ");
                    album = readlineSync.question("Álbum (opcional): ");
                    genero = readlineSync.question("Gênero: ");
                    duracao = readlineSync.question("Duração (ex: 3:45): ");
                    ano = readlineSync.questionInt("Ano de lançamento: ");
                    if (!titulo || !artista || !genero || !duracao || !ano) {
                        console.error("Erro: Campos obrigatórios ausentes.");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 10, 12]);
                    return [4 /*yield*/, pool.connect()];
                case 2:
                    client = _a.sent();
                    // --- INÍCIO DA TRANSAÇÃO PARA GARANTIR O COMMIT ---
                    return [4 /*yield*/, client.query('BEGIN')];
                case 3:
                    // --- INÍCIO DA TRANSAÇÃO PARA GARANTIR O COMMIT ---
                    _a.sent();
                    // Criação da tabela caso ainda não exista
                    return [4 /*yield*/, client.query("\n            CREATE TABLE IF NOT EXISTS public.musicas (\n                id SERIAL PRIMARY KEY,\n                titulo VARCHAR(100) NOT NULL,\n                artista VARCHAR(100) NOT NULL,\n                album VARCHAR(100),\n                genero VARCHAR(50),\n                duracao VARCHAR(10),\n                ano INT\n            );\n        ")];
                case 4:
                    // Criação da tabela caso ainda não exista
                    _a.sent();
                    insertQuery = "\n            INSERT INTO public.musicas (titulo, artista, album, genero, duracao, ano)\n            VALUES ($1, $2, $3, $4, $5, $6)\n        ";
                    values = [titulo, artista, album, genero, duracao, ano];
                    return [4 /*yield*/, client.query(insertQuery, values)];
                case 5:
                    _a.sent();
                    // COMMIT: Salva as alterações permanentemente
                    return [4 /*yield*/, client.query('COMMIT')];
                case 6:
                    // COMMIT: Salva as alterações permanentemente
                    _a.sent();
                    // --- FIM DA TRANSAÇÃO ---
                    console.log("-----------------------------------------");
                    console.log("Música cadastrada com sucesso!");
                    console.log("T\u00EDtulo: ".concat(titulo));
                    console.log("Artista: ".concat(artista));
                    console.log("\u00C1lbum: ".concat(album));
                    console.log("G\u00EAnero: ".concat(genero));
                    console.log("Dura\u00E7\u00E3o: ".concat(duracao));
                    console.log("Ano: ".concat(ano));
                    console.log("-----------------------------------------");
                    return [3 /*break*/, 12];
                case 7:
                    error_1 = _a.sent();
                    if (!client) return [3 /*break*/, 9];
                    // ROLLBACK: Desfaz a transação em caso de erro
                    return [4 /*yield*/, client.query('ROLLBACK')];
                case 8:
                    // ROLLBACK: Desfaz a transação em caso de erro
                    _a.sent();
                    _a.label = 9;
                case 9:
                    console.error("Erro ao interagir com o banco de dados:", error_1);
                    return [3 /*break*/, 12];
                case 10:
                    if (client) {
                        // Devolve o cliente ao pool
                        client.release();
                    }
                    return [4 /*yield*/, pool.end()];
                case 11:
                    _a.sent();
                    console.log("Conexão com o banco de dados encerrada.");
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
inserirMusica();
