import React, { useEffect, useState } from "react";
import './App.css';
import {validarResposta} from './tmdbAPI.js';

const versaoAtual = "1.1"
let tabuleiroTexto
let dataCompleta
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
  console.log(tabuleiroCache)
}

function replicarTabuleiro(){
  for (let i = 0; i < 9; i++){
    console.log(tabuleiroCache.charAt(i))
    if (tabuleiroCache.charAt(i) != "0") {
        document.getElementById(botoesLista[i]).disabled = true
        document.getElementById(botoesLista[i]).textContent = "✅"
    }
    if (tabuleiroCache.charAt(i) == "1"){
      document.getElementById(botoesLista[i]).style.backgroundColor = "#1b961b";
    } else if (tabuleiroCache.charAt(i) == "2"){
      document.getElementById(botoesLista[i]).style.backgroundColor = "#e8b51e";
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
  const [linhaAtual, setLinha] = useState([])
  const [colunaAtual, setColuna] = useState([])
  const [mostraPalpite, setMostraPalpite] = useState([])
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

  function limparCache(){
    if (typeof localStorage["versao"] == "undefined" || localStorage["versao" != versaoAtual] ||
        typeof localStorage["data"] == "undefined" || localStorage["data"] != dataCompleta){
      localStorage.clear()
      localStorage["versao"] = versaoAtual
      localStorage["data"] = dataCompleta
      location.reload()
    }
  }

  function atualizaVariaveis(){
    console.log((typeof localStorage["tabuleiroCache"] != undefined))
    if (typeof localStorage["tabuleiroCache"] != "undefined" &&
        typeof localStorage["pontos"] != "undefined" &&
        typeof localStorage["chutes" != "undefined"]){
      console.log("Cachê")
      setPonto(Number(localStorage["pontos"]))
      setChute(Number(localStorage["chutes"]))
      tabuleiroCache = localStorage["tabuleiroCache"]
      replicarTabuleiro()
    }
  }
  

  useEffect(() => {
    fetchData()
    limparCache()
    atualizaVariaveis()
  }, [])

  useEffect(() => {
    if (pontos != 0){
      localStorage["pontos"] = pontos
    }
    if(pontos == 9){
      completaTabuleiro()
      vitoria()
    }
  }, [pontos])

  useEffect(() =>{
    if (chutes != 0){
      localStorage["chutes"] = chutes
    }
  }, [chutes])

  let fetchData = async() => {
    let hoje = new Date()
    let dia = String(hoje.getDate()).padStart(2, "0")
    let mes = String(hoje.getMonth() + 1).padStart(2,"0")
    let ano = hoje.getFullYear()
    dataCompleta = dia+"-"+mes+"-"+ano
    let endereco = "/"+dataCompleta+".txt"
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
  
 function copiar(){
    const textoShare = "Joguei Boxd " + dataCompleta + " e consegui em " + chutes + " tentativas\n\n" +
    tabuleiroTexto + "\nboxd.com.br"
    navigator.clipboard.writeText(textoShare)
    document.getElementById("compartilhar").textContent="🔗 Copiado!"
  }

  async function jogar(linha, coluna, palpite){
    enviarBotao.textContent="⌚";/*⏳*/
    enviarBotao.disabled=true;

    setChute(chutes + 1)
    
    const sucesso = await validarResposta(linha, coluna, palpite)
    if (sucesso){
      setPonto(pontos + 1)
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
      botaoAtual.textContent = "✅";
      botaoAtual.disabled = true;
    } 
    else {
      avisoTexto.textContent = "Tente novamente 😥";
      botaoAtual.value = 1
    }

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
      if (document.getElementById(botoesLista[i]).value == 0){
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

  return (
    <>
    <div class="vict">
      <img src="/logotipo.png"></img>
    </div>
    <div class="vict">
      <a>Versão Beta</a>
    </div>
  
    <div class= "vict" style={estiloVitoria}>
      <div class = "vitoria">
        <a style={{marginTop: "8px"}}>Parabéns!</a>
        <a>Você conseguiu em {chutes} tentativas</a>
        <span>{tabuleiroTexto}</span>
        <button id="compartilhar" onClick={() => copiar()}>🔗 Compartilhe</button>
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
          <th><div class="brdrLinha dreamworks">{linha2[0]}</div></th>
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

    <div class = "container" style={estiloPalpite}>
      <div class = "palpite">
          <button id="fecharP"  onClick={() => {palpite()}}>X</button>
          <h3 style={{width: "100%"}}>{linhaAtual[0]} | {colunaAtual[0]}</h3>
          <a id="erroAviso"></a>
          <input type="text" id="palpite-input" onKeyDown={(e) => {handler(e)}} autoComplete="off"></input>
          <button id="enviar" onClick={() => jogar(linhaAtual[1], colunaAtual[1], document.getElementById('palpite-input').value)}>Enviar</button> 
      </div>  
    </div>
    </>
  );
}

export default Boxd;
