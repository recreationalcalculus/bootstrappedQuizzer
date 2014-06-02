
//create "namespace"
var quizApp = {};


//=====================================================
//      Define Question Object -- Instance variables
//=====================================================
quizApp.Question = function () {

    this.quizTitle = 'The World\'s Easiest Quiz';

    this.status = { isCorrect: false, isIncorrect: false, isUnanswered: true };

    //The Question object writes and maintains its own settings modal
    this.settings = {

        option1: {
            value1: (document.getElementById('op1val1') ? document.getElementById('op1val1').checked : true),
            value2: (document.getElementById('op1val2') ? document.getElementById('op1val2').checked : false),
        },
        option2: {
            value1: (document.getElementById('op2val1') ? document.getElementById('op2val1').checked : true),
            value2: (document.getElementById('op2val2') ? document.getElementById('op2val2').checked : true),
            value3: (document.getElementById('op2val3') ? document.getElementById('op2val3').checked : false)
        },

        write: function () {
            //write the html that will go into the settings modal
            var str = '';

            str += '<div class="panel panel-primary">';
            str += '<div class="panel-heading">';
            str += '<h3 class="panel-title">Option 1</h3>';
            str += '</div>';
            str += '<div class="panel-body">';
            str += '<input type="radio" name="op1" id="op1val1" value="value1" ' + (this.option1.value1 ? 'checked' : '') + ' /><label for="op1val1">Value 1</label><br />';
            str += '<input type="radio" name="op1" id="op1val2" value="value2" ' + (this.option1.value2 ? 'checked' : '') + '/><label for="op1val2">Value 2</label>';
            str += '</div>';
            str += '</div>';
            str += '<div class="panel panel-primary">';
            str += '<div class="panel-heading">';
            str += '<h3 class="panel-title">Option 2</h3>';
            str += '</div>';
            str += '<div class="panel-body">';
            str += '<input type="checkbox" id="op2val1" value="value 1" ' + (this.option2.value1 ? 'checked' : '') + ' /><label for="op2val1">Value 1</label><br />';
            str += '<input type="checkbox" id="op2val2" value="value 2" ' + (this.option2.value2 ? 'checked' : '') + ' /><label for="op2val2">Value 2</label><br />';
            str += '<input type="checkbox" id="op2val3" value="value 3" ' + (this.option2.value3 ? 'checked' : '') + ' /><label for="op2val3">Value 3</label>';
            str += '</div>';
            str += '</div>';

            document.getElementById('settingsForm').innerHTML = str;
        },

        update: function () {
            this.option1.value1 = document.getElementById('op1val1').checked;
            this.option1.value2 = document.getElementById('op1val2').checked;

            this.option2.value1 = document.getElementById('op2val1').checked;
            this.option2.value2 = document.getElementById('op2val2').checked;
            this.option2.value3 = document.getElementById('op2val3').checked;

            this.write();
        }
    };
}

//=====================================================
//      Define Question Object -- methods
//=====================================================
quizApp.Question.prototype = {

    constructor: quizApp.Question,

    writeQuestion: function (questionIndex) {
        var countOp2Values = 0;
        if (this.settings.option2.value1) { countOp2Values++; }
        if (this.settings.option2.value2) { countOp2Values++; }
        if (this.settings.option2.value3) { countOp2Values++; }

        var op2ValueString = '';

        switch (countOp2Values) {
            case 0:
                op2ValueString += 'no values ';
                break;

            case 1:
                if (this.settings.option2.value1) {
                    op2ValueString += 'value 1 ';
                }

                else if (this.settings.option2.value2) {
                    op2ValueString += 'value 2 ';
                }
                else {
                    op2ValueString += 'value 3 ';
                }
                break;

            case 2:
                if (this.settings.option2.value1) {
                    if (this.settings.option2.value2) {
                        op2ValueString += 'values 1 &amp; 2 ';
                    }
                    else {
                        op2ValueString += 'values 1 &amp; 3 ';
                    }
                }

                else {
                    op2ValueString += 'values 2 &amp; 3 '
                }
                break;

            case 3:
                op2ValueString += 'all values '
                break;
            default:
                alert('something unexpected happened to the value of countOp2Values in the body of quizApp.Question.writeQuestion()');

        }

        var questionText = '';
        questionText += 'Question ' + (questionIndex + 1) + ' was created with ' + ((this.settings.option1.value1) ? 'value 1 ' : 'value 2 ') + 'selected for option 1 ';
        questionText += 'and ' + op2ValueString + ' selected for option 2.';

        var str = '';

        str += '<p>' + questionText + '</p>';
        str += '<p class="btn-group">';
        str += '<a href="#" class="btn btn-lg btn-success" onclick="q.check(' + questionIndex + ',true)">Correct Answer</a>';
        str += '<a href="#" class="btn btn-danger btn-lg" onclick="q.check(' + questionIndex + ',false)">Incorrect Answer</a>';
        str += '</p>';

        return str;
    },

    isCorrect: function (answer) {
        //return true or false depending on whether answer is correct
        return answer;
    }
}




