const API_URL = "https://pokeapi.co/api/v2/pokemon";
const detalhes = document.getElementById("detalhes");

// Lê o ID enviado pela URL (info.html?id=25)
const id = new URLSearchParams(window.location.search).get("id");

function mostrarMensagem(texto, ehErro = false) {
  detalhes.innerHTML = "";
  const p = document.createElement("p");
  p.classList.add("mensagem");
  if (ehErro) p.classList.add("erro");
  p.textContent = texto;
  detalhes.appendChild(p);
}

function criarTexto(tag, texto, classe) {
  const el = document.createElement(tag);
  el.textContent = texto;
  if (classe) el.classList.add(classe);
  return el;
}

function criarStat(stat) {
  const linha = document.createElement("div");
  linha.classList.add("stat");

  const barra = document.createElement("div");
  barra.classList.add("barra");
  const preenchida = document.createElement("div");
  preenchida.classList.add("barra-preenchida");
  preenchida.style.width = `${Math.min(stat.base_stat, 150) / 150 * 100}%`;
  barra.appendChild(preenchida);

  linha.append(
    criarTexto("span", stat.stat.name.replace("-", " "), "stat-nome"),
    barra,
    criarTexto("span", stat.base_stat, "stat-valor")
  );
  return linha;
}

function renderizar(p) {
  detalhes.innerHTML = "";
  document.title = `${p.name} – Pokédex`;

  const img = document.createElement("img");
  img.src = p.sprites.other["official-artwork"].front_default || p.sprites.front_default;
  img.alt = `Imagem de ${p.name}`;

  const tipos = document.createElement("div");
  p.types.forEach(t => tipos.appendChild(criarTexto("span", t.type.name, "tipo")));

  const info = document.createElement("div");
  info.classList.add("info");
  info.append(
    criarTexto("p", `Altura: ${p.height / 10} m`),
    criarTexto("p", `Peso: ${p.weight / 10} kg`),
    criarTexto("p", `Exp. base: ${p.base_experience ?? "—"}`)
  );

  const habilidades = criarTexto(
    "p",
    "Habilidades: " + p.abilities.map(a => a.ability.name.replace("-", " ")).join(", "),
    "habilidades"
  );

  const stats = document.createElement("section");
  stats.appendChild(criarTexto("h3", "Atributos base"));
  p.stats.forEach(s => stats.appendChild(criarStat(s)));

  detalhes.append(
    img,
    criarTexto("p", `#${p.id}`, "numero"),
    criarTexto("h2", p.name),
    tipos, info, habilidades, stats
  );
}

// ROTA 2: nova consulta à API usando o ID
async function carregarDetalhes() {
  if (!id) return mostrarMensagem("Nenhum Pokémon selecionado.", true);

  mostrarMensagem("Carregando...");
  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
    renderizar(await resposta.json());
  } catch (erro) {
    mostrarMensagem("Não foi possível carregar este Pokémon.", true);
    console.error(erro);
  }
}

carregarDetalhes();
