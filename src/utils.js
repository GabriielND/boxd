import fs from 'fs';

export async function contarResposta(){
    fs.appendFileSync("public/02-2025/20-02-2025.txt", "\nAA")
    // var stream = fs.createWriteStream("01-04-2025.txt", {flags:'a'});
    // console.log("Casa");
    // [...Array(10000)].forEach( function (item,index) {
    //     stream.write(localStorage["filmeAcerto"] + " - " + new Date().toISOString() + "\n");
    // });
    // stream.end();
  }

  // contarResposta()