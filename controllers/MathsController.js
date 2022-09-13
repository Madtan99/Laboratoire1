const fs = require('fs');
function NumberIsFirst(number) {
    if (number == 1) {
        return false;
    }
    if (number == 2) {
        return true;
    }
    for (var i = 2; i < number; i++) {
        if (number % i === 0) {
            return false;
        }
    }
    return true;
}

module.exports =
    class MathsController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext);
        }
        get() {
            if (this.HttpContext.path.queryString[0] == '?') {
                var params = this.HttpContext.path.params;
                var isValid = true;
                var noOperator = false;
                var answer;
                var numParams = 0;
                Object.keys(params).forEach(element => {
                    if (!["x", "y", "n", "op"].includes(element)) {
                        isValid = false;
                        answer = "There is a parameter which should not be in the request";
                    }
                    ++numParams;
                });
                if (numParams == 0){
                    noOperator = true;
                }
                else if (params.op && isValid) {
                    if (params.op == ' '){
                        params.op = "+";
                    }
                    if (params.x && params.y) {
                        if (isNaN(params.x)) {
                            isValid = false;
                            answer = "Error, the x parameter is not a number";
                        }
                        else if (isNaN(params.y)) {
                            isValid = false;
                            answer = "Error, the y parameter is not a number";
                        }
                        else {
                            var x = parseInt(params.x);
                            var y = parseInt(params.y);
                            if (params.op == "+") {
                                answer = x + y;
                            }
                            else if (params.op == "-") {
                                answer = x - y;
                            }
                            else if (params.op == "x" || params.op == "*") {
                                answer = x * y;
                            }
                            else if (params.op == "/") {
                                if (y == 0) {
                                    if (x == 0) {
                                        answer = "NaN";
                                    }
                                    else {
                                        answer = "Infinity";
                                    }
                                }
                                else {
                                    answer = x / y;
                                }
                            }
                            else if (params.op == "%") {
                                if (y == 0) {
                                    answer = "NaN";
                                }
                                else {
                                    answer = x % y;
                                }
                            }
                            else {
                                isValid = false;
                                answer = "Invalid operation";
                            }
                        }
                    }
                    else if (params.n) {
                        if (isNaN(params.n)) {
                            isValid = false;
                            answer = "Error, the n parameter is not a number";
                        }
                        else {
                            var n = params.n;
                            if (params.op == "!") {
                                if (n == 0) {
                                    answer = 1;
                                }
                                else if (n < 0) {
                                    isValid = false;
                                    answer = "Error, you cannot factorialize a number under 0";
                                }
                                else {
                                    let factorial = 1;
                                    for (let i = 1; i <= n; i++) {
                                        factorial *= i;
                                    }
                                    answer = factorial;
                                }
                            }
                            else if (params.op == "p") {
                                answer = NumberIsFirst(n);
                            }
                            else if (params.op == "np") {
                                var firstsFound = 0;
                                var currentNum = 0;

                                while (firstsFound < n) {
                                    currentNum++;
                                    if (NumberIsFirst(currentNum)) {
                                        firstsFound++;
                                    }
                                }

                                answer = currentNum;
                            }
                            else {
                                isValid = false;
                                answer = "Invalid operation";
                            }
                        }

                    }
                }
                else{
                    isValid = false;
                    answer = "There is no operator";
                }
                
                if (noOperator){
                    this.HttpContext.response.HTML(
                        fs.readFileSync("wwwroot/MathsHelp.html")
                    );
                }
                else if (isValid) {
                    this.HttpContext.response.JSON(
                        Object.assign(params, { "value": answer })
                    );
                }
                else {
                    this.HttpContext.response.JSON(
                        Object.assign(params, { "error": answer })
                    );
                }

            }
            else
                this.HttpContext.response.notImplemented();
        }
    }