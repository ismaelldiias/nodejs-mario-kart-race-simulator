//DECLARAÇÃO DE VARIAVEIS/PLAYERS

const players = [
    {NOME: 'Mario', VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3, PONTOS: 0},
    {NOME: 'Peach', VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2, PONTOS: 0},
    {NOME: 'Yoshi', VELOCIDADE: 2, MANOBRABILIDADE: 4, PODER: 3, PONTOS: 0},
    {NOME: 'Bowser', VELOCIDADE: 5, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0},
    {NOME: 'Luigi', VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 4, PONTOS: 0},
    {NOME: 'Donkey Kong', VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0},
]

const chosenPlayers = [];
let numberOfRounds = 0;

//ENTRADA DE DADOS E CHECK

const readline = require("readline");

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function isValidPlayerChoice(choice) {
    const num = Number(choice);
    return Number.isInteger(num) && num >= 1 && num <= players.length && !chosenPlayers.includes(num);
}

function isValidRoundsChoice(choice) {
    const num = Number(choice);
    return Number.isInteger(num) && num >= 1 && num <= 25;
}

//ESCOLHENDO PLAYERS E NUMERO DE RODADAS

function listAvailablePlayers(){
    console.log(`\n🎮 Escolha dois players para participar da corrida. Seguem abaixo os players disponíveis:\n`)
    for (let i = 0; i < players.length; i++){
        if(!chosenPlayers.includes(i+1)){
            console.log(`[Player ${i+1}] - Nome: ${players[i].NOME.padEnd(12)} Velocidade: ${String(players[i].VELOCIDADE).padEnd(3)} Manobrabilidade: ${String(players[i].MANOBRABILIDADE).padEnd(3)} Poder: ${String(players[i].PODER).padEnd(3)} Pontos: ${String(players[i].PONTOS).padEnd(3)}`);
        }
    }
    console.log("");
}

async function choosePlayers(){
    
    listAvailablePlayers();
    while (chosenPlayers.length != 2){

        let newPlayer;

        if (chosenPlayers.length === 0){
            newPlayer = await ask('❓ Digite o número do primeiro player: ')
        } else {
            newPlayer = await ask('❓ Digite o número do segundo player: ')
        }

        if (isValidPlayerChoice(newPlayer)){
            chosenPlayers.push(Number(newPlayer))
        } else {
            console.log('🤔 Valor inválido, tente novamente!');
        }
    }
}

async function chooseNumberOfRounds() {

    let rounds;

    while (numberOfRounds === 0){
        rounds = await ask('🔁 Digite a quantidade de rodadas (1 a 25): ');

        if (isValidRoundsChoice(rounds)){
           numberOfRounds = Number(rounds);
        } else {
            console.log('🤔 Valor inválido, tente novamente!');
        }
    }
}

//ASYNC - aguarda o retorno dessa função pra continuar o código
function rollDice(){
    return Math.floor(Math.random()*6)+1;
}

function getRandomBlock(){

    let random = Math.random()
    let result

    switch(true){
        case random < 0.33:
            result = 'RETA'
            break;
        case random < 0.66:
            result = 'CURVA'
            break;
        default:
            result = 'CONFRONTO'
            //break; (opcional)
    }
    return result
}

function logRollResult(characterName,block,diceResult,attribute){
    console.log(`🎲 ${characterName} rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`)
}