//=====================================================
//      Define Quiz Object -- Instance variables
//=====================================================
quizApp.Quiz = function (numberOfQuestions) {

    this.numberOfQuestions = numberOfQuestions;

    this.questionList = [];

    // a Quiz object is basically an array of question 
    // objects with a few helper methods tacked on
    for (var i = 0; i < numberOfQuestions; i++) {
        this.questionList.push(new quizApp.Question());
    }
};

//=====================================================
//      Define Quiz Object -- Methods
//=====================================================
quizApp.Quiz.prototype = {

    constructor: quizApp.Quiz,

    makeQuestionArray: function () {
        document.getElementById('attempted').innerHTML = 0;
        document.getElementById('correct').innerHTML = 0;
        document.getElementById('incorrect').innerHTML = 0;
        document.getElementById('percent').innerHTML = '0%';
        this.questionList = [];
        for (var i = 0; i < this.numberOfQuestions; i++) {
            this.questionList.push(new quizApp.Question());
        }
    },

    writeQuestion: function (questionIndex) {
        var headingGlyph = '';

        if (this.questionList[questionIndex].status.isCorrect) {
            headingGlyph = '<span class="glyphicon glyphicon-ok green"></span>';
        }
        else if (this.questionList[questionIndex].status.isIncorrect) {
            headingGlyph = '<span class="glyphicon glyphicon-remove red"></span>';
        }
        else {
            headingGlyph = '';
        }

        var str = '';
        str += '<div class="item' + (questionIndex === 0 ? ' active' : '') + '" id="carouselQuestion' + questionIndex + '">';
        str += '<h1>' + headingGlyph + 'Question ' + (questionIndex + 1) + '</h1>';
        str += this.questionList[questionIndex].writeQuestion(questionIndex);
        str += '</div>';
        return str;
    },

    makeCarousel: function () {

        var str = '';
        str += '<div id="myCarousel" class="carousel slide jumbotron" data-interval="false">';
        str += '<div class="container">';

        str += '<ol class="carousel-indicators">';
        for (var i = 0; i < this.questionList.length; i++) {
            str += '<li class="' + ((i === 0) ? 'active ' : '') + '" data-target="#myCarousel" data-slide-to="' + i + '" id="carousel-indicator' + i + '"></li>';
        }
        str += '</ol>';

        str += '<div class="carousel-inner">';
        for (var i = 0; i < this.questionList.length; i++) {
            str += this.writeQuestion(i);
        }
        str += '</div>';
        str += '</div>';
        str += '<a class="left carousel-control" href="#myCarousel" data-slide="prev">';
        str += '<span class="icon-prev"></span>';
        str += '</a>';
        str += '<a class="right carousel-control" href="#myCarousel" data-slide="next" id="advanceCarousel">';
        str += '<span class="icon-next"></span>';
        str += '</a>';
        str += '</div>';

        document.getElementById('main').innerHTML = str;

    },

    check: function (questionIndex, answer) {
        var question = this.questionList[questionIndex];
        if (question.status.isUnanswered) {

            var attempted = parseInt(document.getElementById('attempted').innerHTML);
            var correct = parseInt(document.getElementById('correct').innerHTML);
            var incorrect = parseInt(document.getElementById('incorrect').innerHTML);
            var percent = parseInt(document.getElementById('percent').innerHTML);

            if (question.isCorrect(answer)) {
                attempted++;
                correct++;
                percent = Math.floor(100 * correct / attempted + .5);

                question.status.isCorrect = true;
                question.status.isIncorrect = false;
                question.status.isUnanswered = false;

            }

            else {
                attempted++;
                incorrect++;
                percent = Math.floor(100 * correct / attempted + .5);

                question.status.isCorrect = false;
                question.status.isIncorrect = true;
                question.status.isUnanswered = false;
            }

            document.getElementById('attempted').innerHTML = attempted;
            document.getElementById('correct').innerHTML = correct;
            document.getElementById('incorrect').innerHTML = incorrect;
            document.getElementById('percent').innerHTML = percent + '%';

            //document.getElementById('carouselQuestion' + questionIndex).innerHTML = this.questionList[questionIndex].writeQuestion(questionIndex);
            document.getElementById('carouselQuestion' + questionIndex).innerHTML = this.writeQuestion(questionIndex);
            document.getElementById('carousel-indicator' + questionIndex).style.backgroundColor = (this.questionList[questionIndex].status.isCorrect) ? '#3c763d' : '#a94442';
            setTimeout((function () { })(), 250);
            document.getElementById('advanceCarousel').click();
        }

        else {
            //don't do anything
        }


    },

    updateSettings: function () {
        (new quizApp.Question()).settings.update();
        (new quizApp.Question()).settings.write();
        this.makeQuestionArray();
        this.makeCarousel();
    },

    initiate: function () {
        (new quizApp.Question()).settings.write();
        document.getElementById('quizTitle').innerHTML = (new quizApp.Question()).quizTitle;
        this.makeCarousel();
    }

}

