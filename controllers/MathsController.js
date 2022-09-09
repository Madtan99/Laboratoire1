const MathsModel = require('../models/maths');
const Repository = require('../models/repository');
function NumberIsFirst(number) {
    if (number == 2){
        return false;
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
            this.repository = new Repository(new MathsModel());
        }
        get() {
            if (this.HttpContext.path.queryString[0] == '?') {
                var params = this.HttpContext.path.params;
                var isValid = true;
                var answer;
                Object.keys(params).forEach(element => {
                    if (!["x", "y", "n", "op"].includes(element)){
                        isValid = false;
                        answer = "There is a parameter which should not be in the request";
                    }
                });
                if (params.op && isValid) {
                    if (params.x && params.y) {
                        if (isNaN(params.x)) {
                            answer = "Error, the x parameter is not a number";
                        }
                        else if (isNaN(params.y)) {
                            answer = "Error, the y parameter is not a number";
                        }
                        else {
                            var x = parseInt(params.x);
                            var y = parseInt(params.y);
                            if (params.op == "+" || params.op == " ") {
                                answer = x + y;
                            }
                            else if (params.op == "-") {
                                answer = x - y;
                            }
                            else if (params.op == "x") {
                                answer = x * y;
                            }
                            else if (params.op == "/") {
                                answer = x / y;
                            }
                            else if (params.op == "%") {
                                answer = x % y;
                            }
                            else{
                                answer = "Invalid operation";
                            }
                        }
                    }
                    else if (params.n) {
                        if (isNaN(params.n)) {
                            answer = "Error, the n parameter is not a number";
                        }
                        else {
                            var n = params.n;
                            if (params.op == "!") {
                                if (n == 0) {
                                    answer = 1;
                                }
                                else if (n < 0) {
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

                                while(firstsFound < n){
                                    currentNum++;
                                    if (NumberIsFirst(currentNum)){
                                        firstsFound++;
                                    }
                                }

                                answer = currentNum;
                            }
                            else{
                                answer = "Invalid operation";
                            }
                        }

                    }
                }

                this.HttpContext.response.JSON(
                    Object.assign(params, { "value": answer })
                );
            }
            else
                this.HttpContext.response.notImplemented();
        }
    }