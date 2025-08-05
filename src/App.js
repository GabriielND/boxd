import React, { useEffect, useState } from "react";
import './App.css';
import {setUrlPessoa, validarResposta} from './tmdbAPI.js';

const versaoAtual = "07072025"
const dataControle = ""
let tabuleiroTexto
let textoShare
let dataCompleta
let mesAno
let dataCompleta_ontem
let mesAno_ontem
let dataCompleta_ante
let mesAno_ante
let diaSemana
let urlPessoa = "https://media.themoviedb.org/t/p/w300_and_h450_bestv2"
let tabuleiroCache = "000000000"
let tabuleiroCacheOntem = "000000000"
let tabuleiroCacheAnte = "000000000"
let botoesLista = ["btNO","btN","btNE","btO","btC","btL","btSO","btS","btSE"]

function setCharAt(str,index,chr) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

function salvarTabuleiro(idBotao, valor){
  const posicao = botoesLista.indexOf(idBotao)
  tabuleiroCache = setCharAt(tabuleiroCache, posicao, valor)
  localStorage["tabuleiroCache" + "-" + localStorage["diaAtual"]] = tabuleiroCache
}

function replicarTabuleiro(){
  tabuleiroCache = localStorage["tabuleiroCache" + "-" + localStorage["diaAtual"]]
  for (let i = 0; i < 9; i++){
    if (tabuleiroCache.charAt(i) !== "0" && tabuleiroCache.charAt(i) !== "3") {
        const filmeBt = "filme" + botoesLista[i] + localStorage["diaAtual"]
        document.getElementById(botoesLista[i]).disabled = true
        document.getElementById(botoesLista[i]).textContent = localStorage[filmeBt]
    } else {
        document.getElementById(botoesLista[i]).disabled = false
        document.getElementById(botoesLista[i]).textContent = "."
    }
    if (tabuleiroCache.charAt(i) === "1"){
      document.getElementById(botoesLista[i]).style.backgroundColor = "#1b961b";
      document.getElementById(botoesLista[i]).value = 0
    } else if (tabuleiroCache.charAt(i) === "2"){
      document.getElementById(botoesLista[i]).style.backgroundColor = "#e8b51e";
      document.getElementById(botoesLista[i]).value = 1
    } else if (tabuleiroCache.charAt(i) === "3"){
      console.log(document.getElementById(botoesLista[i]))
      document.getElementById(botoesLista[i]).value = 1
      document.getElementById(botoesLista[i]).style.backgroundColor = "#163c5e";
    } else if (tabuleiroCache.charAt(i) === "0"){
      document.getElementById(botoesLista[i]).value = 0
      document.getElementById(botoesLista[i]).style.backgroundColor = "#163c5e";
    }
  }
}

function converteData(data){
    let lista = data.toString().split("-")
    let dataFormat = new Date(lista[1]+"-"+lista[0]+"-"+lista[2])

    return(dataFormat)
}

