const API_URL = "https://pokeapi.co/api/v2/pokemon";
const POR_PAGINA = 20;
let pagina = 0;

const lista = document.getElementById("lista");
const btnAnterior = document.getElementById("btn-anterior");
const btnProximo = document.getElementById("btn-proximo");
const paginaAtual = document.getElementById("pagina-atual");

// Extrai o ID da URL retornada pela API (ex.: ".../pokemon/25/" -> 25)
function extrairId(url) {
  return url.split("/").filter(Boolean).pop();
}

function mostrarMensagem(texto, ehErro = false) {
  lista.innerHTML = "";
  const p = document.createElement("p");
  p.classList.add("mensagem");
  if (ehErro) p.classList.add("erro");
  p.textContent = texto;
  lista.appendChild(p);
}

// Cria um card para cada pokémon
function criarCard(pokemon) {
  const id = extrairId(pokemon.url);

  const card = document.createElement("article");
  card.classList.add("card");

  const img = document.createElement("img");
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  img.alt = `Imagem de ${pokemon.name}`;
  img.loading = "lazy";

  const numero = document.createElement("span");
  numero.classList.add("numero");
  numero.textContent = `#${id}`;

  const nome = document.createElement("h2");
  nome.textContent = pokemon.name;

  const link = document.createElement("a");
  link.classList.add("botao");
  link.href = `paginaInfo/info.html?id=${id}`; // envia o ID para a Rota 2
  link.textContent = "Ver detalhes";

  card.append(img, numero, nome, link);
  return card;
}

// ROTA 1: busca a listagem geral na API
async function carregarLista() {
  mostrarMensagem("Carregando...");
  try {
    const url = `${API_URL}?limit=${POR_PAGINA}&offset=${pagina * POR_PAGINA}`;
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
    const dados = await resposta.json();

    lista.innerHTML = "";
    dados.results.forEach(p => lista.appendChild(criarCard(p)));

    paginaAtual.textContent = `Página ${pagina + 1}`;
    btnAnterior.disabled = !dados.previous;
    btnProximo.disabled = !dados.next;
  } catch (erro) {
    mostrarMensagem("Não foi possível carregar os dados. Tente novamente.", true);
    console.error(erro);
  }
}

btnAnterior.addEventListener("click", () => { pagina--; carregarLista(); });
btnProximo.addEventListener("click", () => { pagina++; carregarLista(); });

carregarLista();
