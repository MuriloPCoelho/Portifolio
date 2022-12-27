const score = document.querySelectorAll("div.score")
let spaces = document.querySelectorAll("div.space")
const turnText = document.querySelector("div#turn")
const reset = document.querySelector("div#reset")
let turn = 1
updateTurnIndicator(turn)
let xMoves = []
let oMoves = []

spaces.forEach((space , index) => {
    space.addEventListener("click", (e) => {
        turn *= -1

        selectSpace(index, turn)
        saveMove(turn, index)

        if(turn === -1) {
            verifyMoves(xMoves, turn)
        } else {
            verifyMoves(oMoves, turn)
        }

    })
})

function selectSpace(index, turn) {
    const currentTurn = turn === -1 ? "X" : "O"
    
    const area = document.createElement("div")
    area.id = currentTurn
    
    const Form1 = document.createElement("div")
    Form1.id = `${currentTurn}-form__1`
    
    const Form2 = document.createElement("div")
    Form2.id = `${currentTurn}-form__2`
    
    if(spaces[index].firstChild === null) {
        area.appendChild(Form1)
        area.appendChild(Form2)
    
        spaces[index].appendChild(area)

        updateTurnIndicator(turn)
    } else {
        goBackTurn()
    }

}

function updateTurnIndicator (turn) {
    const nextTurn = turn === 1 ? "X" : "O"
    turnText.innerHTML = `Vez de ${nextTurn}`

    if(turn === 1) {
        score[1].style.borderBottom = "1.75px solid var(--score)"
        score[0].style.borderBottom = "2px solid var(--xColor)"
    } else {
        score[0].style.borderBottom = "1.75px solid var(--score)"
        score[1].style.borderBottom = "2px solid var(--oColor)"
    }
}

function saveMove (turn, index) {
    if(turn === -1 && xMoves.includes(index) === false && oMoves.includes(index) === false) {
        xMoves.push(index)
    } else if (turn === 1 && oMoves.includes(index) === false && xMoves.includes(index) === false) {
        oMoves.push(index)
    } 
}

function goBackTurn() {
    turn *= -1
}

const winConditions = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
]

let ended = false

function verifyMoves (movesList, turn) {
    const currentTurn = turn === -1 ? "X" : "O"
    let i = 0
    let points = 0
    
    winConditions.forEach(() => {
        points = 0
        movesList.forEach(move => {
            
            if(winConditions[i].includes(move)) {
                points++  
            }
            
        })
        
        if(points === 3) { 
            setTimeout(() => {alert(`O jogador ${currentTurn} ganhou!`)}, 100)
            spaces = ""
            ended = true
            console.log('oi')
        }
               
        i++
    })

    if(xMoves.concat(oMoves).length === 9 && ended === false) {
        setTimeout(() => {alert("Empatou!")}, 100)
    }
}

reset.addEventListener("click", (e) => {
    spaces = document.querySelectorAll("div.space")
    spaces.forEach(space => {
        while(space.firstChild) {
            space.removeChild(space.firstChild)
        }
     })
     xMoves = []
     oMoves = []
})