//INICIO DO APP -------------------------------------------------
function Boxd() {
  const [coluna1, setColuna1] = useState([])
  const [coluna2, setColuna2] = useState([])
  const [coluna3, setColuna3] = useState([])
  const [linha1, setLinha1] = useState([])
  const [linha2, setLinha2] = useState([])
  const [linha3, setLinha3] = useState([])

  const [categoriasHoje, setCatHoje] = useState([])
  const [categoriasOntem, setCatOntem] = useState([])
  const [categoriasAnte, setCatAnte] = useState([])
  const [diaPuzzle, setDiaPuzzle] = useState("")
  
  const [pontos, setPonto] = useState(0)
  const [chutes, setChute] = useState(0)
  const [pontosOntem, setPontoOntem] = useState(0)
  const [chutesOntem, setChuteOntem] = useState(0)
  const [pontosAnte, setPontoAnte] = useState(0)
  const [chutesAnte, setChuteAnte] = useState(0)
  const [pontosPlacar, setPontoPlacar] = useState(0)
  const [chutesPlacar, setChutePlacar] = useState(0)

  const [btAtual, setBtAtual] = useState("")
  const [perdeu, setPerdeu] = useState(false)
  const [linhaAtual, setLinha] = useState([])
  const [colunaAtual, setColuna] = useState([])
  const [mostraPalpite, setMostraPalpite] = useState([])
  const [mostraDesiste, setMostraDesiste] = useState(false)
  const [mostraVitoria, setMostraVitoria] = useState([])
  const [fotoAtor, setFotoAtor] = useState("")
  const [temAtor, setTemAtor] = useState([])

  
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

  const [estiloFoto, setEstiloFoto] = useState({
    display : "none",
    opacity : 0,
  })

  const [estiloHoje, setEstiloHoje] = useState({
    backgroundColor: "transparent"
  })

  const [estiloOntem, setEstiloOntem] = useState({
    backgroundColor: "transparent"
  })

  const [estiloAnte, setEstiloAnte] = useState({
    backgroundColor: "transparent"
  })

  function aumentarChutes(){
  switch (localStorage["diaAtual"]) {
    case "hoje":
      setChute(chutes + 1)
      setChutePlacar(chutes + 1)
      localStorage["chuteshoje"] = chutes + 1
      break;
    case "ontem":
      setChuteOntem(chutesOntem + 1)
      setChutePlacar(chutesOntem + 1)
      localStorage["chutesontem"] = chutesOntem + 1
      break;
    case "ante":
      setChuteAnte(chutesAnte + 1)
      setChutePlacar(chutesAnte + 1)
      localStorage["chutesante"] = chutesAnte + 1
      break;
    default:
      break;
  }
}

  function aumentarPontos(){
  switch (localStorage["diaAtual"]) {
    case "hoje":
      setPonto(pontos + 1)
      setPontoPlacar(pontos + 1)
      localStorage["pontoshoje"] = pontos + 1
      break;
    case "ontem":
      setPontoOntem(pontosOntem + 1)
      setPontoPlacar(pontosOntem + 1)
      localStorage["pontosontem"] = pontosOntem + 1
      break;
    case "ante":
      setPontoAnte(pontosAnte + 1)
      setPontoPlacar(pontosAnte + 1)
      localStorage["pontosante"] = pontosAnte + 1
      break;
    default:
      break;
    }
}


  function limparCache(){
    if (typeof localStorage["versao"] === "undefined" ||
        typeof localStorage["data"] === "undefined"){
          localStorage["versao"] = versaoAtual
          localStorage["data"] = dataCompleta
        }
    if (typeof localStorage["diaAtual"] === "undefined"){
      localStorage["diaAtual"] = "hoje"
    }
    if (typeof localStorage["pontoshoje"] === "undefined" ||
        typeof localStorage["pontosontem"] === "undefined" ||
        typeof localStorage["pontosante"] === "undefined") {
          localStorage["pontoshoje"] = "0"
          localStorage["pontosontem"] = "0"
          localStorage["pontosante"] = "0"
        }
    if (typeof localStorage["chuteshoje"] === "undefined" ||
        typeof localStorage["chutesontem"] === "undefined" ||
        typeof localStorage["chutesante"] === "undefined") {
          localStorage["chuteshoje"] = "0"
          localStorage["chutesontem"] = "0"
          localStorage["chutesante"] = "0"
        }
    if (typeof localStorage["tabuleiroCache-hoje"] === "undefined" ||
        typeof localStorage["tabuleiroCache-ontem"] === "undefined" ||
        typeof localStorage["tabuleiroCache-ante"] === "undefined"
    ) {
      localStorage["tabuleiroCache-hoje"] = "000000000"
      localStorage["tabuleiroCache-ontem"] = "000000000"
      localStorage["tabuleiroCache-ante"] = "000000000"
    }
    if (localStorage["data"] !== dataCompleta || localStorage["versao"] !== versaoAtual){
      if(dataCompleta_ontem == localStorage["data"]){
        console.log("Passou um dia")
        const tabuleiroCacheOntem = localStorage["tabuleiroCache-hoje"]  
        const tabuleiroCacheAnte = localStorage["tabuleiroCache-ontem"]
      } 
      const holderRegras = localStorage["sumirRegras"]
      
      localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
      setPonto(0)
      setChute(0)
      localStorage["versao"] = versaoAtual
      localStorage["diaAtual"] = "hoje"
      if(holderRegras === "true"){
        localStorage["sumirRegras"] = true
      }
    } else{
      atualizaVariaveis()
    }
  }

  function atualizaVariaveis(){
    if (typeof localStorage["tabuleiroCache-hoje"] !== "undefined" ||
        typeof localStorage["tabuleiroCache-ontem"] !== "undefined" ||
        typeof localStorage["tabuleiroCache-ante"] !== "undefined"
    ) {
      tabuleiroCache = localStorage["tabuleiroCache-hoje"]
      tabuleiroCache = localStorage["tabuleiroCache-ontem"]
      tabuleiroCache = localStorage["tabuleiroCache-ante"]
      replicarTabuleiro()
      console.log("tabuleiro")
    }
    if (typeof localStorage["pontoshoje"] !== "undefined") setPonto(Number(localStorage["pontoshoje"]))
    if (typeof localStorage["chuteshoje"] !== "undefined" && localStorage["chuteshoje"] !== "NaN") setChute(Number(localStorage["chuteshoje"]))
    if (typeof localStorage["pontosontem"] !== "undefined") setPontoOntem(Number(localStorage["pontosontem"]))
    if (typeof localStorage["chutesontem"] !== "undefined" && localStorage["chutesontem"] !== "NaN") setChuteOntem(Number(localStorage["chutesontem"]))
    if (typeof localStorage["pontosante"] !== "undefined") setPontoAnte(Number(localStorage["pontosante"]))
    if (typeof localStorage["chutesante"] !== "undefined" && localStorage["chutesante"] !== "NaN") setChuteAnte(Number(localStorage["chutesante"]))
    if (typeof localStorage["perdeu"] !== "undefined"){
      setPerdeu(Boolean(localStorage["perdeu"]))
    }
    if (typeof localStorage["diaAtual"] !== "undefined" && localStorage["diaAtual"] !== "NaN") setDiaPuzzle(localStorage["diaAtual"])
  }

  async function mudarCategorias(lista, dia, ator = ""){
    console.log("Categorias: " + lista[0])
    setColuna1([lista[0], [lista[1], lista[2]]])
    setColuna2([lista[3], [lista[4], lista[5]]])
    setColuna3([lista[6], [lista[7], lista[8]]])
    setLinha1([lista[9], [lista[10], lista[11]]])
    setLinha2([lista[12], [lista[13], lista[14]]])
    setLinha3([lista[15], [lista[16], lista[17]]])

    localStorage["diaAtual"] = dia

    if(ator !== ""){
      let urlImagem = await setUrlPessoa(lista[9])
      setFotoAtor(urlPessoa + urlImagem)
      setEstiloFoto({
      display : "block",
      opacity : 1,
    })
    } else{
      setEstiloFoto({
      display : "none",
      opacity : 0,
    })
    }

    alternarEstilosDatas(dia)
    mudarPlacar("pontos")
    mudarPlacar("palpites")
  } 

  function atualizarVitoria(){
    switch (localStorage["diaAtual"]) {
      case "hoje":
        pontos === 9 ? vitoria(true) : vitoria(false)
        break;
      case "ontem":
        pontosOntem === 9 ? vitoria(true) : vitoria(false)
        break;
      case "ante":
        pontosAnte === 9 ? vitoria(true) : vitoria(false)
        break;
    }
  }

  function alternarEstilosDatas(data){
    switch (data) {
      case "hoje":
        setEstiloHoje({backgroundColor: "#2596be"})
        setEstiloOntem({backgroundColor: "transparent"})
        setEstiloAnte({backgroundColor: "transparent"})
        break;
      case "ontem":
        setEstiloHoje({backgroundColor: "transparent"})
        setEstiloOntem({backgroundColor: "#2596be"})
        setEstiloAnte({backgroundColor: "transparent"})
        break;
      case "ante":
        setEstiloHoje({backgroundColor: "transparent"})
        setEstiloOntem({backgroundColor: "transparent"})
        setEstiloAnte({backgroundColor: "#2596be"})
        break;
      default:
        break;
    }
  }

  function mudarPlacar(nomePlacar){
    if(nomePlacar === "pontos"){
      switch (localStorage["diaAtual"]) {
        case "hoje":
          setPontoPlacar(localStorage["pontoshoje"])
          break;
        case "ontem":
          setPontoPlacar(localStorage["pontosontem"])
          break;
        case "ante":
          setPontoPlacar(localStorage["pontosante"])
          break;
        default:
          break;
      }
    } else if (nomePlacar === "palpites"){
      switch (localStorage["diaAtual"]) {
      case "hoje":
        setChutePlacar(localStorage["chuteshoje"])
        break;
      case "ontem":
        setChutePlacar(localStorage["chutesontem"])
        break;
      case "ante":
        setChutePlacar(localStorage["chutesante"])
        break;
      default:
        break;
      }
    }
  }

  useEffect(() => {
    fetchData()
    // atualizaVariaveis()
    limparCache()
    if(typeof localStorage["sumirRegras"] === "undefined"){
      document.getElementById("containerRegras").style.display = "flex";
      document.getElementById("containerRegras").style.opacity = 1;
    }
  }, [])

  useEffect(() => {
    if(pontos === 9){
      completaTabuleiro()
      vitoria(true)
      document.getElementById("desistir").disabled = true
    }
    mudarPlacar("pontos")
  }, [pontos])

  useEffect(() => {
    if(pontosOntem === 9){
      completaTabuleiro()
      vitoria(true)
      document.getElementById("desistir").disabled = true
    }
    mudarPlacar("pontos")
  }, [pontosOntem])

  useEffect(() => {
    if(pontosAnte === 9){
      completaTabuleiro()
      vitoria(true)
      document.getElementById("desistir").disabled = true
    }
    mudarPlacar("pontos")
  }, [pontosAnte])

  useEffect(() => {
    mudarPlacar("palpites")
  }, [chutes, chutesOntem, chutesAnte])

  useEffect(() => {
    if (perdeu){
      derrota();
    }
  }, [perdeu])

  let fetchData = async() => {
    if (dataControle !== ""){
      let controleFormat = converteData(dataControle)
      dataCompleta = dataControle
      dataCompleta_ontem = new Date(new Date().setDate(controleFormat.getDate() - 1))
      dataCompleta_ante = new Date(new Date().setDate(dataCompleta_ontem.getDate() - 1))

      let dia = String(controleFormat.getDate()).padStart(2, "0")
      let mes = String(controleFormat.getMonth() + 1).padStart(2,"0")
      let ano = controleFormat.getFullYear()
      mesAno = mes + "-" + ano

      document.getElementById("botao-hoje").textContent=(dia+"/"+mes)
      localStorage["data-hoje"] = (dia+"/"+mes)
      dia = String(dataCompleta_ontem.getDate()).padStart(2, "0")
      mes = String(dataCompleta_ontem.getMonth() + 1).padStart(2,"0")
      ano = dataCompleta_ontem.getFullYear()
      mesAno_ontem = mes + "-" + ano
      dataCompleta_ontem = dia + "-" + mesAno_ontem

      document.getElementById("botao-ontem").textContent=(dia+"/"+mes)
      localStorage["data-ontem"] = (dia+"/"+mes)
      dia = String(dataCompleta_ante.getDate()).padStart(2, "0")
      mes = String(dataCompleta_ante.getMonth() + 1).padStart(2,"0")
      ano = dataCompleta_ante.getFullYear()
      mesAno_ante = mes + "-" + ano
      document.getElementById("botao-ante").textContent=(dia+"/"+mes)
      localStorage["data-ante"] = (dia+"/"+mes)
      dataCompleta_ante = dia + "-" + mesAno_ante


      // document.getElementById("botao-ontem").textContent=(dia_ontem+"/"+mes_ontem)
      // document.getElementById("botao-ante").textContent=(dia_ante+"/"+mes_ante)

      mesAno = dataCompleta.slice(3)
      diaSemana = converteData(dataCompleta).getDay()
    } else {
      let hoje = new Date()
      localStorage["semana-hoje"] = hoje.getDay()
      let dia = String(hoje.getDate()).padStart(2, "0")
      let mes = String(hoje.getMonth() + 1).padStart(2,"0")
      let ano = hoje.getFullYear()
      mesAno = mes + "-" + ano
      dataCompleta = dia+"-"+mes+"-"+ano

      let ontem = new Date(new Date().setDate(new Date().getDate()-1))
      localStorage["semana-ontem"] = ontem.getDay()
      let dia_ontem = String(ontem.getDate()).padStart(2, "0")
      let mes_ontem = String(ontem.getMonth() + 1).padStart(2,"0")
      let ano_ontem = ontem.getFullYear()
      mesAno_ontem = mes_ontem + "-" + ano_ontem
      dataCompleta_ontem = dia_ontem+"-"+mes_ontem+"-"+ano_ontem

      let ante = new Date(new Date().setDate(new Date().getDate() - 2))
      localStorage["semana-ante"] = ante.getDay()
      let dia_ante = String(ante.getDate()).padStart(2, "0")
      let mes_ante = String(ante.getMonth() + 1).padStart(2,"0")
      let ano_ante = ante.getFullYear()
      mesAno_ante = mes_ante + "-" + ano_ante
      dataCompleta_ante = dia_ante+"-"+mes_ante+"-"+ano_ante

      document.getElementById("botao-hoje").textContent=(dia+"/"+mes)
      localStorage["data-hoje"] = (dia+"/"+mes)
      document.getElementById("botao-ontem").textContent=(dia_ontem+"/"+mes_ontem)
      localStorage["data-ontem"] = (dia_ontem+"/"+mes_ontem)
      document.getElementById("botao-ante").textContent=(dia_ante+"/"+mes_ante)
      localStorage["data-ante"] = (dia_ante+"/"+mes_ante)
    }
    let atorFoto = ["", "", ""]
    if(converteData(dataCompleta).getDay() === 1 || converteData(dataCompleta).getDay() === 3){
      atorFoto[0] = "sim"
    }
    if(converteData(dataCompleta_ontem).getDay() === 1 || converteData(dataCompleta_ontem).getDay() === 3){
      atorFoto[1] = "sim"
    }
    if(converteData(dataCompleta_ante).getDay() === 1 || converteData(dataCompleta_ante).getDay() === 3){
      atorFoto[2] = "sim"
    }
    setTemAtor(atorFoto)
    
    let endereco = "/"+ mesAno + "/" + dataCompleta + ".txt"
    let resp = await fetch(endereco)
    let final = await resp.text()
    let lista = final.split("\n")

    for (let i = 0; i < lista.length; i++){
      lista[i] = lista[i].replace("\r", "")
    }


    if(localStorage["diaAtual"] === "hoje"){
      mudarCategorias(lista, "hoje", atorFoto[0])
    }
    setCatHoje(lista)

    let endereco_ontem = "/"+ mesAno_ontem + "/" + dataCompleta_ontem + ".txt"
    console.log("Ontem" + endereco_ontem)
    let resp_ontem = await fetch(endereco_ontem)
    let final_ontem = await resp_ontem.text()
    lista = final_ontem.split("\n")

    for (let i = 0; i < lista.length; i++){
      lista[i] = lista[i].replace("\r", "")
    }
   
    
    if(localStorage["diaAtual"] === "ontem") mudarCategorias(lista, "ontem", atorFoto[1])
    setCatOntem(lista)

    let endereco_ante = "/"+ mesAno_ante + "/" + dataCompleta_ante + ".txt"
    console.log("Ante" + endereco_ante)
    let resp_ante = await fetch(endereco_ante)
    let final_ante = await resp_ante.text()
    lista = final_ante.split("\n")
    console.log(lista)
    for (let i = 0; i < lista.length; i++){
      lista[i] = lista[i].replace("\r", "")
    }

    if(localStorage["diaAtual"] === "ante") mudarCategorias(lista, "ante", atorFoto[2])
    setCatAnte(lista)
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

  function vitoria(vitoriaBool){
    if (vitoriaBool){
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
    if (pontos === 1){
      textDerrota += " filme em "
    } else {
      textDerrota += " filmes em "
    }
    if (chutes === 1){
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
        if (document.getElementById(botoesLista[i]).textContent === "."){
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
    textoShare = "Joguei boxd.com.br " + localStorage["data-" + localStorage["diaAtual"]] + " e acertei " + pontosPlacar + " de 9 filmes em "
    if (chutes === 1){
      textoShare += (chutesPlacar + " tentativa\n") 
    } else {
      textoShare += (chutesPlacar + " tentativas\n")
    }
    textoShare += tabuleiroTexto
  } else{
    textoShare = "Joguei boxd.com.br " + localStorage["data-" + localStorage["diaAtual"]] + " e consegui em " + chutesPlacar + 
    " tentativas\n\n" + tabuleiroTexto
  }
    document.getElementById("compartilhar").textContent="🔗 Copiado!"
  }
  
  async function jogar(linha, coluna, palpite){
    enviarBotao.textContent="⌚";/*⏳*/
    enviarBotao.disabled=true;
    if (!(palpite === "" || palpite.replaceAll(" ", "") === "")){
      const sucesso = await validarResposta(linha, coluna, palpite)

      //Valida se o filme já foi usado
      if(sessionStorage["usado"] === "1"){
        avisoTexto.textContent = "Filme já usado 🔂";
        document.getElementById("palpite-input").value = "";
        enviarBotao.textContent="Enviar";
        enviarBotao.disabled = false;
        sessionStorage["usado"] = 0

      //Valida se encontrou algum filme
      } else if (sessionStorage["nExiste"] === "1") {
        avisoTexto.textContent = "Filme não encontrado 🔎";
        document.getElementById("palpite-input").value = "";
        enviarBotao.textContent="Enviar";
        enviarBotao.disabled = false; 
        sessionStorage["nExiste"] = 0
      } 
      else{
        aumentarChutes();
        if (sucesso){
          aumentarPontos();
          setMostraPalpite(!mostraPalpite)
          setEstiloPalpite({
            visibility : "hidden",
            opacity : 0,
          })
          if (botaoAtual.value === "0"){
            botaoAtual.style.backgroundColor = "#1b961b";
            salvarTabuleiro(btAtual, 1)
          } else {
            botaoAtual.style.backgroundColor = "#e8b51e";
            salvarTabuleiro(btAtual, 2)
          }
          const filmeBt = "filme" + btAtual
          localStorage[filmeBt + localStorage["diaAtual"]] = localStorage["filmeAcerto"]
          botaoAtual.textContent = localStorage[filmeBt + localStorage["diaAtual"]]/*"✅"*/;
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
      if (document.getElementById(botoesLista[i]).textContent === "."){
        tabuleiroTexto = tabuleiroTexto + "🟥";
      } else if (document.getElementById(botoesLista[i]).value === "0"){
        tabuleiroTexto = tabuleiroTexto + "🟩";
      } else {
        tabuleiroTexto = tabuleiroTexto + "🟨";
      }
      if ((i+1) % 3 === 0){
        tabuleiroTexto = tabuleiroTexto + "\n"
      }
    }
    console.log("Completa: " + tabuleiroTexto)
  }

  function controlaRegras(limpar = false){
    if(limpar){
      localStorage["sumirRegras"] = true
    }
    document.getElementById("containerRegras").style.display = "none";
    document.getElementById("containerRegras").style.opacity = 0;
  }

    //   <div class="desistencia">
    //   <button id="desistir" style={estiloDesiste} onClick={() =>{desistir()}}>Desistir</button>
    //   <div class="confirmaDesiste" style={estiloConfDesiste}>
    //     <a>Quer mesmo desistir?</a>
    //     <div class="botoesDesiste">
    //       <table>
    //         <td style={{textAlign: "left", width: "50%"}}><button onClick={() => {derrota(); localStorage["perdeu"] = perdeu}}>Sim</button></td>
    //         <td style={{textAlign: "right", width: "50%"}}><button onClick={() =>{desistir()}}>Não</button></td>
    //       </table>
    //     </div>
    //   </div>
    // </div>

  return (
    <div>
    <div class="logo">
      <img src="/logotipo.png"></img>
    </div>
    <div class="logo"></div> {/*Espaçamento*/}
  
    <div class="reprise">
      <button id="botao-ante" onClick={() => {mudarCategorias(categoriasAnte, "ante", temAtor[2]); atualizarVitoria(); replicarTabuleiro(); completaTabuleiro();}} style={estiloAnte}>-</button>
      <button id="botao-ontem" onClick={() => {mudarCategorias(categoriasOntem, "ontem", temAtor[1]); atualizarVitoria(); replicarTabuleiro(); completaTabuleiro();}} style={estiloOntem}>-</button>
      <button id="botao-hoje" onClick={() => {mudarCategorias(categoriasHoje, "hoje", temAtor[0]); atualizarVitoria(); replicarTabuleiro(); completaTabuleiro();}} style={estiloHoje}>-</button>
    </div>

    <div class= "vict" style={estiloVitoria}>
      <div class = "vitoria">
        <a style={{marginTop: "8px"}} id="parabens">Parabéns!</a>
        <a id="numerosVict">Você conseguiu em {chutesPlacar} tentativas</a>
        <span>{tabuleiroTexto}</span>
        <button id="compartilhar" onClick={() => {copiar(); navigator.clipboard.writeText(textoShare)}}>🔗 Compartilhe</button>
      </div>
    </div>

    <div>
      <table class = "grid">
        <tr>
          <td id="vazio"><img src={fotoAtor} style={estiloFoto}></img></td>
          <th><div class="brdrColuna"><a style={{lineBreak: "strict"}}>{coluna1[0]}</a></div></th>
          <th><div class="brdrColuna">{coluna2[0]}</div></th>
          <th><div class="brdrColuna">{coluna3[0]}</div></th>
        </tr>
        <tr>
          <th><div class="brdrLinha">{linha1[0]}</div></th>
          <td><button class="botao" id="btNO" value="0"
              style={{borderTopLeftRadius : "30px"}} 
              onClick={() => {setLinha(linha1); setColuna(coluna1); palpite(true); setBtAtual("btNO");}}>.</button></td>
          <td><button class="botao" id="btN" value="0" onClick={() => {setLinha(linha1); setColuna(coluna2); palpite(true); setBtAtual("btN"); }}>.</button></td>
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
          <td style={{textAlign: "left", width: "50%"}}>Acertos: {pontosPlacar}</td>
          <td style={{textAlign: "right", width: "50%"}}>Palpites: {chutesPlacar}</td>
        </table>
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
          <input type="text" id="palpite-input" onKeyDown={(e) => {handler(e)}} autoComplete="off" ></input>
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
