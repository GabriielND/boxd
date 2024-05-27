const limiteFixo = 4
let temDois = true
let limite = limiteFixo
let filmeAcerto = ""
let filmeAtual
let filmesCertos = []

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNzlkNDU5NjY5NjY5ODU1MzE3MDViNGEzOWE4ZDY4NSIsInN1YiI6IjY1ZjY0MGNmYWUzODQzMDE3ZDQ5NDlhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dTJO6E39FTdBfVEqhzbQS8CzC_c0eN-ofl01LlvnEic'
    }
  };

function alteraDois(response) {
    if (response.length < limite){
        limite = response.length
    }
    if (limite < 2){
        temDois = false
    }
}

function buscarFilme(filme){
    return fetch('https://api.themoviedb.org/3/search/movie?query=' + encodeURI(filme) + '&include_adult=false&language=pt-BR&page=1', options)
    .then(response => response.json())
    .then(json => {
        return json;
    })
}

function buscarIdFilme(id){
    return fetch('https://api.themoviedb.org/3/movie/' + id + '?language=pt-BR', options)
    .then(response => response.json())
    .then(json => {
        return json;
    })
}

function buscarKWFilme(id){
    return fetch("https://api.themoviedb.org/3/movie/" + id + "/keywords", options)
    .then(response => response.json())
    .then(json => {
        return json;
    })
}

function buscarListaFilme(id){
    return fetch("https://api.themoviedb.org/3/movie/" + id + "/lists?language=pt-BR&page=1", options)
    .then(response => response.json())
    .then(json => {
        return json;
    })
}

function buscarElencoFilme(id){
    return fetch("https://api.themoviedb.org/3/movie/" + id + "/credits?language=pt-BR", options)
    .then(response => response.json())
    .then(json => {
        return json;
    })
}

async function validarAno(anoResp, filmeResp, index){
    try {
        anoResp = Number(anoResp)
        const filmeGeral = await buscarFilme(filmeResp)
        alteraDois(filmeGeral["results"])
        const ano = filmeGeral["results"][index]["release_date"].substring(0,4)
        filmeAcerto = filmeGeral["results"][index]["title"]
        filmeAtual = filmeGeral["results"][index]["id"]
        if (ano >= anoResp && ano <= anoResp+9){
            localStorage["filmeAcerto"] = filmeAcerto
            return true
        } else {
            return false
        }
    } catch (Exception){
        console.log(Exception)
        return false
    }
}

async function validarGenero(generoResp, filmeResp, index){
    try {
        const filmeGeral = await buscarFilme(filmeResp)
        alteraDois(filmeGeral["results"])
        const filmeDetal = await buscarIdFilme(filmeGeral["results"][index]["id"])
        const generosFilme = filmeDetal["genres"]
        filmeAcerto = filmeGeral["results"][index]["title"]
        filmeAtual = filmeGeral["results"][index]["id"]
        for (let i = 0; i < generosFilme.length; i++) {
            if (generosFilme[i]["name"] == generoResp){
                localStorage["filmeAcerto"] = filmeAcerto
                return true
            }
        }
        return false
    } catch (Exception){
        console.log(Exception)
        return false
    }
}

async function validarNacional(filmeResp, index){
    try {
        const filmeGeral = await buscarFilme(filmeResp)
        alteraDois(filmeGeral["results"])
        const filmeDetal = await buscarIdFilme(filmeGeral["results"][index]["id"])
        const nacionalidade = filmeDetal["production_countries"][0]["name"]
        filmeAcerto = filmeGeral["results"][index]["title"]
        filmeAtual = filmeGeral["results"][index]["id"]
        if (nacionalidade == "Brazil") {
            localStorage["filmeAcerto"] = filmeAcerto
            return true
        } else {
            return false
        }
    } catch (Exception){
        console.log(Exception)
        return false
    }
}

async function validarProdutora(produtoraResp, filmeResp, index){
    try {
        let formatProdutora
        if (produtoraResp.includes(" ")){
            formatProdutora = produtoraResp.split(" ")
        } else{
            formatProdutora = [produtoraResp, produtoraResp]
        }
        const filmeGeral = await buscarFilme(filmeResp)
        alteraDois(filmeGeral["results"])
        const filmeDetal = await buscarIdFilme(filmeGeral["results"][index]["id"])
        const produtoras = filmeDetal["production_companies"]
        filmeAcerto = filmeGeral["results"][index]["title"]
        filmeAtual = filmeGeral["results"][index]["id"]
        for (let i = 0; i < produtoras.length; i++){
            console.log(produtoras)
            console.log(formatProdutora)
            if (produtoras[i]["name"].includes(formatProdutora[0]) && produtoras[i]["name"].includes(formatProdutora[1])){
                localStorage["filmeAcerto"] = filmeAcerto
                return true
            }
        }
        return false
    } catch (Exception){
        console.log(Exception)
        return false
    }
}

