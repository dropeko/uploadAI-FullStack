import { PrismaClient } from "@prisma/client";

// Faz automagicamente a conexão com o banco de dados
export const prisma = new PrismaClient()