import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";


// Tipamos o parametro da função como uma instancia do fastify para podermos acessar os metodos 
export async function getAllPromptsRoute(app: FastifyInstance) {
// Rota responsavel por listar todos os prompts que tenho cadastrado
app.get('/prompts', async () => {
  // Importa o lib/prisma, acessa a table prompt e usa o método 'findMany()' para trazer todos os prompts cadastrados na bd
  const prompts = await prisma.prompt.findMany()


  return prompts
})
}