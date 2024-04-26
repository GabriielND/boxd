let temDois = true
let limite = 3
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNzlkNDU5NjY5NjY5ODU1MzE3MDViNGEzOWE4ZDY4NSIsInN1YiI6IjY1ZjY0MGNmYWUzODQzMDE3ZDQ5NDlhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dTJO6E39FTdBfVEqhzbQS8CzC_c0eN-ofl01LlvnEic'
    }
  };

function alteraDois(response) {
    if(response.length < 2){limite = 2; temDois = false}
    if(response.length < limite){temDois = false}
}

function buscarFilme(filme){
    return fetch('https://api.themoviedb.org/3/search/movie?query=' + encodeURI(filme) + '&include_adult=false&language=pt-BR&page=1', options)
    .then(response => response.json())
    .then(json => {
        return json;
    })
}

function buscarIdFilme(id){
    return fetch('https://api.themoviedb.org/3/movie/' + id + '?language=en-US', options)
    .then(response => response.json())
    .then(json => {
        return json;
    })
}

async function validarAno(anoResp, filmeResp, index){
    try {
        anoResp = Number(anoResp)
        const filme = await buscarFilme(filmeResp)
        alteraDois(filme["results"])
        const ano = filme["results"][index]["release_date"].substring(0,4)
        if (ano >= anoResp && ano <= anoResp+9){
            return true
        } else {
            return false
        }
    } catch (Exception){
        return false
    }
}

async function validarGenero(generoResp, filmeResp, index){
    try {
        const filmeGeral = await buscarFilme(filmeResp)
        alteraDois(filmeGeral["results"])
        const filmeDetal = await buscarIdFilme(filmeGeral["results"][index]["id"])
        const generosFilme = filmeDetal["genres"]
        for (let i = 0; i < generosFilme.length; i++) {
            if (generosFilme[i]["name"] == generoResp){
                return true
            }
        }
        return false
    } catch (Exception){
        return false
    }
}

async function validarNacional(filmeResp, index){
    try {
        const filmeGeral = await buscarFilme(filmeResp)
        alteraDois(filmeGeral["results"])
        const filmeDetal = await buscarIdFilme(filmeGeral["results"][index]["id"])
        const nacionalidade = filmeDetal["production_countries"][0]["name"]
        if (nacionalidade == "Brazil") {
            return true
        } else {
            return false
        }
    } catch (Exception){
        return false
    }
}

async function validarCategoria(catg, filme, index = 0){
    temDois = true;
    switch (catg[0]) {
        case "ano":
            return validarAno(catg[1], filme, index)
        case "genero":
            return validarGenero(catg[1], filme, index)
        case "nacional":
            return validarNacional(filme, index)
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
        if (catg1Passou && catg2Passou ){
            flag = true
        }
        i++
    } while(temDois && i < limite)
    if (!flag){
        console.log(catg1[1] + ": " + catg1Passou)
        console.log(catg2[1] + ": " + catg2Passou)
    }
    console.log(flag)
    return flag
}

// validarResposta(["ano", 2020], ["nacional", "Nacional"], "Meu cunhado é um vampiro")

//########################################################//

// const categorias = [
//     "genero", "ano"
// ]

// const generos =[
    //     ["Comedy", "Comédia"],
    //     ["Family", "Família"],
//     ["Fantasy", "Fantasia"],
//     ["Animation", "Animação"],
//     ["Action", "Ação"],
//     ["Adventure", "Aventura"],
// ]

// const anos = [
//     1980, 1990, 2000, 2010, 2020
// ]

// function sortearCategorias(){
//     const sorte1 = categorias[Math.floor(Math.random() * categorias.length)];
//     switch (sorte1) {
//         case "genero":
//             let linha = generos[Math.floor(Math.random() * generos.length)];
//             break;
    
//         default:
//             break;
//     }
// }

// async function jogar(){
    // await validarResposta(["genero", "Drama"], ["ano", 1990], "Titanic")
    // await validarResposta(["genero", "Drama"], ["ano", 2020], "Anatomia de uma queda")
    // await validarResposta(["genero", "Drama"], ["genero", "Comedy"], "Até que a sorte nos separe")
    // await validarResposta(["genero", "Animation"], ["ano", 1990], "A Pequena Sereia")
    // await validarResposta(["genero", "Animation"], ["ano", 2020], "Menino e a Garça")
    // await validarResposta(["genero", "Animation"], ["genero", "Comedy"], "Shrek")
    // await validarResposta(["genero", "Action"], ["ano", 1990], "Missão Impossível")
    // await validarResposta(["genero", "Action"], ["ano", 2020], "Velozes e Furiosos 9")
    // await validarResposta(["genero", "Action"], ["genero", "Comedy"], "Anjos da Lei")
// }

// jogar()