const variantes = [
    ["sports", "sport", "olympic sport"],
    ["based on novel or book", "based on book", "based-on-novel", "based on novel", "based on young adult novel", "based on graphic novel", "based on memoir or autobiography"],
    ["stop motion", "stopmotion"],
    ["based on comic", "based on graphic novel"]
]

async function validarKeywords(kwResp, filmeResp, index){
    let keywords = []
    kwResp = kwResp.toLowerCase();
    try{
        switch (kwResp) {
            case "sports":
                keywords = keywords.concat(variantes[0])
                break;
            case "based on novel or book":
                keywords = keywords.concat(variantes[1])
                break;
            case "stop motion":
                keywords = keywords.concat(variantes[2])
                break;
            case "based on comic":
                keywords = keywords.concat(variantes[3])
            default:
                keywords.push(kwResp);
        }
        const filmeGeral = await buscarFilme(filmeResp)
        alteraDois(filmeGeral["results"])
        const filmeDetal = await buscarKWFilme(filmeGeral["results"][index]["id"])
        const kwsFilme = filmeDetal["keywords"]
        filmeAcerto = filmeGeral["results"][index]["title"]
        filmeAtual = filmeGeral["results"][index]["id"]
        for (let i = 0; i < kwsFilme.length; i++) {
            if (keywords.includes(kwsFilme[i]["name"])){
                localStorage["filmeAcerto"] = filmeAcerto
                return true
            }
        }
        return false
    } catch (Exception){
        console.log(Exception)
        return false
    }
}

async function validarLista(listaResp, filmeResp, index){
    try {
        const filmeGeral = await buscarFilme(filmeResp)
        alteraDois(filmeGeral["results"])
        const filmeDetal = await buscarListaFilme(filmeGeral["results"][index]["id"])
        const listasFilme = filmeDetal["results"]
        filmeAcerto = filmeGeral["results"][index]["title"]
        filmeAtual = filmeGeral["results"][index]["id"]
        for (let i = 0; i < listasFilme.length; i++){
            if (listasFilme[i]["name"] == listaResp){
                localStorage["filmeAcerto"] = filmeAcerto
                return true    
            }
        }
    } catch (Exception){
        console.log(Exception)
        return false
    }
}

async function validarElenco(elencoResp, filmeResp, index){
    try {
        const filmeGeral = await buscarFilme(filmeResp)
        alteraDois(filmeGeral["results"])
        const filmeDetal = await buscarElencoFilme(filmeGeral["results"][index]["id"])
        const elencoFilme = filmeDetal["cast"]
        filmeAcerto = filmeGeral["results"][index]["title"]
        filmeAtual = filmeGeral["results"][index]["id"]
        for (let i = 0; i < elencoFilme.length; i++){
            if (elencoFilme[i]["name"] == elencoResp){
                localStorage["filmeAcerto"] = filmeAcerto
                return true
            }
        }
    } catch (Exception){
        console.log(Exception)
        return false
    }
}

async function validarCategoria(catg, filme, index = 0){
    limite = limiteFixo
    temDois = true;
    switch (catg[0]) {
        case "ano":
            return validarAno(catg[1], filme, index)
        case "genero":
            return validarGenero(catg[1], filme, index)
        case "nacional":
            return validarNacional(filme, index)
        case "produtora":
            return validarProdutora(catg[1], filme, index)
        case "keyword":
            return validarKeywords(catg[1], filme, index)
        case "lista":
            return validarLista(catg[1], filme, index)
        case "elenco":
            return validarElenco(catg[1], filme, index)
        default:
            return false
    }
}

export async function validarResposta(catg1, catg2, filme){
    let flag = false
    let catg1Passou
    let catg2Passou
    let i = 0
    console.log("Filme: ", filme)
    do{
        catg1Passou = await validarCategoria(catg1, filme, i)
        catg2Passou = await validarCategoria(catg2, filme, i)
        console.log(filmesCertos)
        if(filmesCertos.includes(filmeAtual)){
            sessionStorage["usado"] = 1
            i++
            continue;
        }
        if (catg1Passou && catg2Passou){
            sessionStorage["usado"] = 0
            filmesCertos.push(filmeAtual)
            flag = true
            break
        }
        i++
    } while(temDois && i < limite)
    if (!flag){
        console.log(catg1[1] + ": " + catg1Passou)
        console.log(catg2[1] + ": " + catg2Passou)
    }
    return flag
}