const previousOperationText = document.querySelector("#previous-operation")
const currentOperationText = document.querySelector("#current-operation")
const buttons = document.querySelectorAll("#buttons-container button")

class Calculator {
    constructor(previousOperationText, currentOperationText) {
        this.previousOperationText = previousOperationText
        this.currentOperationText = currentOperationText
        this.currentOperation = ""
    }

    // Add digit to calculator screen
    addDigit(digit) {
        // Check if current operation already has a dot
        if(digit === "." && this.currentOperationText.innerText.includes(".")) {
            return
        }

        this.currentOperation = digit
        this.updateScreen()
    }

    // Process all calculator operations
    processOperation(operation) {

        if (operation === "=" && this.currentOperationText.innerText === "") {
            this.currentOperationText.innerText = 0
        }
        // Check if current is empty
        if(this.currentOperationText.innerText === "" && operation !== "C") {
            // Change operation
            if(previousOperationText.innerText !== "") {
                this.changeOperation(operation)
            }
            return
        }
        
        // Get current and previous value
        let operationValue
        let current = +this.currentOperationText.innerText
        let previous =  +this.previousOperationText.innerText.split(" ")[0]

        switch(operation) {
            case "+":
                operationValue = previous + current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case "-":
                operationValue = previous - current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case "/":
                operationValue = previous / current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case "x":
                operationValue = previous * current
                this.updateScreen(operationValue, operation, current, previous)
                break
            case "DEL":
                this.processDelOperator()
                break
            case "CE":
                this.processClearCurrentOperation()
                break
            case "C":
                this.processClearOperation()
                break
            case "%":
                this.processPercentageOperation()
                break
            case "¹/x":
                this.processFractionOperator()
                break
            case "x²":
                this.processSquareOperator()
                break
            case "²√x":
                this.processSquareRootOperator()
                break
            case "+/-":
                this.processToggleOperator()
                break
            case "=":
                if (this.previousOperationText.innerText !== "") {
                    this.processEqualOperator()
                    this.updateScreen(operationValue, operation, current, previous)
                }
                break
            default:
                return
        }
    }

    // Change values of the calculator screen
    updateScreen(operationValue = null, operation = null, current = null, previous = null) {
          
        if(operationValue === null) {
            this.currentOperationText.innerText += this.currentOperation
        } else {
            // Check if value is zero, if it is just add current value
            if(previous === 0) {
                operationValue = current
            }

            // Add current value to previous
            this.previousOperationText.innerText = `${operationValue} ${operation}`
            this.currentOperationText.innerText = ""
        }

        if(operation === "=") {
            this.currentOperationText.innerText = this.previousOperationText.innerText.split(" ")[0]
            this.previousOperationText.innerText = ""

        }

    }

    // Change math operation
    changeOperation(operation) {
        const mathOperations = ["+", "-", "x", "/"]

        if (!mathOperations.includes(operation)) {
            return
        }

        this.previousOperationText.innerText = this.previousOperationText.innerText.slice(0, -1) + operation
    }

    // Delete the last digit
    processDelOperator() {
        this.currentOperationText.innerText = this.currentOperationText.innerText.slice(0, -1)
    }

    // Clear current operation
    processClearCurrentOperation() {
        this.currentOperationText.innerText = ""
    }

    // Clear all operations
    processClearOperation() {
        this.currentOperationText.innerText = ""
        this.previousOperationText.innerText = ""
    }

    //
    processPercentageOperation() {
        const percent = (+currentOperationText.innerText * +this.previousOperationText.innerText.split(" ")[0]) / 100
        this.currentOperationText.innerText = percent
    }

    //
    processFractionOperator() {
        this.currentOperationText.innerText = 1 / +this.currentOperationText.innerText
    }

    //
    processSquareOperator() {
        this.currentOperationText.innerText = +this.currentOperationText.innerText * +this.currentOperationText.innerText
    }

    //
    processSquareRootOperator() {
        this.currentOperationText.innerText = Math.sqrt(+this.currentOperationText.innerText) 
    }

    // Toggles number signs
    processToggleOperator() {
        this.currentOperationText.innerText = +this.currentOperationText.innerText * -1
    }

    //process an operation
    processEqualOperator() {
        const operation = previousOperationText.innerText.split(" ")[1]
        this.processOperation(operation)
    }
}

const calc = new Calculator(previousOperationText, currentOperationText)

buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const value = e.target.innerText

        if(+value >= 0 || value === ".") {
            calc.addDigit(value)
        } else {
            calc.processOperation(value)
        }
    })
})