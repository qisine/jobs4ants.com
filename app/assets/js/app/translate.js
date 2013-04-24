App.translate = (function(Backbone, $, _) {
  var translations = {
    zh: {
      home: {
        question: "你今天找什么工作？"
      },
    },

    de: {
      home: {
        question: "Was ist Ihr Job?"
      },
    },

    en: {
      home: {
        question: "What job can we get you today?"
      },
    },
  }

  var getValue = function(keys, obj) {
    var key = keys.shift(), value, ret;
    if(!key) {
      ret = _.isObject(obj) ? null : obj;
      return ret;
    }
    value = obj[key];
    if(!value || value && !_.isObject(value)) return value;
    return getValue(keys, value);
  }

  var translate = function(key) {
    var keys = key.toLowerCase().split("."), locale = translations[App.currentLocale], subLevel;
    return getValue(keys, locale);
  }

  return translate;
})(Backbone, $, _);

TR = App.t = function(key) {
  return App.translate(key);
}