function playRaceEngine(character1,character2,numberOfRounds){

    for(let round = 1; round <= numberOfRounds; round++){

        console.log(round < 10 ? `-------------------- 🏁 RODADA ${round} -------------------------------` : `-------------------- 🏁 RODADA ${round} ------------------------------`);
        
        //SORTEAR O BLOCO
        let block = getRandomBlock()
        //ROLAR OS DADOS
        let diceResult1 = rollDice()
        let diceResult2 = rollDice()
        //TESTE DE HABILIDADE
        let totalTestSkill1 = 0
        let totalTestSkill2 = 0

        if(block === "RETA"){
            console.log(`🛣️  Bloco: Reta`)
            totalTestSkill1 = diceResult1 + character1.VELOCIDADE
            totalTestSkill2 = diceResult2 + character2.VELOCIDADE
            logRollResult(character1.NOME,"velocidade",diceResult1,character1.VELOCIDADE)
            logRollResult(character2.NOME,"velocidade",diceResult2,character2.VELOCIDADE)
        }
        if(block === "CURVA"){
            console.log(`⛰️  Bloco: Curva`)
            totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE
            totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE
            logRollResult(character1.NOME,"manobrabilidade",diceResult1,character1.MANOBRABILIDADE)
            logRollResult(character2.NOME,"manobrabilidade",diceResult2,character2.MANOBRABILIDADE)
        }
        if(block === "CONFRONTO"){

            console.log(`🥊 Bloco: Confronto`)

            let powerResult1 = diceResult1 + character1.PODER
            let powerResult2 = diceResult2 + character2.PODER

            logRollResult(character1.NOME,"poder",diceResult1,character1.PODER)
            logRollResult(character2.NOME,"poder",diceResult2,character2.PODER)
        
            //SORTEIO DO ITEM DO CONFRONTO E DO TURBO
            let item = Math.random() < 0.5 ? "casco" : "bomba";
            let dano = item === "casco" ? 1 : 2;
            let turbo = Math.random() < 0.5 ? true : false;

            //VERIFICANDO RESULTADO DO CONFRONTO
            if (powerResult1 > powerResult2){
                if(turbo && ((character2.PONTOS - dano) > 0)){
                    console.log(`📋 ${character1.NOME} marcou 1 ponto com o turbo! ${character2.NOME} perdeu ${dano} ponto(s)!`)
                    character1.PONTOS++;
                    character2.PONTOS -= dano;
                }else if (turbo && ((character2.PONTOS - dano) <= 0)){
                    console.log(`📋 ${character1.NOME} marcou 1 ponto com o turbo! ${character2.NOME} perdeu ${dano} ponto(s) e ficou zerado!`)
                    character1.PONTOS++;
                    character2.PONTOS = 0;
                }else if (turbo && character2.PONTOS === 0){
                    console.log(`📋 ${character1.NOME} marcou 1 ponto com o turbo! ${character2.NOME} perdeu e permaneceu zerado!`)
                    character1.PONTOS++;
                }else if (!turbo && ((character2.PONTOS - dano) > 0)){
                    console.log(`📋 ${character2.NOME} perdeu ${dano} ponto(s)!`)
                    character2.PONTOS -= dano;
                }else if (!turbo && ((character2.PONTOS - dano) <= 0)){
                    console.log(`📋 ${character2.NOME} perdeu ${dano} ponto(s) e ficou zerado!`)
                    character2.PONTOS = 0;
                }else if (!turbo && character2.PONTOS === 0){
                    console.log(`📋 ${character2.NOME} perdeu e permaneceu zerado!`)
                }
            }
            else if (powerResult2 > powerResult1){
                if(turbo && ((character1.PONTOS - dano) > 0)){
                    console.log(`📋 ${character2.NOME} marcou 1 ponto com o turbo! ${character1.NOME} perdeu ${dano} ponto(s)!`)
                    character2.PONTOS++;
                    character1.PONTOS -= dano;
                }else if (turbo && ((character1.PONTOS - dano) <= 0)){
                    console.log(`📋 ${character2.NOME} marcou 1 ponto com o turbo! ${character1.NOME} perdeu ${dano} ponto(s) e ficou zerado!`)
                    character2.PONTOS++;
                    character1.PONTOS = 0;
                }else if (turbo && character1.PONTOS === 0){
                    console.log(`📋 ${character2.NOME} marcou 1 ponto com o turbo! ${character1.NOME} perdeu e permaneceu zerado!`)
                    character2.PONTOS++;
                }else if (!turbo && ((character1.PONTOS - dano) > 0)){
                    console.log(`📋 ${character1.NOME} perdeu ${dano} ponto(s)!`)
                    character1.PONTOS -= dano;
                }else if (!turbo && ((character1.PONTOS - dano) <= 0)){
                    console.log(`📋 ${character1.NOME} perdeu ${dano} ponto(s) e ficou zerado!`)
                    character1.PONTOS = 0;
                }else if (!turbo && character1.PONTOS === 0){
                    console.log(`📋 ${character1.NOME} perdeu e permaneceu zerado!`)
                }
            }
            else {
                console.log("⚖️  Confronto empatado! Nenhum ponto foi marcado ou perdido");        
            }
        }

        //VERIFICANDO O VENCEDOR DE RETA/CURVA
        if (totalTestSkill1 >  totalTestSkill2){
            console.log(`📋 ${character1.NOME} marcou um ponto!`)
            character1.PONTOS++
        }
        else if (totalTestSkill2 >  totalTestSkill1){
            console.log(`📋 ${character2.NOME} marcou um ponto!`)
            character2.PONTOS++
        }
        else if (totalTestSkill1 === totalTestSkill2 && totalTestSkill1 != 0){
            console.log("⚖️  Empate! Nenhum ponto foi marcado");
        }
    }
    console.log('----------------------------------------------------------------')
}

function declareWinner(character1,character2) {

    console.log("🥁 Resultado final:")
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`)    
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`)
    
    if(character1.PONTOS > character2.PONTOS)
        console.log(`\n🏆 ${character1.NOME} venceu a corrida! Parabéns!`)
    else if(character2.PONTOS > character1.PONTOS)
        console.log(`\n🏆 ${character2.NOME} venceu a corrida! Parabéns!`)
    else
        console.log("\n⚖️  A corrida terminou em empate")

}

(async function main(){

    console.log(`-----------------------------------`)
    console.log(` 🏁 Bem-vindo ao Mario Kart JS 🏁`)
    console.log(`-----------------------------------`)

    await choosePlayers();
    await chooseNumberOfRounds();

    console.log(`\n🚨 Corrida entre ${players[chosenPlayers[0]-1].NOME} e ${players[chosenPlayers[1]-1].NOME} começando... \n`);
    
    playRaceEngine(players[chosenPlayers[0]-1],players[chosenPlayers[1]-1],numberOfRounds);
    declareWinner(players[chosenPlayers[0]-1],players[chosenPlayers[1]-1]);

})();