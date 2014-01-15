// this is used to defined the survey model
var Survey = Spine.Model.sub();
Survey.configure('Survey', 'questions', 'activeQustIndex');
Survey.include({
    deleteQuestion: function (index) {
        if (this.activeQustIndex != index) {
            this.questions.splice(index, 1);
            this.trigger("questionChange", this.questions);
        }
        else {
            alert("You are editing this question now!");
        }
    },
    // insert or edit question
    updateQuestion: function (item) {
        //To do: update item
        if (this.activeQustIndex != null) {
            this.questions[this.activeQustIndex] = item;
        }
        else {
            this.questions.push(item);
        }
        this.trigger("questionChange", this.questions);
    },

    sortQuestion: function (oldIndex, newIndex) {
        this.questions.move(oldIndex, newIndex);
    },

    submitSurvey: function () {
        if (this.questions && this.questions.length > 0) {
            var surveyModel = {
                ID: "", //编号
                question_name: $("#question-name").val(), //问卷名
                public_pic: $("#upload-public-pic").val(), //问卷宣传图
                face_page: $("#upload-face-page").val(), //封面
                logo: $("#upload-logo").val(), //logo
                bottom_page: $("#upload-bottom-age").val(), //封底
                examination_type: $("#examination-type").val(), //"问卷类型",[0趣味1试用2商务]
                examination_detail: $("#examination-detail").val(), //问卷说明
                remark: $("#remark").val(), //备注
                question_html: this._getQuestionHtml(), //问题HTML
                topic_list: this._getTopicList()
            };
            console.log(JSON.stringify(surveyModel));
            $.ajax({
                url: "api/mysurvey",
                type: "POST",
                data: surveyModel,
                success: function(response, option) {
                    if(response == 0){
                        alert("保存成功！");
                    }else{
                        alert("保存失败！");
                    }
                }
            });
        }
    },

    _getQuestionHtml: function () {
        $("#survey-preview-list").children().each(function(index, element) {
            $(element).find("dd :last").remove();
        }).parent()
            .find(".province").html("<option>请选择</option>")
            .find(".city").html("<option>请选择</option>")
            .find(".district").html("<option>请选择</option>");
        return $("#survey-preview-list").html();
    },

    _getTopicList: function () {
        var topic_list = [];
        $(this.questions).each(function (index, element) {
            var topic = {
                question_no: index + 1, //试题编号
                question_context: element.description, //试题内容
                question_type: "", //"试题类型",[0单选1多选2矩阵3开放4地区]
                allow_bland: "N", //"是否必须回答标识",[Y/N]
                max_num: 0, //最多可选数量
                min_num: 0, //最少可选数量
                area_type: "", //"区域类型",[0省1市2区]
                options: null
            };

            if (element.maxSelection) {
                topic.max_num = element.maxSelection;
            }

            if (element.minSelection) {
                topic.min_num = element.minSelection;
            }

            switch (element.type) {
                case "single-select":
                    topic.question_type = "0";
                    break;
                case "multi-select":
                    topic.question_type = "1";
                    break;
                case "matrix":
                    //TODO:create matrix question
                    break;
                case "open":
                    topic.question_type = "3";
                    break;
                case "area":
                    topic.question_type = "4";
                default:
                    //TODO:others
                    break;
            }

            switch (element.area) {
                case "province":
                    topic.area_type = "0";
                    break;
                case "city":
                    topic.area_type = "1";
                    break;
                case "district":
                    topic.area_type = "2";
                    break;
                default:
                    //TODO:others
                    break;
            }

            var ops = [];
            $(element.options).each(function (i, e) {
                var op = {
                    item_num: e.index, //选项编号
                    item_type: e.type, //"选项类型",[0选项1开放]
                    item_value: e.content, //选项值
                    item_pic: "", //选项图片
                    unit: e.unit, //单位
                    validate_flag: "", //是否验证
                    validate_type: "", //验证类型
                    score: 0
                };
                ops.push(op);
            });
            topic.options = ops;
            topic_list.push(topic);
        });
        return topic_list;
    }
});
