import React, { useEffect, useState } from "react";
import './App.css';
import {validarResposta} from './tmdbAPI.js';

const versaoAtual = "07032025"
const dataControle = ""
let tabuleiroTexto
let textoShare
let dataCompleta
let mesAno
let mes
let ano
let tabuleiroCache = "000000000"
let botoesLista = ["btNO","btN","btNE","btO","btC","btL","btSO","btS","btSE"]

function setCharAt(str,index,chr) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

function salvarTabuleiro(idBotao, valor){
  const posicao = botoesLista.indexOf(idBotao)
  tabuleiroCache = setCharAt(tabuleiroCache, posicao, valor)
  localStorage["tabuleiroCache"] = tabuleiroCache
}

function replicarTabuleiro(){
  for (let i = 0; i < 9; i++){
    if (tabuleiroCache.charAt(i) != "0" && tabuleiroCache.charAt(i) != "3") {
        const filmeBt = "filme" + botoesLista[i]
        document.getElementById(botoesLista[i]).disabled = true
        document.getElementById(botoesLista[i]).textContent = localStorage[filmeBt]
    }
    if (tabuleiroCache.charAt(i) == "1"){
      document.getElementById(botoesLista[i]).style.backgroundColor = "#1b961b";
    } else if (tabuleiroCache.charAt(i) == "2"){
      document.getElementById(botoesLista[i]).style.backgroundColor = "#e8b51e";
      document.getElementById(botoesLista[i]).value = 1
    } else if (tabuleiroCache.charAt(i) == "3"){
      console.log(document.getElementById(botoesLista[i]))
      document.getElementById(botoesLista[i]).value = 1
    }
  }
}

