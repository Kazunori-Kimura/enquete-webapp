// app.js
// require knockoutjs, jquery

// item view model
function ItemViewModel(params){
  var self = this;

  self.id = ko.observable(params.id);
  self.text = ko.observable(params.text);
  self.isOther = ko.observable(params.isOther);
  self.comment = ko.observable("");
  self.isChecked = ko.observable(false);
}

// question view model
function QuestionViewModel(params){
  var self = this;

  self.id = ko.observable(params.id);
  self.text = ko.observable(params.text);
  self.type = ko.observable(params.type);
  self.comment = ko.observable("");

  // 単一選択時、true
  self.isSingle = ko.computed(function(){
    return self.type() === "radio";
  });

  // 複数選択時、true
  self.isMulti = ko.computed(function(){
    return self.type() === "checkbox";
  });

  // テキスト入力
  self.isText = ko.computed(function(){
    return self.type() === "text";
  });

  // 選択肢
  self.items = ko.observableArray(
    ko.utils.arrayMap(params.items, function(item, i){
      item.id = i;
      return new ItemViewModel(item);
    })
  );

  // ラジオボタンの選択
  self.selectedItem = ko.observable("");

  self.addItem = function(){
    var count = self.items().length;
    self.items.push(new ItemViewModel({ id: count }));
  };
}

// enquete view model
function EnqueteViewModel(params){
  var self = this;

  self.id = ko.observable(params.id);
  self.title = ko.observable(params.title);
  self.description = ko.observable(params.description);
  self.questions = ko.observableArray(
    ko.utils.arrayMap(params.questions, function(question, i){
      question.id = i;
      return new QuestionViewModel(question);
    })
  );

  // 質問の追加
  self.addQuestion = function(){
    var count = self.questions().length;
    self.questions.push(new QuestionViewModel({ id: count }));
  };

  self.toJSON = function(){
    return ko.toJS(self);
  };
}

// application view model
function AppViewModel(){
  var self = this;

  self.enquetes = ko.observableArray([]);

  // アンケートデータの読み込み
  function loadEnquete(){
    // get enquete data
    $.getJSON('/enquete')
      .done(function(data){
        var items = [];
        $.each(data, function(i, item){
          // ローカル開発のため、id設定。
          // 実際にはMongoDBのidを使いたい
          item.id = i;
          items.push(new EnqueteViewModel(item));
        });

        self.enquetes.push.apply(self.enquetes, items);
      });
  }

  // initialize enquete data
  loadEnquete();
}

$(function(){
  // knockout binding
  var app = new AppViewModel();
  ko.applyBindings(app);
});
