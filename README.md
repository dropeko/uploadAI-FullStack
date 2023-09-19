# UploadAI: Aplicação de IA Generativa para Transcrição e Geração de Títulos e Descrições para Vídeos do YouTube

## Visão Geral

Este projeto é uma aplicação web full stack desenvolvida em TypeScript que utiliza IA generativa para transcrever áudio de vídeos do YouTube e gerar automaticamente títulos e descrições de alta qualidade para esses vídeos. Esta documentação detalha os componentes principais do projeto, as tecnologias utilizadas e os passos necessários para configurar e executar a aplicação.

## Tecnologias Utilizadas

### Frontend

- **React.js:** Uma biblioteca JavaScript de código aberto para construção de interfaces de usuário.
- **TailwindCSS:** Um framework CSS utilitário para criação rápida de interfaces atraentes.
- **Shadcn/ui e Radixcn/ui:** Componentes UI personalizados para uma experiência de usuário consistente.
- **Vite:** Um construtor de aplicativos da web rápido que otimiza o desenvolvimento.
- **ffmpeg:** Uma ferramenta para manipulação de vídeo e áudio.
- **Axios:** Uma biblioteca para realizar requisições HTTP.
- **lucid-react:** Componentes React para uma interface de usuário atraente.

### Backend

- **Prisma:** Um ORM (Object-Relational Mapping) para gerenciar o banco de dados.
- **API OpenAI:** A API da OpenAI para geração de texto usando IA generativa.
- **Fastify:** Um framework web rápido e eficiente.
- **zod:** Uma biblioteca para validação de esquema.

Ambos o frontend e o backend são desenvolvidos em **TypeScript**, garantindo tipagem estática e uma experiência de desenvolvimento mais segura.

## Configuração do Ambiente

Para configurar o ambiente de desenvolvimento e execução, siga os passos abaixo:

1. Clone o repositório para sua máquina local.

   ```bash
   git clone https://github.com/dropeko/uploadAI-FullStack.git
   cd uploadAI-FullStack

2. Instale as dependências do frontend e backend.
  - 2.1:
    - **Dentro da pasta 'frontend'**
      ```bash
        cd frontend
        npm install

 - 2.2:
    - **Dentro da pasta 'backend'**
      
      ```bash
        cd ../backend
        npm install

3. Configure as variáveis de ambiente necessárias:
  - Crie um arquivo .env na pasta ./backend/ para armazenar suas variáveis de ambiente sensíveis, como chaves de API.
  - As variaveis .env são:
    - DATABASE_URL="file:./dev.db"
    - OPENAI_KEY="Sua API Key da OpenAI"

4. Inicialize os servidores backend e frontend.
  - 4.1:
      - **Dentro da pasta 'backend'**
        ```bash
          npm run dev

  - 4.2:
      - **Dentro da pasta 'frontend'**
        ```bash
          npm run dev


## Uso da Aplicação

Após a configuração bem-sucedida, a aplicação estará disponível em `http://localhost:5173`. Você pode acessar a interface do usuário e começar a transcrever áudio de vídeos do YouTube e gerar títulos e descrições automaticamente.

## Contribuindo

Ficaria feliz com contribuições para melhorar este projeto. Sinta-se à vontade para abrir problemas (issues) e enviar pull requests (PRs) em nosso repositório GitHub.

## Equipe de Desenvolvimento

- PHCA.dev 💻💡
  - Email: pedrocoli_andrade@hotmail.com
