var answer_list = [];
var questionIndex = 0;
var isValid = 0;
var SurveyDo = Spine.Controller.sub({
    elements: {
        "#page_cont": "page_cont"
    },

    events: {
        "click #save-answer": "saveAnswer",
        "change div dl dd select": "areaSelectChange",
        "click #next-page": "pagingSurvey",
        "click .page_next": "pageNext"
    },

    show: function () {
        $(".paper_next_container:gt(0)").hide();
        this.pagingSurvey();
    },

    init: function () {
        this.currentIndex = 0;
        this.show();
    },

    pageNext: function (e) {
        $(".paper_next_container").hide();
        $(e.target).parents(".paper_next_container").next().show();
    },

    areaSelectChange: function (e) {
        var areaType = $(e.target).next().attr('class');
        $(e.target.nextElementSibling).empty().append("<option value='0'>请选择</option>");
        $(areaData[areaType]).each(function(index, element) {
            var parentCode = e.target.value;
            if((element.code.substring(0,2) === parentCode.substring(0,2) && areaType === "city") || (element.code.substring(0,4) === parentCode.substring(0,4) && areaType === "district")) {
                $(e.target.nextElementSibling).append($("#area-option-template").tmpl([element]));
            }
        });
    },

    pagingSurvey: function () {
        isValid = 0;
        this.pushAnswer();
        if (isValid == 1) { return;}
        var that = this;
        $("#page_cont").empty();
        $(json.question_html).each(function(index, element) {
            if( index >= that.currentIndex ) {

                that._initAreaOptions(element);

                $("#page_cont").append(element);
                if ($(element).find(".questionary_list_opera").size() !== 0) {
                    that.currentIndex = index + 1;
                    return false;
                };

                that._submitButtonShow(index);
            }
        });
        $("#page_cont").find(".questionary_list_opera").remove();
    },

    validTextArea: function(selected, question, element) {
        var no = question.question_no;
        //select a option included text area, then input text area
        $(element).find('dd input').each(function(i,e){
            if (e.checked === true) {
                selected ++;
                if (typeof $(e.parentNode).find('textarea')[0] !== "undefined" && $(e.parentNode).find('textarea').val() === ''){
                    alert("第" + no + "题补充选项未填");
                    isValid = 1;
                }
            }
        });
        //input a text area but not select option
        if (typeof $(element).find('textarea')[0] !== "undefined" && $(element).find('textarea').val() !== '' && $(element).find('textarea').parent().find('input')[0].checked === false) {
            alert("第" + no + "题" + "未勾选补充选项");
            isValid = 1;
        };
        return selected;
    },

    validAnswer: function(question, element) {
        var selected = 0;
        var no = question.question_no;
        var type = question.question_type;
        switch(type) {
            case "0":
                var chosen = this.validTextArea(selected, question, element);
                //nothing has been chosen
                if (chosen === 0) {
                    alert("第" + no + "题未选择");
                    isValid = 1;
                };
        };

    },

    pushAnswer: function() {
        var questionNum = $('#page_cont').find('dl').length;
        var questionCurrentIndex = 0;
        var that = this;
        for(i=0;i<questionNum;i++) {
            var obj = $('#page_cont').find('dl')[questionCurrentIndex];
            var question = json.topic_list[questionIndex];
            var question_no = json.topic_list[questionIndex].question_no;
            var question_type = json.topic_list[questionIndex].question_type;
            that.validAnswer(question, obj);
            if (isValid == 1){return};
            var answer_detail_list = [];
            switch (question_type) {
                case "0":
                case "1":
                    $(obj).find('dd input').each(function (i, e) {
                        if (e.checked === true) {
                            if ($(e).parent().find('textarea')) {
                                answer_detail_list.push({
                                    question_value: json.topic_list[questionIndex].options[i].item_num,
                                    open_question_value: $(e).parent().find('textarea').val(),
                                    province: "",
                                    city: "",
                                    area: ""
                                });
                            }
                            else {
                                answer_detail_list.push({
                                    question_value: json.topic_list[questionIndex].options[i].item_num,
                                    open_question_value: "",
                                    province: "",
                                    city: "",
                                    area: ""
                                });
                            }
                        }
                    });
                    break;
                case "3":
                    var text = "";
                    if ($(obj).find('textarea').val()) {
                        text = $(obj).find('textarea').val();
                    }
                    else {
                        text = $(obj).find('input').val();
                    }
                    answer_detail_list.push({
                        question_value: "",
                        open_question_value: text,
                        province: "",
                        city: "",
                        area: ""
                    });
                    break;
                case "4":
                    answer_detail_list.push({
                        question_value: "",
                        open_question_value: "",
                        province: $(obj).find('.province').val(),
                        city: $(obj).find('.city').val(),
                        area: $(obj).find('.district').val()
                    });
                    break;
            };
            answer_list.push({
                result_id: json.result_id, //--->result_id,
                question_no: question_no,
                question_type: question_type,
                answer_detail_list: answer_detail_list
            });
            questionCurrentIndex++;
            questionIndex++;
        }
    },

    saveAnswer: function() {
        isValid = 0
        this.pushAnswer();
        if (isValid == 1) {return};
        var answer = {
            ID: json.result_id,
            exam_id: "513efa775558883fbc56ce3c",
            start_time: "11/3/2013",
            end_time: "11/3/2013",
            is_effective: "Y", //('Y':有效，'N':无效,(默认'Y'))
            email: json.email,
            answer_list: answer_list
        };
        console.log(JSON.stringify(answer));
        //        $.ajax({
        //            url: "http://172.16.134.57:30403/surveyPlatform/examination/saveAnswer",
        //            type: "POST",
        //            data: JSON.stringify(answer),
        //            success: function (response, option) {

        //            }
        //        });
    },

    _initAreaOptions: function(element) {

        if($(element).find('.province').size() !== 0) {
            $(areaData["province"]).each(function(index, element2) {
                $(element).find('.province').append($("#area-option-template").tmpl([element2]));
            });
        }

    },

    _submitButtonShow: function(index) {

        if (index + 1 === $(json.question_html).size()) {
            $("#save-answer").show();
            $(".btn_blue_3").hide();
        } else {
            $("#save-answer").hide();
        }

    }
});