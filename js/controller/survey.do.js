var answer_list = [];
var questionIndex = 0;
var SurveyDo = Spine.Controller.sub({
    elements: {
        "#page_cont": "page_cont"
    },

    events: {
        "click #save-answer": "saveAnswer",
        "change ul dl dd select": "areaSelectChange",
        "click #next-page": "pagingSurvey", //next page
        "click .page_next": "pageNext" //start survey
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
        var options = "";
        switch ($(e.target).next().attr('class')) {
            case "province":
                for (var i = 0; i < data_province.length; i++) {
                    var option = "<option value='" + data_province[i].code + "'>" + data_province[i].name + "</option>";
                    options += option;
                }
                break;
            case "city":
                for (var i = 0; i < data_city.length; i++) {
                    if (data_city[i].code.substring(0, 2) === e.target.value.substring(0, 2)) {
                        var option = "<option value='" + data_city[i].code + "'>" + data_city[i].name + "</option>";
                        options += option;
                    }
                }
                break;
            case "district":
                for (var i = 0; i < data_district.length; i++) {
                    if (data_district[i].code.substring(0, 4) === e.target.value.substring(0, 4)) {
                        var option = "<option value='" + data_district[i].code + "'>" + data_district[i].name + "</option>";
                        options += option;
                    }
                }
                break;
            default:
                break;
        }
        $(e.target.nextElementSibling).empty().append("<option>请选择</option>" + options);
    },

    pagingSurvey: function () {
        this.pushAnswer();
        var that = this;
        $("#page_cont").empty();
        $(json.question_html).each(function (index, element) {
            if (index >= that.currentIndex) {
                $("#page_cont").append("<dl>" + $(element).html() + "</dl>");
                if ($(element).find(".questionary_list_opera").size() !== 0) {
                    that.currentIndex = index + 1;
                    return false;
                };
            }
            if (index + 1 === $(json.question_html).size()) {
                $("#save-answer").show();
                $(".btn_blue_3").hide();
            } else {
                $("#save-answer").hide();
            }
        });
        $("#page_cont").find(".questionary_list_opera").remove();
    },

    pushAnswer: function() {
        var questionNum = $('#page_cont').find('dl').length;
        var questionCurrentIndex = 0;
        for(i=0;i<questionNum;i++) {
            var obj = $('#page_cont').find('dl')[questionCurrentIndex];
            var question_no = json.topic_list[questionIndex].question_no;
            var question_type = json.topic_list[questionIndex].question_type;
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
        this.pushAnswer();
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
    }
});