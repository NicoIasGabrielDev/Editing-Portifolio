# Nicolas — portfólio de edição

Código completo da versão em inglês, com fundo escuro, tons azuis, logo n e sua foto. HTML, CSS e JavaScript puro, sem framework ou compilação. Os arquivos do site estão na raiz para facilitar a publicação pelo GitHub Pages.

## Abrir no editor

1. Extraia o ZIP.
2. Abra a pasta `nicolas-portfolio` no Visual Studio com Arquivo > Abrir > Pasta, ou abra a mesma pasta no VS Code.
3. Edite os arquivos normalmente. Não é necessário criar uma solução C# nem instalar dependências para o site.

## Visualizar localmente

Como o site usa módulos JavaScript, execute um servidor local em vez de abrir index.html com duplo clique.

Se tiver Python instalado, abra o terminal dentro da pasta do projeto e execute:

```sh
python -m http.server 5500
```

No Windows, se o comando python não estiver disponível mas o Python Launcher estiver instalado, use:

```sh
py -m http.server 5500
```

Abra http://localhost:5500 no navegador. Para parar, use Ctrl+C no terminal.

## Personalizar

- `index.html`: texto sobre você e estrutura das seções.
- `styles.css`: cores, fontes e layout.
- `portfolio.js`: seu nome, links do Twitter/Discord e vídeos.
- `app.js`: filtros, reprodução e botões sociais.
- `media.js`: validação de links de vídeo.
- `assets/profile.jpg`: sua foto.
- `favicon.svg`: ícone n da aba.

Em `portfolio.js`, preencha twitter e discord com URLs completas HTTPS dos seus perfis ou convite do Discord. Enquanto estiverem vazios, aparecem como pendentes.

Para cada projeto, edite title, category (opcional), source e poster (opcional):

```js
{
  id: 'h1',
  format: 'horizontal',
  title: 'Título do trabalho',
  category: 'YouTube',
  source: '', // Coloque aqui seu link HTTPS do vídeo.
  poster: '' // Opcional: imagem HTTPS ou caminho relativo, como assets/capa.jpg.
}
```

source aceita links HTTPS do YouTube, Vimeo ou arquivos .mp4/.webm hospedados. O vídeo deve permitir incorporação. Links de página do Google Drive, Instagram ou TikTok não são arquivos reproduzíveis e não são suportados. Deixe source vazio para manter o espaço reservado. Para verticais, use format: 'vertical'; para horizontais, 'horizontal'. Adicione/remova objetos em projects conforme necessário.

O site usa Google Fonts e tem fontes locais alternativas caso não estejam disponíveis.

## Enviar ao GitHub

Crie um repositório vazio no GitHub, sem README inicial. No terminal desta pasta, execute um comando por vez, substituindo SEU_USUARIO e SEU_REPOSITORIO:

```sh
git init
git add .
git commit -m "Add editing portfolio"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

Você pode autenticar pelo fluxo normal do GitHub/Git Credential Manager. Não coloque tokens em arquivos do projeto.

## Publicar o site com GitHub Pages

1. No repositório, abra Settings > Pages.
2. Em Build and deployment > Source, escolha Deploy from a branch.
3. Selecione a branch main e a pasta /(root).
4. Clique Save e aguarde a publicação. O GitHub mostrará a URL do site.

Envie os arquivos da pasta nicolas-portfolio para a raiz do repositório: o index.html precisa ficar na raiz, não dentro de uma pasta extra. Em conta GitHub Free, essa opção está disponível para repositórios públicos. Apenas subir o código ao GitHub não ativa o GitHub Pages automaticamente.

Documentação oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Testes opcionais

Se tiver Node.js instalado:

```sh
npm test
```

Não precisa executar npm install: os testes usam apenas o Node. Os testes validam links de mídia; não substituem uma conferência visual do site.

## Atualização dos trabalhos

O site inclui apenas dois vídeos reais: Eystreem VOD edit (4:22) e Minecraft Without Rushing (0:41). Ambos os arquivos publicados são horizontais, 16:9. Os espaços vazios foram removidos. Os cards aparecem lado a lado no computador e empilhados no celular. As capas são fornecidas pelo YouTube. Os filtros ficam escondidos quando todos os vídeos têm o mesmo formato; suporte a verticais continua disponível em portfolio.js. Cada vídeo pode ser aberto no player ou diretamente no YouTube.
