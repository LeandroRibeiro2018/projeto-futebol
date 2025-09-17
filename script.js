const perguntas = [
  { pergunta: "Qual sua posição favorita?", opcoes: ["Goleiro","Defensor","Meia","Atacante"] },
  { pergunta: "Qual sua maior qualidade?", opcoes: ["Velocidade","Criatividade","Finalização","Liderança"] },
  { pergunta: "Qual seu pé preferido?", opcoes: ["Direito","Esquerdo","Ambidestro"] },
  { pergunta: "Você prefere ser...", opcoes: ["Ídolo em clube pequeno","Estrela em clube gigante"] }
];

const clubes = [
  "Flamengo","Palmeiras","Corinthians","São Paulo","Santos","Grêmio","Internacional","Atlético Mineiro","Cruzeiro","Vasco","Botafogo",
  "Barcelona","Real Madrid","Atlético de Madrid","Sevilla",
  "Manchester United","Manchester City","Liverpool","Chelsea","Arsenal","Tottenham",
  "PSG","Lyon","Marseille",
  "Bayern de Munique","Borussia Dortmund","RB Leipzig",
  "Juventus","Milan","Inter de Milão","Napoli","Roma"
];

const nacionalidades = ["🇧🇷 Brasil","🇦🇷 Argentina","🇵🇹 Portugal","🇫🇷 França","🇪🇸 Espanha","🇮🇹 Itália","🏴 Inglaterra","🇩🇪 Alemanha","🇺🇾 Uruguai"];
const nomes = ["João Silva","Carlos Mendes","Rafael Costa","Diego Santos","Lucas Pereira","Matheus Rocha","André Oliveira","Pedro Gomes","Thiago Lima"];

let respostas = [], indice=0, nomeFinal="", nacionalidadeFinal="", generoFoto="Aleatório", fotoUpload="";

function mostrarUpload(){
  const select = document.getElementById("fotoJogador").value;
  document.getElementById("uploadFoto").style.display = (select==="Upload") ? "block" : "none";
}

function iniciarQuiz() {
  const nomeInput=document.getElementById("nomeJogador").value.trim();
  const nacionalidadeInput=document.getElementById("nacionalidadeJogador").value;
  generoFoto=document.getElementById("fotoJogador").value;
  const uploadInput=document.getElementById("uploadFoto");

  nomeFinal = nomeInput || nomes[Math.floor(Math.random()*nomes.length)];
  nacionalidadeFinal = (nacionalidadeInput==="Aleatório") ? nacionalidades[Math.floor(Math.random()*nacionalidades.length)] : nacionalidadeInput;

  if (generoFoto==="Upload" && uploadInput.files[0]) {
    const reader=new FileReader();
    reader.onload=function(e){ fotoUpload=e.target.result; };
    reader.readAsDataURL(uploadInput.files[0]);
  }

  document.getElementById("config").style.display="none";
  document.getElementById("quiz-container").style.display="block";
  mostrarPergunta();
}

function mostrarPergunta(){
  if(indice<perguntas.length){
    const q=perguntas[indice];
    let html=`<h2>${q.pergunta}</h2>`;
    q.opcoes.forEach(opcao=>{
      html+=`<button onclick="responder('${opcao}')">${opcao}</button>`;
    });
    document.getElementById("quiz-container").innerHTML=html;
  }else{gerarCarta();}
}

function responder(opcao){respostas.push(opcao);indice++;mostrarPergunta();}

function gerarCarta(){
  document.getElementById("quiz-container").style.display="none";

  const posicao = respostas[0] || "Meia";
  const qualidade = respostas[1] || "Velocidade";

  // Stats mais altos (60–80)
  let stats = {
    PAC: Math.floor(Math.random() * 21) + 60,
    SHO: Math.floor(Math.random() * 21) + 60,
    PAS: Math.floor(Math.random() * 21) + 60,
    DRI: Math.floor(Math.random() * 21) + 60,
    DEF: Math.floor(Math.random() * 21) + 60,
    PHY: Math.floor(Math.random() * 21) + 60
  };

  // Ajustes pelo quiz
  if (qualidade === "Velocidade") stats.PAC += 15;
  if (qualidade === "Criatividade") stats.PAS += 15;
  if (qualidade === "Finalização") stats.SHO += 15;
  if (qualidade === "Liderança") stats.PHY += 10;

  // Variação aleatória extra (-5 a +5)
  for (let key in stats) {
    stats[key] += Math.floor(Math.random()*11)-5;
    stats[key] = Math.max(40, Math.min(99, stats[key]));
  }

  // Overall médio (75–90)
  let overall = Math.floor((stats.PAC+stats.SHO+stats.PAS+stats.DRI+stats.DEF+stats.PHY)/6);
  overall += Math.floor(Math.random()*7)-3;
  overall = Math.max(60, Math.min(99, overall));

  // Classe da carta
  let classe="carta-bronze";
  if(overall>=75) classe="carta-ouro";
  else if(overall>=65) classe="carta-prata";

  // Clube
  const clube=clubes[Math.floor(Math.random()*clubes.length)];

  // Foto
  let fotoUrl="";
  if (generoFoto==="Masculino") {
    fotoUrl=`https://i.pravatar.cc/150?img=${Math.floor(Math.random()*34)+1}`;
  } else if (generoFoto==="Feminino") {
    fotoUrl=`https://i.pravatar.cc/150?img=${Math.floor(Math.random()*(70-35))+35}`;
  } else if (generoFoto==="Upload" && fotoUpload!=="") {
    fotoUrl=fotoUpload;
  } else {
    fotoUrl=`https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)+1}`;
  }

  // Carta final
  const html=`<div class="fifa-card ${classe}" id="carta">
      <div class="overall">${overall}</div>
      <div class="posicao">${posicao}</div>
      <img src="${fotoUrl}" alt="Jogador">
      <div class="nome">${nomeFinal}</div>
      <div class="nacionalidade">${nacionalidadeFinal}</div>
      <div class="clube">🏟 ${clube}</div>
      <div class="stats">
        <div>PAC ${stats.PAC}</div>
        <div>SHO ${stats.SHO}</div>
        <div>PAS ${stats.PAS}</div>
        <div>DRI ${stats.DRI}</div>
        <div>DEF ${stats.DEF}</div>
        <div>PHY ${stats.PHY}</div>
      </div>
    </div>`;

  document.getElementById("resultado").innerHTML=html;
  document.getElementById("downloadBtn").style.display="block";
}

function baixarCarta(){
  html2canvas(document.querySelector("#carta")).then(canvas=>{
    const link=document.createElement("a");
    link.download="carta-fifa.png";
    link.href=canvas.toDataURL();
    link.click();
  });
}
document.getElementById("downloadBtn").addEventListener("click", baixarCarta);