App.translate = (function(Backbone, $, _) {
  var translations = {
    zh: {
      home: {
        question: "你今天找什么工作？",
        browse: "直接浏览招聘贴",
      },
      actions: {
        search: "搜索",
        yes: "是",
        ok: "OK啦",
        cancel: "取消",
      },
      ads: {
        found: "相关的帖子",
        none_found: "呃！没有相关的招聘贴。。。",
        source: "来自于",
      },
      delete: {
        are_you_sure: "你确定要删除下面的贴则么？",
        confirm: "好的！你的帖子已被删除。。。",
      },
      ad: {
        email: "邮箱",
        company: "公司",
        job_category: "行业",
        work_location: "工作地点",
        title: "标题",
        body: "内容",
        posted_at: "发表于"
      },
      form: {
        sqc: "请用德文回答：",
        sq_incorrect: "安全问题回答不对！",
        no_success: "存贴没成功。。。",
      },
      publish: {
        part_one: "恭喜你！你的招聘贴",
        part_two: "已发布完成。",
      },
      nav: {
        browse: "浏览招聘贴",
        new_ad: "创建新贴",
      },
      general: {
        contact: "联系方式",
      },
      job_categories: {
        hotel: "酒店",
        translation: "翻译",
        teaching: "教育",
        medical: "医疗",
        other: "其他",
      },
      paginator: {
        previous: "上一页",
        page_no: "#",
        next: "下一页",
      },
      errors: {
        authorization: "授权没通过",
        not_found: "找不到这个东东 :(",
        generic:  "呃，系统出错。。。不好意思！",
        cannot_be_empty: "不能为空",
        incorrect_format: "不是正确的的邮箱地址",
      },
      new: {
        confirm: {
          part_one: "谢谢！我们已把确认邮件发到",
          part_two: "。请尽快登录你的邮箱，按照里面的指示完成发布你的帖子",
        }
      }
    },

    de: {
      home: {
        question: "Was ist Ihr Job?",
        browse: "Oder direkt Durchsuchen",
      },
      actions: {
        search: "Suchen",
        yes: "Ja",
        ok: "OK",
        cancel: "Abbrechen",
      },
      ads: {
        found: "Resultate",
        none_found: "Leider haben wir keine entsprechenden Inserate finden können",
        source: "Quelle",
      },
      delete: {
        are_you_sure: "Sind Sie sicher, dass Sie dieses Inserat löschen möchten?",
        confirm: "Ihr Inserat wurde erfolgreich gelöscht.",
      },
      ad: {
        email: "Email",
        company: "Firma",
        job_category: "Branche",
        work_location: "Arbeitsort",
        title: "Titel",
        body: "Inhalt",
        posted_at: "Publizierungsdatum",
      },
      form: {
        sqc: "Bitte beantworten Sie:",
        sq_incorrect: "Sicherheitsfarge nicht korrekt beantwortet!",
        no_success: "Beim speichern ist leider ein Fehler aufgetreten.",
      },
      publish: {
        part_one: "Ihr Inserat",
        part_two: "wurde erfolgreich aufgeschaltet.",
      },
      nav: {
        browse: "Durchsuchen",
        new_ad: "Neues Inserate",
      },
      general: {
        contact: "Kontakt",
      },
      job_categories: {
        hotel: "Hotel",
        translation: "Übersetzung",
        teaching: "Unterricht",
        medical: "Medizin",
        other: "Andere",
      },
      paginator: {
        previous: "Zurück",
        page_no: "Nr.",
        next: "Nächste",
      },
      errors: {
        authorization: "Authorisierungsfehler!",
        not_found: "Konnte das leider nicht finden",
        generic:  "Ein Fehler ist aufgetreten. Wir bitten Sie um Entschuldigung!",
        cannot_be_empty: "kann nicht leer sein",
        incorrect_format: "ist keine korrekte Email-Adresse",
      },
      new: {
        confirm: {
          part_one: "Vielen Dank! Wir haben ein Bestätigungs-Email an ",
          part_two: " gesendet. Bitte überprüfen Sie Ihre Inbox.",
        }
      }
    },

    en: {
      home: {
        question: "What job can we get you today?",
        browse: "Or browse",
      },
      actions: {
        search: "Search",
        yes: "Yes",
        ok: "OK",
        cancel: "Cancel",
      },
      ads: {
        found: "ads matching your criteria",
        none_found: "Oops! No ads match your criteria",
        source: "Source",
      },
      delete: {
        are_you_sure: "Are you sure that you want to delete the below ad?",
        confirm: "Your ad was successfully deleted."
      },
      ad: {
        email: "Email",
        company: "Company",
        job_category: "Industry",
        work_location: "Work location",
        title: "Title",
        body: "Body",
        posted_at: "Date published",
      },
      form: {
        sqc: "Please answer in German:",
        sq_incorrect: "Answer to security question incorrect!",
        no_success: "Ad could not be saved. Sorry!",
      },
      publish: {
        part_one: "Your ad",
        part_two: "has been successfully published!",
      },
      nav: {
        browse: "Browse ads",
        new_ad: "New ad",
      },
      general: {
        contact: "Contact",
      },
      job_categories: {
        hotel: "Hotel",
        translation: "Translation",
        teaching: "Teaching",
        medical: "Medical",
        other: "Other",
      },
      paginator: {
        previous: "Previous",
        page_no: "#",
        next: "Next",
      },
      errors: {
        authorization: "Not authorized!",
        not_found: "Couldn't find this thingy :(",
        generic:  "An error occurred. Sorry!",
        cannot_be_empty: "cannot be empty",
        incorrect_format: "is not a correct email address",
      },
      new: {
        confirm: {
          part_one: "Thanks! We have sent a confirmation email to ",
          part_two: ". Please check your inbox.",
        }
      }
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