//INICIO DO APP -------------------------------------------------
function Boxd() {
  const [coluna1, setColuna1] = useState([])
  const [coluna2, setColuna2] = useState([])
  const [coluna3, setColuna3] = useState([])
  const [linha1, setLinha1] = useState([])
  const [linha2, setLinha2] = useState([])
  const [linha3, setLinha3] = useState([])
  
  const [pontos, setPonto] = useState(0)
  const [chutes, setChute] = useState(0)
  const [btAtual, setBtAtual] = useState("")
  const [perdeu, setPerdeu] = useState(false)
  const [linhaAtual, setLinha] = useState([])
  const [colunaAtual, setColuna] = useState([])
  const [mostraPalpite, setMostraPalpite] = useState([])
  const [mostraDesiste, setMostraDesiste] = useState(false)
  const [mostraVitoria, setMostraVitoria] = useState([])

  //diminuir bagunça na "jogar()"
  const enviarBotao = document.getElementById("enviar")
  const botaoAtual = document.getElementById(btAtual)
  const avisoTexto = document.getElementById("erroAviso")

  const [estiloPalpite, setEstiloPalpite] = useState({
    visibility : "hidden",
    opacity : 0,
  });

  const [estiloVitoria, setEstiloVitoria] = useState({
    display : "none",
    opacity : 0,
  });

  const [estiloDesiste, setEstiloDesiste] = useState({
    display : "flex",
    opacity : 1,
  });

  const [estiloConfDesiste, setEstiloConfDesiste] = useState({
    display : "none",
    opacity : 0,
  });

  function limparCache(){
    if (typeof localStorage["versao"] == "undefined" ||
        typeof localStorage["data"] == "undefined"){
          localStorage["versao"] = versaoAtual
          localStorage["data"] = dataCompleta
        }
    if (localStorage["data"] != dataCompleta || localStorage["versao"] != versaoAtual){ 
      const holderRegras = localStorage["sumirRegras"]   
      localStorage.clear()
      window.location.reload()
      setPonto(0)
      setChute(0)
      localStorage["versao"] = versaoAtual
      if(holderRegras == "true"){
        localStorage["sumirRegras"] = true
      }
    } else{
      atualizaVariaveis()
    }
  }

  function atualizaVariaveis(){
    if (typeof localStorage["tabuleiroCache"] != "undefined") {
      tabuleiroCache = localStorage["tabuleiroCache"]
      replicarTabuleiro()
      console.log("tabuleiro")
    }
    if (typeof localStorage["pontos"] != "undefined") setPonto(Number(localStorage["pontos"]))
    if (typeof localStorage["chutes"] != "undefined" && localStorage["chutes"] != "NaN") setChute(Number(localStorage["chutes"]))
    if (typeof localStorage["perdeu"] != "undefined"){
      setPerdeu(Boolean(localStorage["perdeu"]))
    }
  }
  

  useEffect(() => {
    fetchData()
    // atualizaVariaveis()
    limparCache()
    if(typeof localStorage["sumirRegras"] == "undefined"){
      document.getElementById("containerRegras").style.display = "flex";
      document.getElementById("containerRegras").style.opacity = 1;
    }
  }, [])

  useEffect(() => {
    if(pontos == 9){
      completaTabuleiro()
      vitoria()
      document.getElementById("desistir").disabled = true
    }
  }, [pontos])

  useEffect(() => {
    if (perdeu){
      derrota();
    }
  }, [perdeu])

  let fetchData = async() => {
    if (dataControle != ""){
      dataCompleta = dataControle
    } else {
      let hoje = new Date()
      let dia = String(hoje.getDate()).padStart(2, "0")
      let mes = String(hoje.getMonth() + 1).padStart(2,"0")
      let ano = hoje.getFullYear()
      mesAno = mes + "-" + ano
      dataCompleta = dia+"-"+mes+"-"+ano
    }
    console.log(mesAno)
    let endereco = "/"+ mesAno + "/" + dataCompleta + ".txt"
    let resp = await fetch(endereco)
    let final = await resp.text()
    let lista = final.split("\n")

    for (let i = 0; i < lista.length; i++){
      lista[i] = lista[i].replace("\r", "")
    }
    setColuna1([lista[0], [lista[1], lista[2]]])
    setColuna2([lista[3], [lista[4], lista[5]]])
    setColuna3([lista[6], [lista[7], lista[8]]])
    setLinha1([lista[9], [lista[10], lista[11]]])
    setLinha2([lista[12], [lista[13], lista[14]]])
    setLinha3([lista[15], [lista[16], lista[17]]])
  }

  function palpite(fromButton = false){
    if (!mostraPalpite && fromButton){
    } else{
      setMostraPalpite(!mostraPalpite)
      if (mostraPalpite){
        setEstiloPalpite({
          visibility : "visible",
          opacity : 1,
        })
      } else {
        setEstiloPalpite({
          visibility : "hidden",
          opacity : 0,
        })
      }
    }
    document.getElementById("erroAviso").textContent = "";
    }

  function vitoria(){
    if (mostraVitoria){
      setEstiloVitoria({
        display : "flex",
        opacity : 1,
      })
    } else {
      setEstiloVitoria({
        display : "none",
        opacity : 0,
      })
    }
  }

  function derrota(){
    document.getElementById("parabens").textContent = "Não foi dessa vez! 😓"
    setPerdeu(true)
    let textDerrota = "Você acertou " + pontos
    if (pontos == 1){
      textDerrota += " filme em "
    } else {
      textDerrota += " filmes em "
    }
    if (chutes == 1){
      textDerrota += (chutes + " tentativa") 
    } else {
      textDerrota += (chutes + " tentativas")
    }
    document.getElementById("numerosVict").textContent =  textDerrota
    completaTabuleiro(); 
    vitoria();
    if(mostraDesiste){
      desistir();
    }
    document.getElementById("desistir").disabled = true
    for (let i = 0; i < 9; i++){
        document.getElementById(botoesLista[i]).disabled = true
        if (document.getElementById(botoesLista[i]).textContent == "."){
          document.getElementById(botoesLista[i]).style.backgroundColor = "#ce171c"
          document.getElementById(botoesLista[i]).style.fontSize = "0px"
        }
      } 
  }

  function desistir(){
    setMostraDesiste(!mostraDesiste)
    if (mostraDesiste){
      setEstiloDesiste({
        display : "flex",
        opacity : 1,
      })
      setEstiloConfDesiste({
        display : "none",
        opacity : 0,
      })
    } else {
      setEstiloDesiste({
        display : "none",
        opacity : 0,
      })
      setEstiloConfDesiste({
        display : "flex",
        opacity : 1,
      })
    }
  }
  
 function copiar(){
  if(perdeu){
    textoShare = "Joguei boxd.com.br " + dataCompleta + " e acertei " + pontos + " de 9 filmes em "
    if (chutes == 1){
      textoShare += (chutes + " tentativa\n") 
    } else {
      textoShare += (chutes + " tentativas\n")
    }
    textoShare += tabuleiroTexto
  } else{
    textoShare = "Joguei boxd.com.br " + dataCompleta + " e consegui em " + chutes + 
    " tentativas\n\n" + tabuleiroTexto
  }
    document.getElementById("compartilhar").textContent="🔗 Copiado!"
  }

  
  async function jogar(linha, coluna, palpite){
    enviarBotao.textContent="⌚";/*⏳*/
    enviarBotao.disabled=true;
    if (!(palpite == "" || palpite.replaceAll(" ", "") == "")){
      const sucesso = await validarResposta(linha, coluna, palpite)

      //Valida se o filme já foi usado
      if(sessionStorage["usado"] == "1"){
        avisoTexto.textContent = "Filme já usado 🔂";
        document.getElementById("palpite-input").value = "";
        enviarBotao.textContent="Enviar";
        enviarBotao.disabled = false;
        sessionStorage["usado"] = 0

      //Valida se encontrou algum filme
      } else if (sessionStorage["nExiste"] == "1") {
        avisoTexto.textContent = "Filme não encontrado 🔎";
        document.getElementById("palpite-input").value = "";
        enviarBotao.textContent="Enviar";
        enviarBotao.disabled = false; 
        sessionStorage["nExiste"] = 0
      } 
      else{
        setChute(chutes + 1)
        localStorage["chutes"] = chutes + 1
        if (sucesso){
          setPonto(pontos + 1)
          localStorage["pontos"] = pontos + 1
          setMostraPalpite(!mostraPalpite)
          setEstiloPalpite({
            visibility : "hidden",
            opacity : 0,
          })
          if (botaoAtual.value == 0){
            botaoAtual.style.backgroundColor = "#1b961b";
            salvarTabuleiro(btAtual, 1)
          } else {
            botaoAtual.style.backgroundColor = "#e8b51e";
            salvarTabuleiro(btAtual, 2)
          }
          const filmeBt = "filme" + btAtual
          localStorage[filmeBt] = localStorage["filmeAcerto"]
          botaoAtual.textContent = localStorage[filmeBt]/*"✅"*/;
          botaoAtual.disabled = true;
        } 
        else {
          avisoTexto.textContent = "Tente novamente 😥";
          salvarTabuleiro(btAtual, 3)
          botaoAtual.value = 1
        }

      }}
    document.getElementById("palpite-input").value = "";
    enviarBotao.textContent="Enviar";
    enviarBotao.disabled = false;
  }

  const handler = (event) => {
    if (event.key === "Enter"){
      jogar(linhaAtual[1], colunaAtual[1], document.getElementById('palpite-input').value)
    }
  }

  function completaTabuleiro(){
    tabuleiroTexto = ""
    for (let i = 0; i < 9; i++){
      if (document.getElementById(botoesLista[i]).textContent == "."){
        tabuleiroTexto = tabuleiroTexto + "🟥";
      } else if (document.getElementById(botoesLista[i]).value == 0){
        tabuleiroTexto = tabuleiroTexto + "🟩";
      } else {
        tabuleiroTexto = tabuleiroTexto + "🟨";
      }
      if ((i+1) % 3 == 0){
        tabuleiroTexto = tabuleiroTexto + "\n"
      }
    }
    console.log(tabuleiroTexto)
  }

  function controlaRegras(limpar = false){
    if(limpar){
      localStorage["sumirRegras"] = true
    }
    document.getElementById("containerRegras").style.display = "none";
    document.getElementById("containerRegras").style.opacity = 0;
  }

  return (
    <div>
    <div class="vict">
      <img src="/logotipo.png"></img>
    </div>
    <div class="vict">
    </div>
  
    <div class= "vict" style={estiloVitoria}>
      <div class = "vitoria">
        <a style={{marginTop: "8px"}} id="parabens">Parabéns!</a>
        <a id="numerosVict">Você conseguiu em {chutes} tentativas</a>
        <span>{tabuleiroTexto}</span>
        <button id="compartilhar" onClick={() => {copiar(); navigator.clipboard.writeText(textoShare)}}>🔗 Compartilhe</button>
      </div>
    </div>

    <div>
      <table class = "grid">
        <tr>
          <td id="vazio"></td>
          <th><div class="brdrColuna"><a style={{lineBreak: "strict"}}>{coluna1[0]}</a></div></th>
          <th><div class="brdrColuna">{coluna2[0]}</div></th>
          <th><div class="brdrColuna">{coluna3[0]}</div></th>
        </tr>
        <tr>
          <th><div class="brdrLinha">{linha1[0]}</div></th>
          <td><button class="botao" id="btNO" value="0"
              style={{borderTopLeftRadius : "30px"}} 
              onClick={() => {setLinha(linha1); setColuna(coluna1); palpite(true); setBtAtual("btNO") }}>.</button></td>
          <td><button class="botao" id="btN" value="0" onClick={() => {setLinha(linha1); setColuna(coluna2); palpite(true); setBtAtual("btN") }}>.</button></td>
          <td><button class="botao" id="btNE" value="0"
              style={{borderTopRightRadius : "30px"}}
              onClick={() => {setLinha(linha1); setColuna(coluna3); palpite(true); setBtAtual("btNE") }}>.</button></td>
        </tr>
        <tr>
          <th><div class="brdrLinha">{linha2[0]}</div></th>
          <td><button class="botao" id="btO" value="0" onClick={() => {setLinha(linha2); setColuna(coluna1); palpite(true); setBtAtual("btO") }}>.</button></td>
          <td><button class="botao" id="btC" value="0" onClick={() => {setLinha(linha2); setColuna(coluna2); palpite(true); setBtAtual("btC") }}>.</button></td>
          <td><button class="botao" id="btL" value="0" onClick={() => {setLinha(linha2); setColuna(coluna3); palpite(true); setBtAtual("btL") }}>.</button></td>
        </tr>
        <tr>
          <th><div class="brdrLinha">{linha3[0]}</div></th>
          <td><button class="botao" id="btSO" value="0"
              style={{borderBottomLeftRadius : "30px"}}
              onClick={() => {setLinha(linha3); setColuna(coluna1); palpite(true); setBtAtual("btSO") }}>.</button></td>
          <td><button class="botao" id="btS"  value="0" onClick={() => {setLinha(linha3); setColuna(coluna2); palpite(true); setBtAtual("btS") }}>.</button></td>
          <td><button class="botao" id="btSE" value="0"
              style={{borderBottomRightRadius : "30px"}}
              onClick={() => {setLinha(linha3); setColuna(coluna3); palpite(true); setBtAtual("btSE") }}>.</button></td>
        </tr>
      </table>
      <div class="pontuacao">
        <table>
          <td style={{textAlign: "left", width: "50%"}}>Acertos: {pontos}</td>
          <td style={{textAlign: "right", width: "50%"}}>Palpites: {chutes}</td>
        </table>
      </div>
    </div>

    <div class="desistencia">
      <button id="desistir" style={estiloDesiste} onClick={() =>{desistir()}}>Desistir</button>
      <div class="confirmaDesiste" style={estiloConfDesiste}>
        <a>Quer mesmo desistir?</a>
        <div class="botoesDesiste">
          <table>
            <td style={{textAlign: "left", width: "50%"}}><button onClick={() => {derrota(); localStorage["perdeu"] = perdeu}}>Sim</button></td>
            <td style={{textAlign: "right", width: "50%"}}><button onClick={() =>{desistir()}}>Não</button></td>
          </table>
        </div>
      </div>
    </div>

    <div class="tmdb">
      <a class="dados">Dados fornecidos por:</a>
      <a href="https://www.themoviedb.org" target="_blank"><img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"></img></a>
    </div>

    <div class = "container" style={estiloPalpite}>
      <div class = "palpite">
          <button id="fecharP"  onClick={() => {palpite()}}>X</button>
          <h3 style={{width: "100%"}}>{linhaAtual[0]} + <br></br> {colunaAtual[0]}</h3>
          <a id="erroAviso"></a>
          <input type="text" id="palpite-input" onKeyDown={(e) => {handler(e)}} autoComplete="off"></input>
          <button id="enviar" onClick={() => jogar(linhaAtual[1], colunaAtual[1], document.getElementById('palpite-input').value)}>Enviar</button> 
      </div>  
    </div>

    <div class="containerRegras" id="containerRegras">
      <div class ="regras">
        <a>Regras:</a>
        <li>- Complete o tabuleiro com filmes que se encaixem nas categorias da coluna e da linha daquele espaço.<br></br>
        Há mais de uma resposta possível por quadrado.</li>
        <li>- Anos representam décadas (Ex: 2010 aceita filmes lançados entre 2010 e 2019)</li>
        <li>- Um filme dado como certo não pode ser usado novamente em outros quadrados</li>
        <li>- São aceitos títulos em portugês e em inglês</li>
        <li>- Procure escrever o título corretamente, para garantir que o programa busque o filme desejado. Em alguns casos, pode ser melhor usar o título em inglês.</li>
        <li>- Legenda:<br></br>
        🟩 - Acertou na 1º tentativa<br></br>
        🟨 - Acertou com mais de 1 tentativa<br></br>
        🟥 - Não acertou
        </li>
        <div class="botoesRegras">
          <table>
            <td style={{textAlign: "left", width: "50%"}}><button onClick={() => {controlaRegras(true)}}>Não mostrar mais</button></td>
            <td style={{textAlign: "right", width: "50%"}}><button onClick={() =>{controlaRegras()}}>Jogar</button></td>
          </table>
        </div>
      </div>
    </div> 
    </div>
  );
}

export default Boxd;
