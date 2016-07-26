/*! weixin - v0.1.0 - 2015-03-24
* Copyright (c) 2015 lovemoon@yeah.net; Licensed GPLv2 */
var __env__="";
var __imgHead__="";
if(location.href.indexOf("www")!=-1){
  __env__="pro";
  __imgHead__='http://www.static.duomeidai.com/brokerfront';
}else if(location.href.indexOf("test")!=-1){
  __env__="test";
  __imgHead__="http://test.static.duomeidai.com/brokerfront";
}else{
  __env__="dev";
  __imgHead__="http://dev.static.duomeidai.com/brokerfront";
}





// Initialize
var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'angular-growl', 'templates', 'brokerFrontModule']);

// bootstrap
angular.element(document).ready(function () {
	angular.bootstrap(document, ['app']);
});
// Avoid console errors in browsers that lack a console.
(function () {
  var method;
  var noop = function () {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
})();

// Make Array support indexOf and trim in ie7 and ie8
(function () {
  if (typeof Array.prototype.indexOf !== 'function') {
    Array.prototype.indexOf = function (obj) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] === obj) {
          return i;
        }
      }
      return -1;
    };
  }

  if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }
})();

// 识别浏览器版本
(function () {
  var version = (function () {
    var v = 3,
      div = document.createElement('div'),
      all = div.getElementsByTagName('i');

    do {
      div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
    }
    while (all[0]);
    return v > 4 ? v : false;
  }());

  if (version) {
    var times = 0;
    (function addClass() {
      var root = document.getElementsByTagName('html')[0];
      if (root) {
        root.className += ' ie ie' + version;
      }
      else if (times++ < 2) {
        setTimeout(addClass, 200);
      }
    }());
  }

})();

/**
 * Converts an object to x-www-form-urlencoded serialization.
 * @param {Object} obj
 * @return {String}
 */
var serialize = function (obj) {
  var query = '';
  var name, value, fullSubName, subName, subValue, innerObj, i;

  for (name in obj) {
    if (obj.hasOwnProperty(name)) {
      value = obj[name];

      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += serialize(innerObj) + '&';
        }
      }
      else if (value instanceof Object) {
        for (subName in value) {
          if (value.hasOwnProperty(subName)) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += serialize(innerObj) + '&';
          }
        }
      }
      else if (value !== undefined && value !== null) {
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
    }
  }

  return query.length ? query.substr(0, query.length - 1) : query;
};
// HTTP拦截器
app.config(['$httpProvider',
  function ($httpProvider) {
    // POST method use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    // Override transformRequest to serialize form data like jquery
    $httpProvider.defaults.transformRequest = [

      function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? serialize(data) : data;
      }
    ];

    // Add interceptor
    $httpProvider.interceptors.push(['$q', 'growl',
      function ($q, growl) {
        return {
          request: function (config) {
            // REST 风格路由重写
            var rules = config.url.match(/:(\w+)/g);
            if (rules !== null) {
              angular.forEach(rules, function (rule) {
                var name = rule.substring(1);
                if (config.params && config.params.hasOwnProperty(name)) {
                  config.url = config.url.replace(rule, config.params[name]);
                  delete config.params[name];
                }
                else if (config.data && config.data.hasOwnProperty(name)) {
                  config.url = config.url.replace(rule, config.data[name]);
                  delete config.data[name];
                }
              });
            }
            return $q.when(config);
          },
          response: function (response) {
            if (response.config.parsing !== false && response.status === 200 && angular.isObject(response.data)) {
              var res = response.data;
              // 兼容旧数据格式 {code:0, message: '', data: {...}} --> {code:200, data: {message: '', ...}}
              res.data = res.data || {};
              if (res.data.message || res.message) {
                res.data.message = res.data.message || res.message;
              }
              //未授权
              if(res.code==-801){
                _popAuth();
                return;
              }
              //未授权
              if(res.code==-802){
                window.location.href=res.url;
                return;
              }
              //活动过期
              if(res.data.action_base_info){
                if(res.data.action_base_info.actionStatus!=1||res.data.action_base_info.currentSystemTime>res.data.action_base_info.action_end_time){
                  window.location.href="/#/redenvelope/active_end";
                  return;
                }
              }
              return ["0", "200",0,200].indexOf(res.code) !== -1 ? res.data : $q.reject(res.data);
            }
            return $q.when(response);
          },
          requestError: function (rejection) {
            growl.addErrorMessage('请求异常，请刷新重试！', {
              ttl: -1
            });
            return $q.reject(rejection);
          },
          responseError: function (rejection) {
            growl.addErrorMessage('服务器异常，请刷新重试！', {
              ttl: -1
            });
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

// 配置ui-bootstrap
app.config(['paginationConfig',
  function (paginationConfig) {
    paginationConfig.directionLinks = false;
    paginationConfig.boundaryLinks = true;
    paginationConfig.maxSize = 10;
    paginationConfig.firstText = '«';
    paginationConfig.lastText = '»';
}]);

// 配置angular-growl
app.config(['growlProvider',
  function (growlProvider) {
    growlProvider.onlyUniqueMessages(true);
    growlProvider.globalTimeToLive(4000);
    growlProvider.globalEnableHtml(false); // ngSanitize
}]);

// 配置全局样式表 Home页特殊处理
app.run(['$rootScope',
  function ($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function (event, state) {
      $rootScope.isHome = state.name === 'home';
    });
  }
]);
app.directive('csFocus', ['$timeout',
  function ($timeout) {
    return {
      restrict: 'A',
      replace: false,
      link: function (scope, element) {
        var times = 0;
        (function focus() {
          if (element.is(':visible')) {
            element.focus();
          }
          else if (times++ < 1) {
            $timeout(focus, 200);
          }
        }());
      }
    };
  }
]);

/**
 * 动态切换Input的type为Number
 * placeholder text for an input type="number" does not work in mobile webkit
 */
app.directive('csNumber', function () {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element) {
      element.on('focus', function () {
        this.type = 'number';
      }).on('blur', function () {
        this.type = 'text';
      });
    }
  };
});

/**
 * 保持在底部效果
 */
app.directive('csBottom', ['$window', '$document',
  function ($window, $document) {
    return {
      restrict: 'A',
      replace: false,
      link: function (scope, element) {
        var listener = function () {
          element.toggleClass('keep-bottom', window.innerHeight >= $document.height());
        };

        var show = function (e) {
          // 可以调出虚拟键盘的空间类型
          var needInput = ['datetime', 'datetime-local', 'email', 'month', 'number', 'range', 'search', 'tel', 'time', 'url', 'week'].indexOf(e.target.type);
          if (element.hasClass('keep-bottom') && (e.target.tagName === 'TEXTAREA' || needInput)) {
            element.hide();
          }
        };

        var hide = function () {
          element.show();
        };

        $document.on('focus', 'input,textarea', show);
        $document.on('blur', 'input,textarea', hide);

        angular.element($window).on('resize', listener).resize();

        // 清理事件 防止内存泄露
        element.on('$destroy', function () {
          angular.element($window).off('resize', listener);
          $document.off('focus', 'input,textarea', show);
          $document.off('blur', 'input,textarea', hide);
        });
      }
    };
  }
]);

/**
 * The cs-Thumbnail directive
 * @author: nerv
 * @version: 0.1.2, 2014-01-09
 */
app.directive('csThumbnail', ['$window',
  function ($window) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function (item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function (file) {
        var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

    return {
      restrict: 'A',
      template: '<canvas />',
      link: function (scope, element, attrs) {
        if (!helper.support) {
          return;
        }

        var params = scope.$eval(attrs.csThumbnail);

        if (!helper.isFile(params.file) || !helper.isImage(params.file)) {
          return;
        }

        var canvas = element.find('canvas');
        var reader = new FileReader();

        reader.onload = function (e) {
          var img = new Image();
          img.onload = function () {
            var width = params.width || this.width / this.height * params.height;
            var height = params.height || this.height / this.width * params.width;
            canvas.attr({
              width: width,
              height: height
            });
            canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
          };
          img.src = e.target.result;
        };

        reader.readAsDataURL(params.file);
      }
    };
  }
]);

/* 页面模板 */
app.directive('csLayout', [

  function () {
    return {
      restrict: 'A',
      replace: false,
      transclude: true,
      templateUrl: 'common/templates/layout.partials.html',
      link: function (scope, element, attrs) {
        // Maybe todo...
      }
    };
  }
]);

/* 计算补白：实现宽高相等效果 即正方形 */
(function () {
  var height = 62; // 实际内容高度 如果调整界面此处需更新
  var padding = null;
  app.directive('csSquare', ['$window',

    function ($window) {
      return {
        restrict: 'A',
        replace: false,
        link: function (scope, element, attrs) {
          var setPadding = function () {
            if (padding === null) {
              padding = Math.max((element.width() - height) / 2, 0) + 'px 0';
            }
            element.css('padding', padding);
          };

          angular.element($window).on('resize', function () {
            padding = null;
            setPadding();
          }).triggerHandler('resize');
        }
      };
    }
  ]);
})();
// 为了分割数组以便二次使用ng-repeat
// 通常需要的场景是你需要每隔N个元素插入分组节点
// 如果你修改items内部元素的属性 angular会自动watch更新
// 如果动态增删items的元素，要删除items.$rows，以便重新计算

app.filter('group', function () {
  return function (items, cols) {
    if (!items) {
      return items;
    }
    // if items be modified, delete cache
    if (items.$rows) {
      var temp = [];
      for (var i = 0; i < items.$rows.length; i++) {
        temp = temp.concat(items.$rows[i]);
      }

      if (temp.length !== items.length) {
        delete items.$rows;
      }
      else {
        for (var j = 0; j < items.length; j++) {
          if (items[j] !== temp[j]) {
            delete items.$rows;
            break;
          }
        }
      }
    }

    // cache rows for angular dirty check
    if (!items.$rows) {
      var rows = [];
      for (var k = 0; k < items.length; k++) {
        if (k % cols === 0) {
          rows.push([]);
        }
        rows[rows.length - 1].push(items[k]);
      }
      items.$rows = rows;
    }

    return items.$rows;
  };
});

// 判断是否是空白对象
app.filter('empty', function () {
  return function (obj) {
    return !obj || angular.equals({}, obj) || angular.equals([], obj);
  };
});

// 取两个数最小的
app.filter('min', function () {
  return function (num, limit) {
    return Math.min(num, limit);
  };
});

// 取两个数最大的
app.filter('max', function () {
  return function (num, limit) {
    return Math.max(num, limit);
  };
});

// define module
var brokerFrontModule = angular.module('brokerFrontModule', ['ui.router', 'ui.bootstrap']);

// config router
brokerFrontModule.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/brokerfront/login/0/0");

    $stateProvider
      .state('brokerfront', {
        url: '/brokerfront',
        "abstract": true,
        template: "<div ui-view></div>"
      })
      .state('brokerfront.binvite', {
        url: "/binvite",
        controller: 'brokerInviteController',
        templateUrl: "modules/brokerfront/templates/broker.invite.html"
      })
      .state('brokerfront.binvitelist', {
        url: "/binvitelist",
        controller: 'brokerInviteListController',
        templateUrl: "modules/brokerfront/templates/broker.invite.list.html"
      })
      .state('brokerfront.binvestdetail', {
        url: "/binvestdetail/{id}/{name}/{mobile}",
        controller: 'brokerInvestDetailController',
        templateUrl: "modules/brokerfront/templates/broker.invest.detail.html"
      })
      .state('brokerfront.binvestlist', {
        url: "/binvestlist",
        controller: 'brokerInvestListController',
        templateUrl: "modules/brokerfront/templates/broker.invest.list.html"
      })
      .state('brokerfront.oinvitelist', {
        url: "/oinvitelist",
        controller: 'offlineInviteListController',
        templateUrl: "modules/brokerfront/templates/offline.invite.list.html"
      })
      .state('brokerfront.orecieve', {
        url: "/orecieve",
        controller: 'offlineRecieveController',
        templateUrl: "modules/brokerfront/templates/offline.recieve.html"
      })
      .state('brokerfront.login', {
        url: "/login/{type}/{id}",
        controller: 'publicLoginController',
        templateUrl: "modules/brokerfront/templates/public.login.html"
      })
      .state('brokerfront.index', {
        url: "/index/{role}",
        controller: 'publicIndexController',
        templateUrl: "modules/brokerfront/templates/public.index.html"
      })
      .state('brokerfront.account', {
        url: "/account/{role}",
        controller: 'publicAccountController',
        templateUrl: "modules/brokerfront/templates/public.account.html"
      })
      .state('brokerfront.billlist', {
        url: "/billlist",
        controller: 'publicBillListController',
        templateUrl: "modules/brokerfront/templates/public.bill.list.html"
      })
      .state('brokerfront.qrcode', {
        url: "/qrcode",
        controller: 'publicQrcodeController',
        templateUrl: "modules/brokerfront/templates/public.qrcode.html"
      })
      .state('brokerfront.withdraw', {
        url: "/withdraw",
        controller: 'publicWithdrawController',
        templateUrl: "modules/brokerfront/templates/public.withdraw.html"
      })
      .state('brokerfront.errors', {
        url: "/errors",
        controller: 'publicErrorsController',
        templateUrl: "modules/brokerfront/templates/public.errors.html"
      })
      .state('brokerfront.doc', {
        url: "/doc",
        controller: 'publicDocController',
        templateUrl: "modules/brokerfront/templates/public.doc.html"
      });
  }
]);
brokerFrontModule.controller('publicLoginController', ['$scope', '$state', '$stateParams', '$modal', 'brokerFrontService', 'cookieService', 'msgService', '$timeout',
  function($scope, $state, $stateParams, $modal, service, cookieService, message, $timeout) {
    cookieService.delCookie("userRole");
    var flag = false;
    $scope.imgHead = __imgHead__;
    $scope.goStep = function(step) {
        $scope.step = step;
      }
      //acode，bcode，-1
    $scope.codeType = $stateParams.type;
    if ($scope.codeType == -1) {
      $scope.step = -100;
    } else {
      $scope.step = 1;
    }
    //二维码id
    $scope.qrCodeId = $stateParams.id;
    //注册对象
    $scope.reg = {
      mobile: null,
      loginPwd: null,
      recieve_1: true,
      recieve_2: true
    };
    //实名认证对象
    $scope.real = {};
    //注册步骤
    // service.getInviteCode().then(function(res) {
    //   if (res.invitecode != -1) {
    //     $scope.reg.randkey = res.invitecode;
    //   }
    // });
    // $(".posita").css("left", ($(window).width() - 66) / 2 + "px");
    $scope.regtype = 0;
    $scope.recieve = true;
    $scope.imgUrl = "/p/a/imgcode";
    $scope.codeDisabled = false; //验证码发送状态
    $scope.msgCount = cookieService.getCookie('msgCount') || 0; //验证码发送次数
    $scope.desableTime = 0; //倒计时
    $scope.btnEnable = true;
    $scope.tabChange = function(type) {
      $scope.regtype = type;
      if (type == 0) {
        $scope.tabClass = "active";
        $scope.tabClass2 = "";
      } else {
        $scope.tabClass = "";
        $scope.tabClass2 = "active";
      }
    }
    $scope.accessRadioClick = function() {
      $scope.recieve = !$scope.recieve;
    }

    //图片验证码
    $scope.imgCodeRefresh = function() {
        $scope.imgUrl = "/p/a/imgcode?v=" + new Date() * 1;
      }
      //短信验证码
    $scope.msgCode = function(verifytype) {
        $scope.clickType = 1;
        var params = {};
        if (verifytype == 1) {
          if (!$scope.reg.mobile || $scope.reg.mobile.length != 11) {
            message.errShow("请输入正确的手机号");
            return;
          }
          params["phone"] = $scope.reg.mobile;
          params["verifyType"] = "register";
          if ($scope.msgCount > 2) {
            params["imgcode"] = $scope.reg.imgcode;
          }
        } else if (verifytype == 2) {
          if (!$scope.bind.mobile || $scope.bind.mobile.length != 11) {
            message.errShow("请输入正确的手机号");
            return;
          }
          params["phone"] = $scope.bind.mobile;
          params["verifyType"] = "login";
          if ($scope.msgCount > 2) {
            params["imgcode"] = $scope.bind.imgcode;
          }
        }
        params["type"] = 1;
        // service.checkPhone({
        //   "phone": $scope.reg.mobile
        // }).then(function(res) {
        //   if (res.code != -3) {
        service.msgCode(params).then(function(res) {

          if (res.code == 0) {
            var mcount = cookieService.getCookie('msgCount') || 0;
            mcount = mcount * 1;
            mcount++;
            cookieService.setCookie('msgCount', mcount, '600');
            $scope.msgCount = mcount;
            $scope.codeDisabled = true;
            $scope.desableTime = 180;
            var timeout = function() {
              if ($scope.desableTime > 0) {
                $scope.desableTime--
              } else {
                $timeout.cancel(timer);
                $scope.codeDisabled = false;
              }
              timer = $timeout(timeout, 1000);
            }
            timeout();
          } else {
            message.errShow(res.message);
            if (res.message.indexOf('图形验证码') != -1) {
              $scope.msgCount = 3;
            }
          }
        });
        //   } else {
        //     message.errShow(res.message);
        //   }
        // });
      }
      //语音验证码
    $scope.voiceCode = function(verifytype) {
        $scope.clickType = 2;
        var params = {};
        if (!$scope.reg.mobile || $scope.reg.mobile.length != 11) {
          message.errShow("请输入正确的手机号");
          return;
        }
        params["phone"] = $scope.reg.mobile;
        params["verifyType"] = "register";
        if ($scope.msgCount > 2) {
          params["imgcode"] = $scope.reg.imgcode;
        }
        params["type"] = 2;
        // service.checkPhone({
        //   "phone": $scope.reg.mobile
        // }).then(function(res) {
        //   if (res.code != -3) {
        service.msgCode(params).then(function(res) {
          if (res.code == 0) {
            var mcount = cookieService.getCookie('msgCount') || 0;
            mcount = mcount * 1;
            mcount++;
            cookieService.setCookie('msgCount', mcount, '600');
            $scope.codeDisabled = true;
            $scope.desableTime = 180;
            var timeout = function() {
              if ($scope.desableTime > 0) {
                $scope.desableTime--
              } else {
                $timeout.cancel(timer);
                $scope.codeDisabled = false;
              }
              timer = $timeout(timeout, 1000);
            }
            timeout();
          } else {
            message.errShow(res.message);
            if (res.message.indexOf('图形验证码') != -1) {
              $scope.msgCount = 3;
            }
          }
        });
        //   } else {
        //     message.errShow(res.message);
        //   }
        // });
      }
      //验证用户名密码
    $scope.login = function() {
        if (!$scope.reg.mobile || $scope.reg.mobile.length != 11) {
          message.errShow("请输入正确的手机号");
          return;
        }
        if (!$scope.reg.loginPwd || $scope.reg.loginPwd.length < 6 || $scope.reg.loginPwd.length > 20) {
          message.errShow("密码长度为6-20位");
          return;
        }
        var params = {};
        params["phone"] = $scope.reg.mobile;
        params["loginPwd"] = $scope.reg.loginPwd;
        params["codeType"] = $scope.codeType;
        params["qrCodeId"] = $scope.qrCodeId;
        service.login(params).then(function(res) {
          $scope.brokerUserMobile = res.brokerUserMobile;
          $scope.brokerUserName = res.brokerUserName;
          cookieService.setCookie("userRole", res.userRole);
          if (res.userRole == 1) { /*理财师*/
            if (res.userRegAuthStatus != 0) {
              $state.go("brokerfront.index", {
                role: res.userRole
              });
            } else {
              message.errShow("用户名或密码错误！");
            }
            return;
          } else if (res.userRole == 2) { /*商户*/
            if (res.userRegAuthStatus == 2) {
              $state.go("brokerfront.index", {
                role: res.userRole
              });
            } else if (res.userRegAuthStatus == 1) {
              $scope.goStep(4);
            } else {
              $scope.goStep(2);
            }
            return;
          } else { /*客户*/
            if (res.userRegAuthStatus == 2) {
              $scope.goStep(8);
            } else if (res.userRegAuthStatus == 1) {
              $scope.goStep(4);
            } else {
              $scope.goStep(2);
            }
            return;
          }
        }, function(res) {
          message.errShow(res.message);
        });
      }
      //新用户注册
    $scope.singIn = function() {
      if (flag) {
        return;
      }
      if (!$scope.reg.mobile || $scope.reg.mobile.length != 11) {
        message.errShow("请输入正确的手机号");
        return;
      }
      if (!$scope.reg.msgcode || $scope.reg.msgcode.length != 6) {
        message.errShow("请输入正确的手机验证码");
        return;
      }
      if (!$scope.reg.loginPwd || $scope.reg.loginPwd.length < 6 || $scope.reg.loginPwd.length > 20) {
        message.errShow("密码长度为6-20位");
        return;
      }
      if (!$scope.reg.tradePwd || $scope.reg.tradePwd.length < 6 || $scope.reg.tradePwd.length > 20) {
        message.errShow("交易密码长度为6-20位");
        return;
      }
      if ($scope.reg.loginPwd == $scope.reg.tradePwd) {
        message.errShow("交易密码和登录密码不能相同");
        return;
      }
      if (!$scope.reg.nickName || $scope.reg.nickName.length < 2 || $scope.reg.nickName.length > 20) {
        message.errShow("昵称长度为2-20");
        return;
      }
      // var myregex = new RegExp("^[\u4e00-\u9fa5_a-zA-Z0-9]","g");
      if (!/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test($scope.reg.nickName)) {
        message.errShow("昵称只能包含汉字,数字,字母以及_,不能以_开头");
        return;
      }
      if (!$scope.reg.nickName || $scope.reg.nickName.substr(0, 1) == "_") {
        message.errShow("昵称只能包含汉字,数字,字母以及_,不能以_开头");
        return;
      }
      if ($scope.reg.randkey && ($scope.reg.randkey + "").length != 8 && ($scope.reg.randkey + "").length != 11) {
        message.errShow("请输入合法推荐码");
        return;
      }
      var params = {};
      params["phone"] = $scope.reg.mobile;
      params["verifyCode"] = $scope.reg.msgcode;
      params["loginPwd"] = $scope.reg.loginPwd;
      params["tradePwd"] = $scope.reg.tradePwd;
      params["nickName"] = $scope.reg.nickName;
      params["randKey"] = $scope.reg.randkey;
      params["verifyType"] = "register";
      params["codeType"] = $scope.codeType;
      params["qrCodeId"] = $scope.qrCodeId;
      flag = true;
      service.singIn(params).then(function(res) {
        flag = false;
        // var url = "http://friend.duomeidai.com/p/a/reserve/refreshstatus?t_userId=" + res.uid;
        // switch (location.host) {
        //   case "dev.red.duomeidai.com":
        //     url = "http://dev.broker.web.duomeidai.com/p/a/reserve/refreshstatus?t_userId=" + res.uid;
        //     break;
        //   case "test.red.duomeidai.com":
        //     url = "http://test.broker.web.duomeidai.com/p/a/reserve/refreshstatus?t_userId=" + res.uid;
        //     break;
        //   case "red.duomeidai.com":
        //     url = "http://friend.duomeidai.com/p/a/reserve/refreshstatus?t_userId=" + res.uid;
        //     break;
        //   default:
        //     url = "http://friend.duomeidai.com/p/a/reserve/refreshstatus?t_userId=" + res.uid;
        // }
        // $.ajax({
        //   type: 'GET',
        //   url: url,
        //   async: false,
        //   dataType: "jsonp",
        //   jsonp: "callback",
        //   jsonpCallback: "callback",
        //   success: function(data) {}
        // });
        if (res) {
          $scope.goStep(4);
        } else {
          message.errShow(res.message);
          if (res.message.indexOf('图形验证码') != -1) {
            $scope.msgCount = 3;
          }
        }
      }, function(res) {
        flag = false;
        console.log(res);
        message.errShow(res.message);
        if (res.message.indexOf('图形验证码') != -1) {
          $scope.msgCount = 3;
        }
      });
    };
    //延迟2秒执行 避免连点
    $scope.checkRealName = function() {
        $scope.btnEnable = false;
        setTimeout($scope.checkRealName1, 2000);

      }
      //实名认证
    $scope.checkRealName1 = function() {

      if (!$scope.real.realname || $scope.real.realname.length < 2) {
        message.errShow("请输入正确的姓名");
        $scope.btnEnable = true;
        return;
      }
      if (!$scope.real.idcard || $scope.real.idcard.length != 18) {
        message.errShow("请输入正确的身份证号码");
        $scope.btnEnable = true;
        return;
      }
      var params = {};
      params["realName"] = $scope.real.realname;
      params["idNo"] = $scope.real.idcard;
      service.doRealNameAuth(params).then(function(res) {
        if (res) {
          if ($scope.codeType == 'acode') {
            $scope.goStep(5);
          } else {
            $scope.goStep(8);
          }
        }
      }, function(res) {
        if (res.authCount == null) {
          message.errShow(res.message);
          $scope.btnEnable = true;
          return;
        }
        if (res.authCount >= 2) {
          $scope.goStep(7);
        } else {
          $scope.goStep(6);
        }
      })

    }

    //免责声明弹出窗体 2015-03-17
    $scope.declareShow = function(msg) {
      $modal.open({
        templateUrl: 'modules/brokerfront/templates/public.declare.html',
        controller: ['$scope', function(scop) {
          scop.title = msg;
          scop.confirm = function() {
            scop.$close();
          }
        }]
      });
    }

  }
]);
/*多美理财师邀请*/
brokerFrontModule.controller('brokerInviteController', ['$scope', '$state', 'brokerFrontService', 'msgService',
  function($scope, $state, service, message) {
    $scope.imgHead = __imgHead__;
    $scope.name = "";
    $scope.mobile = "";
    $scope.invite = function() {
      var params = {};
      params["username"] = $scope.name;
      params["mobile"] = $scope.mobile;
      if ($scope.mobile.length != 11) {
        message.errShow('请输入正确的手机号！');
        return;
      }
      if ($scope.name.length ==0) {
        message.errShow('请输入客户姓名！');
        return;
      }
      service.invite(params).then(function(res) {
        message.errShow(res.message);
      }, function(rej) {
        message.errShow(rej.message);
      })
    }
  }
]);
/*多美理财师邀请列表*/
brokerFrontModule.controller('brokerInviteListController', ['$scope', '$state', 'brokerFrontService', 'timeService', 'msgService',
  function($scope, $state, service, timeService, message) {
    $scope.imgHead = __imgHead__;
    $scope.type = "";
    $scope.more = true;
    $scope.entity = {};
    $scope.show = false;
    $scope.windowShow = function(ishow) {
      $scope.show = ishow;
      if (ishow) {
        $scope.entity.InviteTimeBegin = null;
        $scope.entity.InviteTimeEnd = null;
        $scope.entity.mobile = null;
      }
    }
    $scope.invitelist = function(isBtn) {
      if ($scope.entity.mobile != null && isBtn) {
        if (!$scope.entity.mobile || $scope.entity.mobile.length != 11) {
          message.errShow("请输入正确的手机号");
          $scope.show = false;
          return;
        }
      }
      var params = {};
      page = 1;
      params["page"] = 1;
      params["size"] = 10;
      params["status"] = $scope.entity.type;
      params["mobile"] = $scope.entity.mobile;
      params["reserveAtBegin"] = ($scope.entity.InviteTimeBegin) ? timeService.getTime($scope.entity.InviteTimeBegin) : null;
      params["reserveAtEnd"] = ($scope.entity.InviteTimeEnd) ? timeService.getEndTime($scope.entity.InviteTimeEnd) : null;
      service.reserveList(params).then(function(res) {
        $scope.list = res.list;
        if (res.total / res.size < page) {
          $scope.more = false;
        } else {
          $scope.more = true;
        }
      });
      $scope.show = false;
    };
    $scope.displayMore = function() {
      var params = {};
      page++;
      params["page"] = page;
      params["size"] = 10;
      params["status"] = $scope.entity.type;
      params["mobile"] = $scope.entity.mobile;
      params["reserveAtBegin"] = ($scope.entity.InviteTimeBegin) ? timeService.getTime($scope.entity.InviteTimeBegin) : null;
      params["reserveAtEnd"] = ($scope.entity.InviteTimeEnd) ? timeService.getEndTime($scope.entity.InviteTimeEnd) : null;
      service.reserveList(params).then(function(res) {
        $scope.list = $scope.list.concat(res.list);
        if (res.total / res.size < page) {
          $scope.more = false;
        }
      });
    }
    $scope.invitelist(false);
  }

]);
/*地推商户邀请列表*/
brokerFrontModule.controller('offlineInviteListController', ['$scope', '$state', 'brokerFrontService', 'timeService',
  function($scope, $state, service, timeService) {
    $scope.imgHead = __imgHead__;
    $scope.more = true;
    $scope.entity = {};
    $scope.show = false;
    $scope.windowShow = function(ishow) {
      $scope.show = ishow;
      if (ishow) {
        $scope.entity.reg_from = null;
        $scope.entity.reg_end = null;
        $scope.entity.auth_from = null;
        $scope.entity.auth_end = null;
      }

    }

    var page = 1;
    $scope.query = function() {
      var params = {};
      page = 1;
      params["page"] = 1;
      params["size"] = 10;
      params["orderby"] = "oinvitelist";
      params["reg_from"] = ($scope.entity.reg_from) ? $scope.entity.reg_from + " 00:00:00" : null;
      params["reg_end"] = ($scope.entity.reg_end) ? $scope.entity.reg_end + " 23:59:59" : null;
      params["auth_from"] = ($scope.entity.auth_from) ? $scope.entity.auth_from + " 00:00:00" : null;
      params["auth_end"] = ($scope.entity.auth_end) ? $scope.entity.auth_end + " 23:59:59" : null;
      service.oinviteList(params).then(function(res) {
        $scope.list = res.list;
        $scope.baseInfo = res;
        if (res.total / res.size < page) {
          $scope.more = false;
        } else {
          $scope.more = true;
        }
      });
      $scope.show = false;
    };
    $scope.queryMore = function() {
      var params = {};
      page++;
      params["page"] = page;
      params["size"] = 10;
      params["orderby"] = "oinvitelist";
      params["reg_from"] = ($scope.entity.reg_from) ? $scope.entity.reg_from + " 00:00:00" : null;
      params["reg_end"] = ($scope.entity.reg_end) ? $scope.entity.reg_end + " 23:59:59" : null;
      params["auth_from"] = ($scope.entity.auth_from) ? $scope.entity.auth_from + " 00:00:00" : null;
      params["auth_end"] = ($scope.entity.auth_end) ? $scope.entity.auth_end + " 23:59:59" : null;
      service.oinviteList(params).then(function(res) {
        $scope.list = $scope.list.concat(res.list);
        if (res.total / res.size < page) {
          $scope.more = false;
        }
      });
    }
    $scope.query();
  }
]);
/*多美理财师投资列表*/
brokerFrontModule.controller('brokerInvestListController', ['$scope', '$state', 'brokerFrontService', 'timeService',
  function($scope, $state, service, timeService) {
    $scope.imgHead = __imgHead__;
    $scope.mobile = "";
    $scope.InvestTimeBegin = "";
    $scope.InvestTimeEnd = "";
    $scope.page = 1;
    $scope.entity = {};
    $scope.show = false;
    $scope.windowShow = function(ishow) {
      $scope.show = ishow;
    }

    var size = 10;
    var flag = false;
    $scope.investList = function() {
      if (flag) {
        return;
      }
      var params = {};
      $scope.page = 1
      $scope.more = true;

      params["page"] = $scope.page;
      params["size"] = size;
      params["mobile"] = $scope.entity.mobile;
      params["InvestTimeBegin"] = ($scope.entity.InvestTimeBegin) ? timeService.getTime($scope.entity.InvestTimeBegin, 'string') : null;
      params["InvestTimeEnd"] = ($scope.entity.InvestTimeEnd) ? timeService.getEndTime($scope.entity.InvestTimeEnd, 'string') : null;
      params["InvestAmountSumBegin"] = $scope.entity.InvestAmountSumBegin;
      params["InvestAmountSumEnd"] = $scope.entity.InvestAmountSumEnd;
      flag = true;
      service.investList(params).then(function(res) {
        flag = false;
        $scope.list = res.list;
        $scope.baseInfo = res;

        if (res.total / res.size < $scope.page) {
          $scope.more = false;
        } else {
          $scope.more = true;
        }

        $scope.total = res.total / res.size;
      }, function(rej) {
        flag = false;
      });
      $scope.show = false;
    }
    $scope.displayMore = function() {
      if (flag) {
        return;
      }
      var params = {};
      $scope.page++;
      params["page"] = $scope.page;
      params["size"] = size;
      params["mobile"] = $scope.entity.mobile;
      params["InvestTimeBegin"] = ($scope.entity.InvestTimeBegin) ? timeService.getTime($scope.entity.InvestTimeBegin, 'string') : null;
      params["InvestTimeEnd"] = ($scope.entity.InvestTimeEnd) ? timeService.getEndTime($scope.entity.InvestTimeEnd, 'string') : null;
      params["InvestAmountSumBegin"] = $scope.entity.InvestAmountSumBegin;
      params["InvestAmountSumEnd"] = $scope.entity.InvestAmountSumEnd;

      flag = true;
      $scope.more = true;
      service.investList(params).then(function(res) {
        flag = false;
        $scope.list = $scope.list.concat(res.list);

        if (res.total / res.size < $scope.page) {
          $scope.more = false;
        }

        $scope.total = res.total / res.size;
      }, function(rej) {
        flag = false;
      });
    }

    $scope.choose = function(item) {
      $state.go("brokerfront.binvestdetail", {
        "id": item.userId,
        "name": item.realName,
        "mobile": item.cellPhone
      });
    }
    $scope.investList();
  }
]);
/*多美理财师投资详情*/
brokerFrontModule.controller('brokerInvestDetailController', ['$scope', '$state', '$stateParams', 'brokerFrontService', 'timeService',
  function($scope, $state, $stateParams, service, timeService) {
    $scope.imgHead = __imgHead__;
    $scope.mobile = $stateParams.mobile;
    $scope.name = $stateParams.name;
    $scope.id = $stateParams.id;
    $scope.InvestTimeBegin = "";
    $scope.InvestTimeEnd = "";
    $scope.page = 1;
    $scope.entity = {};
    $scope.show = false;
    $scope.windowShow = function(ishow) {
      $scope.show = ishow;
    }

    var size = 10;
    var flag = false;
    $scope.detailList = function() {
      var params = {};
      $scope.page = 1;
      $scope.more = true;
      params["page"] = $scope.page;
      params["size"] = size;
      params["InvestTimeBegin"] = ($scope.entity.InvestTimeBegin) ? $scope.entity.InvestTimeBegin + " 00:00:00" : null;
      params["InvestTimeEnd"] = ($scope.entity.InvestTimeEnd) ? $scope.entity.InvestTimeEnd + " 23:59:59" : null;
      params["InvestAmountBegin"] = $scope.entity.InvestAmountSumBegin;
      params["InvestAmountEnd"] = $scope.entity.InvestAmountSumEnd;
      params["deadline"] = $scope.entity.limit;
      params["tuserId"] = $scope.id;
      if (flag) {
        return;
      }
      flag = true;
      service.detailList(params).then(function(res) {
        flag = false;
        $scope.list = res.list;
        $scope.baseInfo = res;
        if (res.total / res.size < $scope.page) {
          $scope.more = false;
        } else {
          $scope.more = true;
        }
        $scope.total = res.total / res.size;
      });
      $scope.show = false;
    }
    $scope.displayMore = function() {
      var params = {};
      $scope.page++;
      params["page"] = $scope.page;
      params["size"] = size;
      params["InvestTimeBegin"] = ($scope.entity.InvestTimeBegin) ? $scope.entity.InvestTimeBegin + " 00:00:00" : null;
      params["InvestTimeEnd"] = ($scope.entity.InvestTimeEnd) ? $scope.entity.InvestTimeEnd + " 23:59:59" : null;
      params["InvestAmountBegin"] = $scope.entity.InvestAmountSumBegin;
      params["InvestAmountEnd"] = $scope.entity.InvestAmountSumEnd;
      params["deadline"] = $scope.entity.limit;
      params["tuserId"] = $scope.id;
      if (flag) {
        return;
      }
      flag = true;
      $scope.more = true;
      service.detailList(params).then(function(res) {
        flag = false;
        $scope.list = $scope.list.concat(res.list);
        if (res.total / res.size < $scope.page) {
          $scope.more = false;
        }
        $scope.total = res.total / res.size;
      });
    }
    $scope.detailList();
  }
]);

/*地推商户领取提成*/
brokerFrontModule.controller('offlineRecieveController', ['$scope', '$state', 'brokerFrontService', 'msgService',
  function($scope, $state, service, message) {
    var flag = false;
    $scope.imgHead = __imgHead__;
    $scope.more = true;
    $scope.show = false;
    $scope.seletAllText = "全选";
    $scope.windowShow = function(ishow) {
      $scope.show = ishow;
    }
    $scope.entity = {
      status: 12
    };
    var page = 1;
    $scope.query = function() {
      var params = {};
      page = 1;
      params["page"] = 1;
      params["size"] = 10;
      params["orderby"] = "orecieve";
      params["reg_from"] = ($scope.entity.reg_from) ? $scope.entity.reg_from + " 00:00:00" : null;
      params["reg_end"] = ($scope.entity.reg_end) ? $scope.entity.reg_end + " 23:59:59" : null;
      params["auth_from"] = ($scope.entity.auth_from) ? $scope.entity.auth_from + " 00:00:00" : null;
      params["auth_end"] = ($scope.entity.auth_end) ? $scope.entity.auth_end + " 23:59:59" : null;
      params["commission_status"] = $scope.entity.status;
      params["username"] = $scope.entity.nick;
      service.oinviteList(params).then(function(res) {
        $scope.list = res.list;
        $scope.baseInfo = res;
        if (res.total / res.size < page) {
          $scope.more = false;
        } else {
          $scope.more = true;
        }
      });
      $scope.show = false;
    };
    $scope.queryMore = function() {
      var params = {};
      page++;
      params["page"] = page;
      params["size"] = 10;
      params["orderby"] = "orecieve";
      params["reg_from"] = ($scope.entity.reg_from) ? $scope.entity.reg_from + " 00:00:00" : null;
      params["reg_end"] = ($scope.entity.reg_end) ? $scope.entity.reg_end + " 23:59:59" : null;
      params["auth_from"] = ($scope.entity.auth_from) ? $scope.entity.auth_from + " 00:00:00" : null;
      params["auth_end"] = ($scope.entity.auth_end) ? $scope.entity.auth_end + " 23:59:59" : null;
      params["commission_status"] = $scope.entity.status;
      params["username"] = $scope.entity.nick;
      service.oinviteList(params).then(function(res) {
        $scope.list = $scope.list.concat(res.list);
        if (res.total / res.size < page) {
          $scope.more = false;
        }
      });
    }
    $scope.query();

    $scope.select = function(index, item) {
      if (item.commissionStatus == 1) {
        $scope.list[index].selected = !$scope.list[index].selected;
      }
      if ($scope.list[index].selected) {
        $scope.seletAllText = "取消";
        return;
      } else {
        for (item in $scope.list) {
          if ($scope.list[item].selected) {
            $scope.seletAllText = "取消";
            return;
          }
        }
      }
      $scope.seletAllText = "全选";
    }
    $scope.seletAll = function() {
      var select = true;
      for (item in $scope.list) {
        if ($scope.list[item].selected) {
          select = false;
          break;
        }
      }
      for (item in $scope.list) {
        if ($scope.list[item].commissionStatus == 1) {
          $scope.list[item].selected = select;
        }
      }
      if (select) {
        $scope.seletAllText = "取消";
      } else {
        $scope.seletAllText = "全选";
      }
    }
    $scope.recieve = function(index, id) {
      if (flag) {
        return;
      }
      var ids = ""
      if (id) {
        ids = id;
      } else {
        for (item in $scope.list) {
          if ($scope.list[item].selected) {
            ids += $scope.list[item].id + ",";
          }
        }
        ids = ids.substr(0, ids.length - 1);
      }
      if (!ids) {
        return;
      }
      flag = true;
      service.getReceive({
        "pIds": ids
      }).then(function(res) {
        flag = false;
        if (index || index == 0) {
          $scope.list[index].commissionStatus = 2;
          $scope.list[index].selected = false;
        } else {
          for (item in $scope.list) {
            if ($scope.list[item].selected) {
              $scope.list[item].commissionStatus = 2;
              $scope.list[item].selected = false;
            }
          }
        }
        message.msgShow("#mainContainer", res.message);
      });
    }
  }
]);

/*首页*/
brokerFrontModule.controller('publicIndexController', ['$scope', '$state', '$stateParams', 'brokerFrontService', 'cookieService',
  function($scope, $state, $stateParams, service, cookieService) {
    $scope.imgHead = __imgHead__;
    $scope.userRole = $stateParams.role;
    if ($scope.userRole == 0) {
      $scope.userRole = cookieService.getCookie("userRole");
    }
  }
]);
/*我的账户*/
brokerFrontModule.controller('publicAccountController', ['$scope', '$state', '$stateParams', 'brokerFrontService', 'cookieService', 'msgService',
  function($scope, $state, $stateParams, service, cookieService, message) {
    $scope.imgHead = __imgHead__;
    $scope.userRole = $stateParams.role;
    if ($scope.userRole == 0) {
      $scope.userRole = cookieService.getCookie("userRole");
    } else {
      cookieService.setCookie("userRole", $stateParams.role);
    }
    service.myAccount().then(function(res) {
      $scope.entity = res;
    });
    $scope.tipsShow = function() {
      message.msgShow("#accountContainer", "提成账户的金额可用于直接提现或投资。");
    }
  }
]);
/*账单*/
brokerFrontModule.controller('publicBillListController', ['$scope', '$state', 'brokerFrontService',
  function($scope, $state, service) {
    $scope.imgHead = __imgHead__;
    var size = 10
    $scope.type = 1;
    $scope.page = 1;
    $scope.operateType = null;
    $scope.show = false;
    $scope.windowShow = function(ishow) {
      $scope.show = !$scope.show;
    }
    var flag = false;
    $scope.query = function(type) {
      if (flag) {
        return;
      }
      var params = {}
      if (type) {
        $scope.operateType = type;
      }
      $scope.page = 1;
      params["page"] = $scope.page;
      params["size"] = size;
      params["operateType"] = $scope.operateType;
      flag = true;
      service.billList(params).then(function(res) {
        flag = false;
        $scope.list = res.list;
        $scope.total = res.total / res.size;
        if (res.total / res.size <= $scope.page) {
          $scope.more = false;
        } else {
          $scope.more = true;
        }
      });
      $scope.show = false;
    }

    $scope.queryMore = function() {
      if (flag) {
        return;
      }
      var params = {}
      $scope.page++;
      params["page"] = $scope.page;
      params["size"] = size;
      params["operateType"] = $scope.operateType;
      flag = true;
      service.billList(params).then(function(res) {
        flag = false;
        $scope.list = $scope.list.concat(res.list);
        $scope.total = res.total / res.size;
        if (res.total / res.size <= $scope.page) {
          $scope.more = false;
        } else {
          $scope.more = true;
        }
      });
    }
    $scope.query();
  }
]);
/*二维码*/
brokerFrontModule.controller('publicQrcodeController', ['$scope', '$state', 'brokerFrontService',
  function($scope, $state, service) {
    $scope.imgHead = __imgHead__;
    service.myQrcode().then(function(res) {
      $scope.code = res.brokerId;
      $scope.url = res.inviteUrl;
      $scope.inviteQrCode = res.inviteQrCode;
      if (res.invitecode) {
        $("#qrcode").qrcode({
          width: 140,
          height: 140,
          text: res.inviteQrCode
        });
      }
    });
  }
]);
/*提现*/
brokerFrontModule.controller('publicWithdrawController', ['$scope', '$state', 'brokerFrontService', 'msgService',
  function($scope, $state, service, message) {
    service.myAccount().then(function(res) {
      $scope.entity = res;
      console.log($scope.entity);
      $scope.params.bankId = res.bankId;
    });
    $scope.step = 1;
    $scope.params = {
      money: ''
    };
    $scope.imgHead = __imgHead__;

    $scope.btnEnable = true;
    var flag = false;

    $scope.widthDraw = function() {
      $scope.btnEnable = false;
      setTimeout($scope.widthDraw1, 2000);

    }
    $scope.widthDraw1 = function() {

      if (flag) {
        $scope.btnEnable = true;
        return;
      }
      var params = $scope.params;
      if (!$scope.params.money) {
        message.errShow("请输入提现金额！");
        $scope.btnEnable = true;
        return;
      }
      if ($scope.params.money > $scope.entity.usableSum) {
        message.errShow("提现金额不能大于可提金额！");
        $scope.btnEnable = true;
        return;
      }
      if (!$scope.params.dealpwd) {
        message.errShow("请输入交易密码！");
        $scope.btnEnable = true;
        return;
      }
      if ($scope.params.dealpwd.length < 6 || $scope.params.dealpwd.length > 20) {
        message.errShow("交易密码为6-20位！");
        $scope.btnEnable = true;
        return;
      }
      flag = true;

      service.doWithDraw(params).then(function(res) {
        if (res) {
          message.errShow(res.message);
          $scope.btnEnable = true;
        }
        flag = false;
        //$scope.entity.usableSum=$scope.entity.usableSum-$scope.params.money-3;
        $scope.step = 2;
      }, function(res) {
        flag = false;
        message.errShow(res.message);
        $scope.btnEnable = true;
      })
      $scope.btnEnable = true;
    }
    $scope.tipsShow = function() {
      message.msgShow("#accountContainer", "提成账户的金额可用于直接提现或投资。");
      $scope.btnEnable = true;
    }

  }
]);
/*协议*/
brokerFrontModule.controller('publicDocController', ['$scope', '$state', 'brokerFrontService',
  function($scope, $state, service) {

  }
]);

brokerFrontModule.filter('timefilter', function () {
  return function (time) {
  	if(time*1<10){
  		time="0"+time;
  	}
    return time;
  };
});
brokerFrontModule.filter('moneyfilter', function () {
  return function (money) {
    return (money*1).toFixed(2);
  };
});
brokerFrontModule.filter('timeLine', function () {
  return function (time) {
  	var dt=new Date()*1;
  	var timeDif=(dt-time)/1000;
  	if(timeDif<60){
  		return "刚刚";
  	}
  	if(timeDif<3600){
  		return (timeDif/60).toFixed(0)+"分钟前";
  	}
  	if(timeDif<3600*24){
  		return (timeDif/3600).toFixed(0)+"小时前";
  	}
	return (timeDif/(3600*24)).toFixed(0)+"天前";
    //return (money*1).toFixed(2);
  };
});

brokerFrontModule.filter('invitefilter', function () {
  return function (type) {
    if(type==1){
      return "预约";
    }
    if(type==2){
      return "成功";
    }
    if(type==3){
      return "失败";
    }
  };
});
brokerFrontModule.filter('mobilefilter', function () {
  return function (mobile) {
    mobile=mobile+"";
    return mobile.substr(0,3)+"****"+mobile.substr(7,11);
  };
});
brokerFrontModule.filter('bankfilter', function () {
  return function (bank) {
    return "************"+bank.substr(bank.length-4,4);
  };
});

brokerFrontModule.filter('operatefilter', function () {
  return function (money,type) {
    if(type!=1003){
      return "-"+(money.toFixed(2));
    }else{
      return "+"+(money.toFixed(2));
    }
  };
});








brokerFrontModule.factory('brokerFrontService', ['$http',
  function($http) {
    //var path="http://peon.cn";
    var path = "";
    return {
      login: function(params) {
        return $http({
          url: path + '/p/a/broker/login',
          method: 'post',
          data: params
        });
      },
      getSta: function() {
        return $http({
          url: '/p/u/a/broker/statistics',
          method: 'get'
        });
      },
      addReserve: function(params) {
        return $http({
          url: '/p/u/a/broker/reserve/add',
          method: 'post',
          data: params
        });
      },
      investList: function(params) {
        return $http({
          url: '/p/u/a/broker/invest/list',
          method: 'get',
          params: params
        });
      },
      detailList: function(params) {
        return $http({
          url: '/p/u/a/broker/invest/detail',
          method: 'get',
          params: params
        });
      },
      staList: function(params) {
        return $http({
          url: '/p/u/a/broker/invest/statisticslist',
          method: 'post',
          data: params
        });
      },
      reserveList: function(params) {
        return $http({
          url: '/p/u/a/broker/reserve/list',
          method: 'get',
          params: params
        });
      },
      invite: function(params) {
        return $http({
          url: '/p/u/a/broker/reserve',
          method: 'post',
          data: params
        });
      },
      userInfo: function(params) {
        return $http({
          url: '/p/u/a/broker/userbing',
          method: 'get',
          params: params
        });
      },
      myQrcode: function() {
        return $http({
          url: '/p/u/a/broker/info',
          method: 'get'
        });
      },
      myAccount: function() {
        return $http({
          url: '/p/u/a/promotion/acount',
          method: 'get'
        });
      },
      oinviteList: function(params) {
        return $http({
          url: '/p/u/a/promotion/invitelist',
          method: 'get',
          params: params
        });
      },
      receiveList: function(params) {
        return $http({
          url: '/p/u/a/promotion/receivelist',
          method: 'get',
          params: params
        });
      },
      getReceive: function(params) {
        return $http({
          url: '/p/u/a/promotion/receive',
          method: 'post',
          data: params
        });
      },
      billList: function(params) {
        return $http({
          url: '/p/u/a/promotion/myfundrecord',
          method: 'get',
          params: params
        });
      },
      widthDraw: function(params) {
        return $http({
          url: '/p/u/a/promotion/withdraw',
          method: 'post',
          data: params
        });
      },
      msgCode: function(params) { /*验证码*/
        return $http({
          url: '/p/a/verifycode',
          method: 'get',
          params: params
        });
      },
      checkPhone: function(params) { /*检测手机是否被注册*/
        return $http({
          url: '/p/a/check/phone',
          method: 'post',
          data: params
        });
      },
      doRealNameAuth: function(params) { /*实名认证*/
        return $http({
          url: '/p/u/a/broker/auth',
          method: 'post',
          data: params
        });
      },

      doWithDraw: function(params) { /*提现*/
        return $http({
          url: '/p/u/a/broker/addWithdraw',
          method: 'post',
          data: params
        });
      },
      singIn: function(params) { /*注册*/
        return $http({
          url: '/p/a/broker/reg',
          method: 'post',
          data: params
        });
      },
      bindUser: function(params) { /*已有账号绑定*/
        return $http({
          url: '/p/login',
          method: 'post',
          data: params
        });
      }
    };
  }
]);



brokerFrontModule.factory('msgService', ['$timeout', function($timeout) {
  return {
    msgShow: function(selector, msg) {
      var container = "<div class='pub_window tips_t' style='display:none;top:25%;'></div>";
      var JObj = $(container);
      $(selector).append(JObj);
      JObj.html(msg);
      JObj.css('display', 'block');
      JObj.addClass('BounceIn');
      $timeout(function() {
        JObj.removeClass('BounceIn');
        JObj.addClass('BounceOut');
        $timeout(function() {
          JObj.removeClass('BounceOut');
          JObj.css('display', 'none');
          $(selector).remove(JObj);
        }, 1000);
      }, 3000);
    },
    errShow: function(msg) {
      $("#errBoxText").html(msg);
      $("#errBox").css("display", "block");
      $timeout(function() {
        $("#errBox").css("display", "none");
      }, 1500)
    },
    errMsgByCode: function(code) {
      var mshow = function(msg) {
        $("#errBoxText").html(msg);
        $("#errBox").css("display", "block");
        $timeout(function() {
          $("#errBox").css("display", "none");
        }, 1500)
      };

      var msgKeyValue = {
        "-1": "注册失败",
        "-5": "参数错误",
        "-13": "手机号或密码格式错误",
        "-3": "手机号已存在",
        "-4": "昵称已存在"
      };
      msgShow(msgKeyValue[code]);
      switch (code) {
        case -1:
          mshow("用户未登录");
          break;
        case -21:
          mshow("红包已失效");
          break;
        case -22:
          mshow("活动暂停");
          break;
        case -40:
          mshow("已经领取过了");
          break;
        case -41:
          mshow("用户还未到该等级");
          break;
        case -42:
          mshow("领取等级不在范围内");
          break;
        case -43:
          mshow("不允许领取");
          break;
        case -44:
          mshow("账户未找到");
          break;
        default:
          break;
      }
    }
  }
}]);



brokerFrontModule.factory('cookieService', function() {
  return {
    setCookie: function(name, value, time) {
      var exp = new Date();
      exp.setTime(exp.getTime() + time * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    getCookie: function(name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg)) {
        return (arr[2]);
      } else {
        return null;
      }
    },
    delCookie: function(name) {
      var getCookie = function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
          return (arr[2]);
        } else {
          return null;
        }
      }
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = getCookie(name);
      if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
      }
    }
  }
});



brokerFrontModule.factory('timeService', ['$timeout', function($timeout) {
  return {
    getTime: function(time, type) {
      if (type == 'string') {
        var date = new Date(time);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()+" 00:00:00";
      } else {
        var date = new Date(time);
        return new Date(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()) * 1;
      }
    },
    getEndTime: function(time, type) {
      if (type == 'string') {
        var date = new Date(time);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()+" 23:59:59";
      } else {
        var date = new Date(time);
        return new Date(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()) * 1 + (24 * 3600000 - 1);
      }
    }
  }
}]);
angular.module('templates', ['common/templates/layout.partials.html', 'modules/brokerfront/templates/broker.invest.detail.html', 'modules/brokerfront/templates/broker.invest.list.html', 'modules/brokerfront/templates/broker.invite.html', 'modules/brokerfront/templates/broker.invite.list.html', 'modules/brokerfront/templates/broker.login.html', 'modules/brokerfront/templates/customer.login.html', 'modules/brokerfront/templates/offline.invite.list.html', 'modules/brokerfront/templates/offline.login.html', 'modules/brokerfront/templates/offline.recieve.html', 'modules/brokerfront/templates/public.account.html', 'modules/brokerfront/templates/public.bill.list.html', 'modules/brokerfront/templates/public.declare.html', 'modules/brokerfront/templates/public.doc.html', 'modules/brokerfront/templates/public.errors.html', 'modules/brokerfront/templates/public.index.html', 'modules/brokerfront/templates/public.login.html', 'modules/brokerfront/templates/public.qrcode.html', 'modules/brokerfront/templates/public.withdraw.html']);

angular.module("common/templates/layout.partials.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/templates/layout.partials.html",
    "<div class=\"container\" id=\"mainContainer\">\n" +
    "    <div ui-view>\n" +
    "\n" +
    "    </div>  \n" +
    "</div>\n" +
    "\n" +
    "<div id=\"errBox\">\n" +
    "	<div id=\"errBoxShadow\"></div>\n" +
    "	<div id=\"errBoxText\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/broker.invest.detail.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/broker.invest.detail.html",
    "<!--搜索下拉弹窗-->\n" +
    "<div class=\"windpub searchwin_2\" ng-if=\"show\">\n" +
    "    <div class=\"windpubcon\">\n" +
    "         <form class=\"form-horizontal\" role=\"form\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"inputEmail3\" class=\"col-xs-2 control-label\">期限</label>\n" +
    "            <div class=\"col-xs-10\">\n" +
    "     <!--            <select class=\"form-control\" ng-model=\"entity.limit\">\n" +
    "                  <option value=\"1\">1</option>\n" +
    "                  <option value=\"2\">2</option>\n" +
    "                  <option value=\"3\">3</option>\n" +
    "                  <option value=\"6\">6</option>\n" +
    "                  <option value=\"12\">12</option>\n" +
    "                </select> -->\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"entity.limit\" onkeypress=\"if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;\" placeholder=\"月\">\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"inputPassword3\" class=\"col-xs-2 control-label\">时间</label>\n" +
    "            <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\" ng-model=\"entity.InvestTimeBegin\"/></div>\n" +
    "            <span class=\"control-label\">-</span>\n" +
    "            <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\" ng-model=\"entity.InvestTimeEnd\" /></div>\n" +
    "          </div>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"inputPassword3\" class=\"col-xs-2 control-label\">金额</label>\n" +
    "            <div class=\"col-xs-5\"><input type=\"text\" ng-model=\"entity.InvestAmountSumBegin\" class=\"form-control\" placeholder=\"\" /></div>\n" +
    "            <span class=\"control-label\">-</span>\n" +
    "            <div class=\"col-xs-5\"><input type=\"text\" ng-model=\"entity.InvestAmountSumEnd\" class=\"form-control\" placeholder=\"\" /></div>\n" +
    "          </div>\n" +
    "          <div class=\"form-group\">\n" +
    "            <div class=\"col-xs-2\">&nbsp;</div>\n" +
    "            <div class=\"col-xs-10\">\n" +
    "                <input type=\"button\" value=\"筛选\" class=\"determine floatL\" ng-click=\"detailList()\"/>\n" +
    "                <input type=\"button\" value=\"取消\" class=\"cancel floatR\" ng-click=\"windowShow(false)\"/>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </form>              \n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"home_nav\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12 col-sm-12\"><a href=\"/p/u/menu/index\" class=\"homea floatL\">home</a>投资详情<a ng-click=\"windowShow(true)\" class=\"floatR searcha\">search</a></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"billstab kehulist\">\n" +
    "    <div class=\"row\">\n" +
    "        <table class=\"table\">\n" +
    "            <tbody>\n" +
    "                <tr>\n" +
    "                    <th width=\"20%\">ID</th>\n" +
    "                    <th width=\"20%\">期限</th>\n" +
    "                    <th width=\"28%\">投资时间</th>\n" +
    "                    <th width=\"32%\">金额(年化)</th>\n" +
    "                </tr>\n" +
    "                <tr ng-repeat=\"userInvest in list\" class=\"ng-scope\">\n" +
    "                    <td><a href=\"{{baseInfo.url+userInvest.borrowId}}\" target=\"blank\"><span ng-bind=\"userInvest.borrowId\" class=\"ng-binding\"></span></a>\n" +
    "                    </td>\n" +
    "                    <td class=\"ng-binding\">{{userInvest.deadline}}</td>\n" +
    "                    <td class=\"ng-binding\">{{userInvest.investTime.substr(0,userInvest.investTime.length-2)}}</td>\n" +
    "                    <td class=\"ng-binding\">{{userInvest.investAmount+\".00\"}}({{userInvest.investAnnualSum}})</td>\n" +
    "                </tr>\n" +
    "                <tr ng-if=\"list.length==0\" style=\"magin-bottom:20px\">\n" +
    "                    <td colspan=\"4\"><p style=\"padding-bottom:45px\">暂无投资</p></td>\n" +
    "                </tr>\n" +
    "                <tr ng-if=\"more\" ng-click=\"displayMore()\">\n" +
    "                    <td colspan=\"4\"><p style=\"padding-bottom:45px\">查看更多</p></td>\n" +
    "                </tr>\n" +
    "                <tr ng-if=\"!more&&list.length!=0\">\n" +
    "                    <td colspan=\"4\"><p style=\"padding-bottom:45px\">没有更多了</p></td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    \n" +
    "    <div class=\"row positfix\">\n" +
    "        <div class=\"col-xs-6 col-sm-6\">\n" +
    "            <div class=\"listex_1 corblue text-left\"><span>{{name}}</span><span>{{mobile}}</span></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-6 col-sm-6\">\n" +
    "            <div class=\"listex_1 corgreen text-right\"><span>{{baseInfo.investCountS}}笔</span></br><span>{{baseInfo.investSumS}}（{{baseInfo.investAnnualSumS}}）元</span></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/broker.invest.list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/broker.invest.list.html",
    "<!--搜索下拉弹窗-->\n" +
    "        <div class=\"windpub searchwin_2\" ng-if=\"show\">\n" +
    "            <div class=\"windpubcon\">\n" +
    "                 <form class=\"form-horizontal\" role=\"form\">\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputEmail3\" class=\"col-xs-2 control-label\">手机</label>\n" +
    "                    <div class=\"col-xs-10\"><input type=\"text\" ng-model=\"entity.mobile\" class=\"form-control\" placeholder=\"手机号\" /></div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputPassword3\" class=\"col-xs-2 control-label\">时间</label>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" ng-model=\"entity.InvestTimeBegin\" class=\"form-control\" /></div>\n" +
    "                    <span class=\"control-label\">-</span>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" ng-model=\"entity.InvestTimeEnd\" class=\"form-control\" /></div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputPassword3\" class=\"col-xs-2 control-label\">金额</label>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"text\" ng-model=\"entity.InvestAmountSumBegin\" class=\"form-control\" placeholder=\"\" /></div>\n" +
    "                    <span class=\"control-label\">-</span>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"text\" ng-model=\"entity.InvestAmountSumEnd\" class=\"form-control\" placeholder=\"\" /></div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <div class=\"col-xs-2\">&nbsp;</div>\n" +
    "                    <div class=\"col-xs-10\">\n" +
    "                        <input type=\"button\" value=\"筛选\" ng-click=\"investList()\" class=\"determine floatL\" />\n" +
    "                        <input type=\"button\" value=\"取消\" ng-click=\"windowShow(false)\" class=\"cancel floatR\" />\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </form>              \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    \n" +
    "        <div class=\"home_nav\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-xs-12 col-sm-12\"><a href=\"/p/u/menu/index\" class=\"homea floatL\">home</a>投资列表<a ng-click=\"windowShow(true)\"  class=\"floatR searcha\">search</a></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"billstab kehulist\">\n" +
    "            <div class=\"row\">\n" +
    "                <table class=\"table\">\n" +
    "                    <tbody>\n" +
    "                        <tr>\n" +
    "                            <th width=\"20%\">姓名</th>\n" +
    "                            <th width=\"32%\">手机号</th>\n" +
    "                            <th width=\"26%\">金额(年化)</th>\n" +
    "                            <th width=\"22%\">投资笔数</th>\n" +
    "                        </tr>\n" +
    "           \n" +
    "                         <tr ng-repeat=\"userInvest in list\" class=\"ng-scope\">\n" +
    "                             <td><a ng-click=\"choose(userInvest)\"><span class=\"ng-binding\">{{userInvest.realName}}</span></a>\n" +
    "\n" +
    "                             </td>\n" +
    "                             <td class=\"ng-binding\">{{userInvest.cellPhone}}</td>\n" +
    "                             <td class=\"ng-binding\">{{userInvest.investSum|moneyfilter}}({{userInvest.investAnnualSum|moneyfilter}})</td>\n" +
    "                             <td class=\"ng-binding\">{{userInvest.investCount}}</td>\n" +
    "                         </tr>                        \n" +
    "                         <tr ng-if=\"list.length==0\">\n" +
    "                            <td colspan=\"4\"><p>暂无投资</p></td>\n" +
    "                        </tr>\n" +
    "                        <tr ng-if=\"more\" ng-click=\"displayMore()\">\n" +
    "                            <td colspan=\"4\"><p>查看更多</p></td>\n" +
    "                        </tr>\n" +
    "                        <tr ng-if=\"!more&&list.length!=0\">\n" +
    "                            <td colspan=\"4\"><p>没有更多了</p></td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row padb2 positfix\">\n" +
    "                <div class=\"col-xs-12 col-sm-12\">\n" +
    "                    <div class=\"listex_1 corgreen text-center\"><span>{{baseInfo.regCount}}({{baseInfo.investorCountS}})人</span><i>|</i><span>{{baseInfo.investCountS}}笔</span><i>|</i><span>{{baseInfo.investSumS|moneyfilter}}({{baseInfo.investAnnualSumS|moneyfilter}})元</span></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/broker.invite.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/broker.invite.html",
    "<!--确认提示弹窗-->\n" +
    "<div class=\"windpub yqtip_wind\" style=\"display:none;\">\n" +
    "    <div class=\"windpubcon\">\n" +
    "        <div class=\"t_til\"><div class=\"closeX\">x</div></div>\n" +
    "        <div class=\"t_txtc\">\n" +
    "            <p class=\"txt\">您已预约113848810339，保护期为15天，期间客户完成注册，预约成功，否则预约失败</p>\n" +
    "            <input type=\"button\" value=\"确定\" class=\"determine floatL\" />\n" +
    "            <input type=\"button\" value=\"取消\" class=\"cancel floatR\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"home_nav\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-12 col-sm-12\"><a href=\"/p/u/menu/index\" class=\"homea floatL\">home</a></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "   <div class=\"marginC toplogo\"><img ng-src=\"{{imgHead}}/img/logo.png\" width=\"100%\" alt=\"\" /></div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "   <div class=\"marginC textcenter\"><img src=\"{{imgHead}}/img/dtpic_1.png\" height=\"140\" alt=\"\" /></div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"from_1 padt2\">\n" +
    "    <form class=\"form-horizontal\" role=\"form\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" class=\"form-control user_name\" ng-model=\"name\" placeholder=\"输入客户姓名\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"text\" class=\"form-control user_tel\" ng-model=\"mobile\" placeholder=\"输入客户手机号\">\n" +
    "        </div>\n" +
    "        <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"invite()\">确认邀请</button>\n" +
    "    </form>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/broker.invite.list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/broker.invite.list.html",
    "<!--搜索下拉弹窗-->\n" +
    "        <div class=\"windpub searchwin_2\" ng-if=\"show\">\n" +
    "            <div class=\"windpubcon\">\n" +
    "                 <form class=\"form-horizontal\" role=\"form\">\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputEmail3\" class=\"col-xs-2 control-label\">状态</label>\n" +
    "                    <div class=\"col-xs-10\">\n" +
    "                        <select class=\"form-control\" ng-model=\"entity.type\">\n" +
    "                          <option value=\"9\">全部</option>\n" +
    "                          <option value=\"1\">预约</option>\n" +
    "                          <option value=\"2\">成功</option>\n" +
    "                          <option value=\"3\">失败</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputPassword3\" class=\"col-xs-2 control-label\">时间</label>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\" ng-model=\"entity.InviteTimeBegin\"/></div>\n" +
    "                    <span class=\"control-label\">-</span>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\" ng-model=\"entity.InviteTimeEnd\"/></div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputEmail3\" class=\"col-xs-2 control-label\">手机</label>\n" +
    "                    <div class=\"col-xs-10\"><input type=\"text\" class=\"form-control\" placeholder=\"手机号\" ng-model=\"entity.mobile\"/></div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <div class=\"col-xs-2\">&nbsp;</div>\n" +
    "                    <div class=\"col-xs-10\">\n" +
    "                        <input type=\"button\" value=\"筛选\" ng-click=\"invitelist(true)\" class=\"determine floatL\" />\n" +
    "                        <input type=\"button\" value=\"取消\" ng-click=\"windowShow(false)\" class=\"cancel floatR\" />\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </form>              \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    \n" +
    "      <div class=\"home_nav\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-12 col-sm-12\"><a href=\"/p/u/menu/index\" class=\"homea floatL\">home</a>邀请列表<a ng-click=\"windowShow(true)\" class=\"floatR searcha\">search</a></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"billstab kehulist\">\n" +
    "          <div class=\"row\">\n" +
    "                <table class=\"table\" >\n" +
    "                  <tbody>\n" +
    "                        <tr>\n" +
    "                          <th width=\"24%\">姓名</th>\n" +
    "                            <th width=\"32%\">手机号</th>\n" +
    "                            <th width=\"23%\" ng-if=\"entity.type!=2\">预约时间</th>\n" +
    "                            <th width=\"21%\" ng-if=\"entity.type!=2\">剩余(天)</th>\n" +
    "                            <th width=\"23%\" ng-if=\"entity.type==2\">注册时间</th>\n" +
    "                            <th width=\"21%\" ng-if=\"entity.type==2\">注册渠道</th>\n" +
    "                        </tr>\n" +
    "                        <tr ng-repeat=\"item in list\" >\n" +
    "                            <td><p><i class=\"shi\" ng-if=\"item.isIdnoAuth\">实</i>{{item.name}}</p></td>\n" +
    "                            <td><p>{{item.mobile}}</p></td>\n" +
    "                            <td>\n" +
    "                              <p ng-if=\"entity.type!=2\">{{item.reserveAt|date:'yyyy-MM-dd HH:mm'}}</p>\n" +
    "\n" +
    "                              <p ng-if=\"entity.type==2\">{{item.updateAt|date:'yyyy-MM-dd HH:mm'}}</p>\n" +
    "                            </td>\n" +
    "                            <td>\n" +
    "                              <p ng-if=\"entity.type!=2\">{{item.deadline}}天</p>\n" +
    "\n" +
    "                              <p ng-if=\"entity.type==2\">{{item.regChannel}}</p>\n" +
    "                            </td>\n" +
    "                        </tr>                      \n" +
    "                        <tr ng-if=\"list.length==0\">\n" +
    "                            <td colspan=\"4\"><p>暂无邀请</p></td>\n" +
    "                        </tr>\n" +
    "                        <tr ng-if=\"more\" ng-click=\"displayMore()\">\n" +
    "                            <td colspan=\"4\"><p>查看更多</p></td>\n" +
    "                        </tr>\n" +
    "                        <tr ng-if=\"!more&&list.length!=0\">\n" +
    "                            <td colspan=\"4\"><p>没有更多了</p></td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "          </div>\n" +
    "          \n" +
    "        </div>");
}]);

angular.module("modules/brokerfront/templates/broker.login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/broker.login.html",
    "<div class=\"webName autoSize textCenter grayButton\">\n" +
    "	<div class=\"fanhui\"><span></span></div>\n" +
    "	<h5>绑定账号</h5>\n" +
    "    <div class=\"set\" style=\"display:none;\"><span></span></div>\n" +
    "</div>\n" +
    "<div class=\"textCenter logo_1\"></div>\n" +
    "<ul class=\"nav autoSize\">\n" +
    "    <li><i></i><span>用户名：</span>\n" +
    "    	<input type=\"text\" ng-model=\"loginName\" class=\"input8 ng-valid-maxlength ng-dirty ng-valid ng-valid-required\" name=\"name\" id=\"name\" placeholder=\"请输入您的手机号\" required ng-maxlength=\"12\"></li>\n" +
    "	<li><i class=\"pawodbg\"></i><span>密&nbsp;&nbsp;&nbsp;码：</span>\n" +
    "		<input type=\"password\"  ng-model=\"passWord\" class=\"input8 ng-vaild-maxlength ng-valid ng-valid-required\" name=\"pwd\" id=\"pwd\" ng-model=\"user.pwd\" placeholder=\"请输入密码，至少6位数\"required ng-maxlength=\"12\"></li>\n" +
    "</ul>\n" +
    "<div class=\"textCenter\">\n" +
    "	<button class=\"redButton autoSize editBt\" ng-click=\"login()\">登录</button>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/customer.login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/customer.login.html",
    "<div class=\"webName autoSize textCenter grayButton\">\n" +
    "	<div class=\"fanhui\"><span></span></div>\n" +
    "	<h5>绑定账号</h5>\n" +
    "    <div class=\"set\" style=\"display:none;\"><span></span></div>\n" +
    "</div>\n" +
    "<div class=\"textCenter logo_1\"></div>\n" +
    "<ul class=\"nav autoSize\">\n" +
    "    <li><i></i><span>用户名：</span>\n" +
    "    	<input type=\"text\" ng-model=\"loginName\" class=\"input8 ng-valid-maxlength ng-dirty ng-valid ng-valid-required\" name=\"name\" id=\"name\" placeholder=\"请输入您的手机号\" required ng-maxlength=\"12\"></li>\n" +
    "	<li><i class=\"pawodbg\"></i><span>密&nbsp;&nbsp;&nbsp;码：</span>\n" +
    "		<input type=\"password\"  ng-model=\"passWord\" class=\"input8 ng-vaild-maxlength ng-valid ng-valid-required\" name=\"pwd\" id=\"pwd\" ng-model=\"user.pwd\" placeholder=\"请输入密码，至少6位数\"required ng-maxlength=\"12\"></li>\n" +
    "</ul>\n" +
    "<div class=\"textCenter\">\n" +
    "	<button class=\"redButton autoSize editBt\" ng-click=\"login()\">登录</button>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/offline.invite.list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/offline.invite.list.html",
    "<!--搜索下拉弹窗-->\n" +
    "        <div class=\"windpub searchwin_2\" ng-if=\"show\">\n" +
    "            <div class=\"windpubcon\">\n" +
    "                 <form class=\"form-horizontal\" role=\"form\">\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputPassword3\" class=\"col-xs-2 control-label labwid_1\">注册时间</label>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\" ng-model=\"entity.reg_from\" /></div>\n" +
    "                    <span class=\"control-label\">-</span>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\" ng-model=\"entity.reg_end\"  /></div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputPassword3\" class=\"col-xs-2 control-label labwid_1\">实名时间</label>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\" ng-model=\"entity.auth_from\" /></div>\n" +
    "                    <span class=\"control-label\">-</span>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\" ng-model=\"entity.auth_end\" /></div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <div class=\"col-xs-2\">&nbsp;</div>\n" +
    "                    <div class=\"col-xs-10\">\n" +
    "                        <input type=\"button\" value=\"筛选\" class=\"determine floatL\" ng-click=\"query()\"/>\n" +
    "                        <input type=\"button\" value=\"取消\" class=\"cancel floatR\" ng-click=\"windowShow(false)\" />\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </form>              \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    \n" +
    "      <div class=\"home_nav\">\n" +
    "          <div class=\"row\">\n" +
    "              <div class=\"col-xs-12 col-sm-12\"><a href=\"/p/u/menu/index\" class=\"homea floatL\">home</a>邀请列表<a ng-click=\"windowShow(true)\" class=\"floatR searcha\">search</a></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"billstab kehulist\">\n" +
    "          <div class=\"row padb8\">\n" +
    "                <table class=\"table\">\n" +
    "                  <tbody>\n" +
    "                        <tr>\n" +
    "                          <th width=\"22%\">昵称</th>\n" +
    "                            <th width=\"32%\">手机号</th>\n" +
    "                            <th width=\"23%\">注册时间</th>\n" +
    "                            <th width=\"23%\">实名时间</th>\n" +
    "                        </tr>\n" +
    "\n" +
    "                        <tr ng-repeat=\"userReserve in list\" class=\"ng-scope\">\n" +
    "                          <td>{{userReserve.userName}}</td>\n" +
    "                          <td>{{userReserve.mobilePhone|mobilefilter}}</td>\n" +
    "                          <td>{{userReserve.registerTime|date:'yyyy-MM-dd'}}</td>\n" +
    "                          <td>{{userReserve.idNoAuthTime|date:'yyyy-MM-dd'}}</td>\n" +
    "                        </tr>\n" +
    "\n" +
    "                        <tr ng-if=\"list.length==0\">\n" +
    "                            <td colspan=\"4\"><p style=\"margin-bottom:2em;\">暂无邀请</p></td>\n" +
    "                        </tr>\n" +
    "                        <tr ng-if=\"more\" ng-click=\"queryMore()\">\n" +
    "                            <td colspan=\"4\"><p style=\"margin-bottom:2em;\">查看更多</p></td>\n" +
    "                        </tr>\n" +
    "                        <tr ng-if=\"!more&&list.length!=0\">\n" +
    "                            <td colspan=\"4\"><p style=\"margin-bottom:2em;\">没有更多了</p></td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "          </div>\n" +
    "          <div class=\"row positfix\">\n" +
    "            <div class=\"row padb1\">\n" +
    "              <div class=\"col-xs-12 col-sm-12\">\n" +
    "                <div class=\"listex_1 corblue text-right\"><span>注册{{baseInfo.regYCount}}人</span><i>|</i><span>实名{{baseInfo.authYCount}}人</span></div>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <input type=\"button\" value=\"领取提成\" ui-sref=\"brokerfront.orecieve\" class=\"btn btn-primary btn-lg btn-block marb2 bgyellow\" />\n" +
    "          </div>\n" +
    "            \n" +
    "        </div>");
}]);

angular.module("modules/brokerfront/templates/offline.login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/offline.login.html",
    "<div class=\"webName autoSize textCenter grayButton\">\n" +
    "	<div class=\"fanhui\"><span></span></div>\n" +
    "	<h5>绑定账号</h5>\n" +
    "    <div class=\"set\" style=\"display:none;\"><span></span></div>\n" +
    "</div>\n" +
    "<div class=\"textCenter logo_1\"></div>\n" +
    "<ul class=\"nav autoSize\">\n" +
    "    <li><i></i><span>用户名：</span>\n" +
    "    	<input type=\"text\" ng-model=\"loginName\" class=\"input8 ng-valid-maxlength ng-dirty ng-valid ng-valid-required\" name=\"name\" id=\"name\" placeholder=\"请输入您的手机号\" required ng-maxlength=\"12\"></li>\n" +
    "	<li><i class=\"pawodbg\"></i><span>密&nbsp;&nbsp;&nbsp;码：</span>\n" +
    "		<input type=\"password\"  ng-model=\"passWord\" class=\"input8 ng-vaild-maxlength ng-valid ng-valid-required\" name=\"pwd\" id=\"pwd\" ng-model=\"user.pwd\" placeholder=\"请输入密码，至少6位数\"required ng-maxlength=\"12\"></li>\n" +
    "</ul>\n" +
    "<div class=\"textCenter\">\n" +
    "	<button class=\"redButton autoSize editBt\" ng-click=\"login()\">登录</button>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/offline.recieve.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/offline.recieve.html",
    "<!--搜索下拉弹窗-->\n" +
    "        <div class=\"windpub searchwin_2\" ng-if=\"show\">\n" +
    "            <div class=\"windpubcon\">\n" +
    "                 <form class=\"form-horizontal\" role=\"form\">\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputEmail3\" class=\"col-xs-2 control-label labwid_1\">领取</label>\n" +
    "                    <div class=\"col-xs-10\">\n" +
    "                        <select class=\"form-control\" ng-model=\"entity.status\">\n" +
    "                          <option value=\"12\">全部</option>\n" +
    "                          <option value=\"1\">未领</option>\n" +
    "                          <option value=\"2\">已领</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputPassword3\" class=\"col-xs-2 control-label labwid_1\">注册时间</label>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\"  ng-model=\"entity.reg_from\" /></div>\n" +
    "                    <span class=\"control-label\">-</span>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\"  ng-model=\"entity.reg_end\" /></div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputPassword3\" class=\"col-xs-2 control-label labwid_1\">实名时间</label>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\"  ng-model=\"entity.auth_from\" /></div>\n" +
    "                    <span class=\"control-label\">-</span>\n" +
    "                    <div class=\"col-xs-5\"><input type=\"date\" class=\"form-control\"  ng-model=\"entity.auth_end\" /></div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label for=\"inputEmail3\" class=\"col-xs-2 control-label\">昵称</label>\n" +
    "                    <div class=\"col-xs-10\"><input type=\"text\" class=\"form-control\" ng-model=\"entity.nick\" placeholder=\"昵称\" /></div>\n" +
    "                  </div>\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <div class=\"col-xs-2\">&nbsp;</div>\n" +
    "                    <div class=\"col-xs-10\">\n" +
    "                        <input type=\"button\" value=\"筛选\" ng-click=\"query()\" class=\"determine floatL\" />\n" +
    "                        <input type=\"button\" value=\"取消\" ng-click=\"windowShow(false)\" class=\"cancel floatR\" />\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </form>              \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    \n" +
    "        <div class=\"home_nav\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-xs-12 col-sm-12\"><a href=\"/p/u/menu/index\" class=\"homea floatL\">home</a>领取提成<a ng-click=\"windowShow(true)\" class=\"floatR searcha\">search</a></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"billstab kehulist\">\n" +
    "          <div class=\"row padb8\">\n" +
    "            <table class=\"table\">\n" +
    "              <tbody>\n" +
    "                    <tr>\n" +
    "                      <th width=\"26%\">昵称</th>\n" +
    "                        <th width=\"27%\">注册时间</th>\n" +
    "                        <th width=\"27%\">实名时间</th>\n" +
    "                        <th width=\"20%\">领取</th>\n" +
    "                    </tr>\n" +
    "\n" +
    "                    <tr ng-repeat=\"item in list\" class=\"ng-scope\" ng-class=\"{keling:item.selected}\">\n" +
    "                      <td ng-click=\"select($index,item)\">{{item.userName}}</td>\n" +
    "                      <td ng-click=\"select($index,item)\">{{item.registerTime|date:'yyyy-MM-dd HH:mm'}}</td>\n" +
    "                      <td ng-click=\"select($index,item)\">{{item.idNoAuthTime|date:'yyyy-MM-dd HH:mm'}}</td>\n" +
    "                      <td>\n" +
    "                        <a ng-if=\"item.commissionStatus==1\" ng-click=\"recieve($index,item.id)\">领取</a>\n" +
    "                        <a ng-if=\"item.commissionStatus==2\" class=\"corred\">已领</a>\n" +
    "                        <a ng-if=\"item.commissionStatus==0\" class=\"corgray\">不可领</a>\n" +
    "                      </td>\n" +
    "                    </tr>\n" +
    "                    <tr ng-if=\"list.length==0\">\n" +
    "                        <td colspan=\"4\"><p>暂无数据</p></td>\n" +
    "                    </tr>\n" +
    "                    <tr ng-if=\"more\" ng-click=\"queryMore()\">\n" +
    "                        <td colspan=\"4\"><p>查看更多</p></td>\n" +
    "                    </tr>\n" +
    "                    <tr ng-if=\"!more&&list.length!=0\">\n" +
    "                        <td colspan=\"4\"><p>没有更多了</p></td>\n" +
    "                    </tr>\n" +
    "\n" +
    "              </tbody>\n" +
    "            </table>\n" +
    "          </div>\n" +
    "\n" +
    "          <div class=\"row positfix\">\n" +
    "              <div class=\"col-xs-12 col-sm-12\">\n" +
    "                    <div class=\"row padb1\">\n" +
    "                        <div class=\"col-xs-12 col-sm-12\">\n" +
    "                            <div class=\"listex_1 corblue text-right\"><span>待领{{baseInfo.authNRCount}}人</span><i>|</i><span>已领{{baseInfo.authYRCount}}人</span></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-xs-6 col-sm-6\">\n" +
    "                            <input type=\"button\" value=\"领取\" ng-click=\"recieve()\" class=\"btn btn-primary btn-lg btn-block bgyellow\" />\n" +
    "                        </div>\n" +
    "                        <div class=\"col-xs-6 col-sm-6\">\n" +
    "                            <input type=\"button\" value=\"{{seletAllText}}\" ng-click=\"seletAll(true)\" class=\"btn btn-primary btn-lg btn-block bgyellow\" />\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "          </div>\n" +
    "        </div>");
}]);

angular.module("modules/brokerfront/templates/public.account.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/public.account.html",
    "<div id=\"accountContainer\">\n" +
    "        <!--绑卡提示弹窗-->\n" +
    "        <div class=\"windpub myzh_wind\" style=\"display:none;\">\n" +
    "            <div class=\"windpubcon\">\n" +
    "                <div class=\"t_til\"><h4>提示</h4><div class=\"closeX\">x</div></div>\n" +
    "                <div class=\"t_txtc\">\n" +
    "                    <p class=\"txt\">请先在多美贷平台（www.duomeidai.com）绑定银行卡，再进行提现操作。</p>\n" +
    "                    <input type=\"button\" value=\"确定\" class=\"btn btn-primary btn-lg btn-block determine\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    \n" +
    "    	<div class=\"home_nav\">\n" +
    "        	<div class=\"row\">\n" +
    "            	<div class=\"col-xs-12 col-sm-12\"><a href=\"/p/u/menu/index\" class=\"homea floatL\">home</a>我的账户</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"tcaccount\">\n" +
    "        	<div class=\"floatL lpic\"><a class=\"tipnub\" ui-sref=\"brokerfront.orecieve\" ng-if=\"entity.prRelCount\">{{entity.prRelCount}}</a></div>\n" +
    "            <div class=\"floatL rtxtnub\">\n" +
    "\n" +
    "            	<div class=\"usrlei\"><span class=\"floatL\">提成账户</span><a ng-click=\"tipsShow()\" class=\"floatL\">?</a></div>\n" +
    "                <div class=\"ramount\"><span>{{entity.usableSum}}</span>元</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "    	<div class=\"tznublist\">\n" +
    "        	<div class=\"row\">\n" +
    "            	<div class=\"col-xs-6 col-sm-6 lbor\">\n" +
    "                	<dl>\n" +
    "                    	<dt></dt>\n" +
    "                        <dd ng-if=\"userRole==1\">\n" +
    "                        	<p>投资人数</p>\n" +
    "                            <p>{{entity.investorCount}}</p>\n" +
    "                        </dd>\n" +
    "\n" +
    "                        <dd ng-if=\"userRole==2\">\n" +
    "                        	<p>实名人数</p>\n" +
    "                            <p>{{entity.authCount}}</p>\n" +
    "                        </dd>\n" +
    "                    </dl>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-6 col-sm-6 rbor\">\n" +
    "                	<dl>\n" +
    "                    	<dt></dt>\n" +
    "                        <dd>\n" +
    "                        	<p>注册人数</p>\n" +
    "                            <p>{{entity.regCount}}</p>\n" +
    "                        </dd>\n" +
    "                    </dl>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"listtab myaccountab\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-xs-5 col-sm-5\">\n" +
    "                	<a href=\"javascript:\" class=\"listtlpub my_zh\" ui-sref=\"brokerfront.qrcode\"><i></i><p>我的邀请码</p></a>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-7 col-sm-7\">\n" +
    "                    <a href=\"javascript:\" class=\"listtlpub zda\" ui-sref=\"brokerfront.billlist\"><i></i><p>账单</p></a>\n" +
    "                	<a href=\"javascript:\" class=\"listtlpub tixian\" ui-sref=\"brokerfront.withdraw\"><i></i><p>提现</p></a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/public.bill.list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/public.bill.list.html",
    "<!--搜索下拉弹窗-->\n" +
    "        <div class=\"windpub search_pubwind\" ng-if=\"show\">\n" +
    "            <div class=\"windpubcon\">\n" +
    "                <div class=\"t_txtc\">\n" +
    "                	<div class=\"row\">                        \n" +
    "                		<div class=\"col-xs-4 col-sm-4\"><input type=\"button\" ng-click=\"query(1001)\"value=\"提现\" class=\"butsearch_1\" /></div>\n" +
    "                        <div class=\"col-xs-4 col-sm-4\"><input type=\"button\" ng-click=\"query(1002)\" value=\"投资\" class=\"butsearch_1\" /></div>\n" +
    "                    	<div class=\"col-xs-4 col-sm-4\"><input type=\"button\" ng-click=\"query(1003)\"value=\"提成收入\" class=\"butsearch_1\" /></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    \n" +
    "    	<div class=\"home_nav\">\n" +
    "        	<div class=\"row\">\n" +
    "            	<div class=\"col-xs-12 col-sm-12\"><a  href=\"/p/u/menu/index\" class=\"homea floatL\">home</a>我的账单<a ng-click=\"windowShow(true)\" class=\"floatR searcha\">search</a></div>\n" +
    "            </div>\n" +
    "        </div>        \n" +
    "        <div class=\"billstab\">\n" +
    "        	<div class=\"row\">\n" +
    "                <table class=\"table table-striped\"  ng-if=\"list.length>0\">\n" +
    "                	<tbody>\n" +
    "                        <tr>\n" +
    "                            <th width=\"40%\">提成</th>\n" +
    "                            <th width=\"30%\">收支</th>\n" +
    "                            <th width=\"30%\">结余</th>\n" +
    "                        </tr>\n" +
    "                        <tr ng-repeat=\"item in list\">\n" +
    "                            <td>\n" +
    "                                <p>{{item.remarks}}</p>\n" +
    "                                <p class=\"time\">{{item.createAt|date:'yyyy-MM-dd HH:mm'}}</p>\n" +
    "                            </td>\n" +
    "                            <td><p ng-class=\"{ corgreen:item.operateType!=1003,corred:item.operateType==1003}\">{{item.handleSum|operatefilter:item.operateType}}</p></td>\n" +
    "                            <td><p>{{item.usableSum|moneyfilter}}</p></td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            	<!-- <div ng-if=\"list.length==0\" class=\"text-center padt2 fon16\">暂无数据</div> -->\n" +
    "                <div class=\"listex_1 corgray text-center\" ng-if=\"more\" ng-click=\"queryMore()\"><span>查看更多</span></div>\n" +
    "                <div class=\"listex_1 corgray text-center\" ng-if=\"!more\"><span>没有更多了</span></div>\n" +
    "    		</div>\n" +
    "   	 	</div>");
}]);

angular.module("modules/brokerfront/templates/public.declare.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/public.declare.html",
    "<div class=\"modal-header\" style = \"text-align:center;\">\n" +
    "  <a class=\"close\" ng-click=\"$dismiss()\">&times;</a>\n" +
    "  <h4 class=\"modal-title\">{{ title }}</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" style = \"text-align:left;\" ng-click=\"$dismiss()\">\n" +
    "1.平台合作商自愿成为多美贷业务推广渠道服务商，并在多美贷平台进行企业信息备案，经多美贷平台审核通过后合作并遵守多美贷业务推广规则进行业务推广。<br/>\n" +
    "2.除该业务服务以外，如平台合作商利用多美贷名义开展其他事宜，所产生的一切不良影响均由平台合作商自行承担。<br/>\n" +
    "3.平台合作商只负责多美贷平台客户推广，消费者后续在多美贷平台的投资行为等与平台合作商无关；<br/>\n" +
    "4.平台合作商与多美贷平台经营风险、损失各自承担；<br/>\n" +
    "5.因不可抗力等原因导致的责任，双方互不向对方承担责任。<br/>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/public.doc.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/public.doc.html",
    "");
}]);

angular.module("modules/brokerfront/templates/public.errors.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/public.errors.html",
    "出错啦啦啦啦啦");
}]);

angular.module("modules/brokerfront/templates/public.index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/public.index.html",
    "<div class=\"row\">\n" +
    "    <div class=\"marginC toplogo\"><img ng-src=\"{{imgHead}}/img/logo.png\" width=\"100%\" alt=\"\" /></div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"listtab\" ng-if=\"userRole==1\">\n" +
    "\n" +
    "    <div class=\"row\" >\n" +
    "        <div class=\"col-xs-7 col-sm-7\">\n" +
    "            <a ui-sref=\"brokerfront.binvite\" class=\"listtlpub yqkha\"><i></i><p>邀请客户</p></a>\n" +
    "            <a ui-sref=\"brokerfront.binvitelist\" class=\"listtlpub yqlist\"><i></i><p>邀请列表</p></a>\n" +
    "            <a ui-sref=\"brokerfront.binvestlist\" class=\"listtlpub tzlist\"><i></i><p>投资列表</p></a>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-5 col-sm-5\">\n" +
    "            <a ui-sref=\"brokerfront.withdraw\" class=\"listtlpub tixian\"><i></i><p>提现</p></a>\n" +
    "            <a ui-sref=\"brokerfront.billlist\" class=\"listtlpub zda\"><i></i><p>账单</p></a>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-6 col-sm-6\">\n" +
    "            <a ui-sref=\"brokerfront.account({role:1})\" class=\"listtlpub my_zh\"><i></i><p>我的账户</p></a>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-6 col-sm-6\">\n" +
    "            <a ui-sref=\"brokerfront.qrcode\" class=\"listtlpub my_yqm\"><i></i><p>我的邀请码</p></a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"listtab dtindt_nav\" ng-if=\"userRole==2\">\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-7 col-sm-7\">\n" +
    "            <a ui-sref=\"brokerfront.orecieve\" class=\"listtlpub lqtca\"><i></i><p>领取提成</p></a>\n" +
    "            <a ui-sref=\"brokerfront.oinvitelist\" class=\"listtlpub yqlist\"><i></i><p>邀请列表</p></a>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-5 col-sm-5\">\n" +
    "            <a ui-sref=\"brokerfront.withdraw\" class=\"listtlpub tixian\"><i></i><p>提现</p></a>\n" +
    "            <a ui-sref=\"brokerfront.billlist\" class=\"listtlpub zda\"><i></i><p>账单</p></a>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-6 col-sm-6\">\n" +
    "            <a ui-sref=\"brokerfront.account({role:2})\" class=\"listtlpub my_zh\"><i></i><p>我的账户</p></a>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-6 col-sm-6\">\n" +
    "            <a ui-sref=\"brokerfront.qrcode\" class=\"listtlpub my_yqm\"><i></i><p>我的邀请码</p></a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/public.login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/public.login.html",
    "<!-- step1 注册第一步，用户名密码-->\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"step==1\">\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "       <div class=\"marginC toplogo\"><img ng-src=\"{{imgHead}}/img/logo.png\" width=\"100%\" alt=\"\" /></div>\n" +
    "	</div>\n" +
    "\n" +
    "    <div class=\"from_1\">\n" +
    "        <form class=\"form-horizontal\" role=\"form\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"tel\" class=\"form-control user_tel\" onkeypress=\"if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;\" type=\"text\" class=\"form-control\" name=\"mobile\" ng-model=\"reg.mobile\" placeholder=\"输入手机号码\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"password\" class=\"form-control submit_1\" ng-model=\"reg.loginPwd\" placeholder=\"输入登录密码\">\n" +
    "            </div>\n" +
    "\n" +
    "            <button type=\"submit\" ng-click=\"login()\" class=\"btn btn-primary btn-lg btn-block\">下一步</button>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!-- step2 注册第二步，交易密码等-->\n" +
    "<div ng-if=\"step==2\">\n" +
    "    	<div class=\"home_nav\">\n" +
    "        	<div class=\"row\">\n" +
    "            	<div class=\"col-xs-12 col-sm-12\">注册多美贷</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"from_2 padt2\">\n" +
    "        	<div class=\"row\">\n" +
    "                 <form class=\"form-horizontal\" role=\"form\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"col-xs-1\">&nbsp;</div>\n" +
    "                        <div class=\"col-xs-10 control-label\"><b class=\"fon14\">{{reg.mobile}}</b></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"inputEmail3\" class=\"col-xs-1 control-label focusico\">*</label>\n" +
    "                        <div class=\"col-xs-11\"><input type=\"text\" ng-model=\"reg.msgcode\" class=\"form-control\" placeholder=\"输入手机验证码\" /></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"col-xs-1\">&nbsp;</div>\n" +
    "                        <div class=\"col-xs-10\">\n" +
    "                            <button type=\"button\" ng-disabled=\"codeDisabled\" class=\"determine floatL\" ng-click=\"voiceCode(1)\">\n" +
    "			                    <span ng-if=\"desableTime==0||clickType!=2\">语音获取</span>\n" +
    "			                    <span ng-if=\"desableTime>0&&clickType==2\">{{desableTime}}</span>\n" +
    "                            </button>\n" +
    "                            <button type=\"button\" ng-disabled=\"codeDisabled\" class=\"cancel floatR\" ng-click=\"msgCode(1)\">\n" +
    "			                    <span ng-if=\"desableTime==0||clickType!=1\">短信获取</span>\n" +
    "			                    <span ng-if=\"desableTime>0&&clickType==1\">{{desableTime}}</span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-if=\"msgCount>2\">\n" +
    "                        <label for=\"inputEmail3\" class=\"col-xs-1 control-label focusico\">*</label>\n" +
    "                        <div class=\"col-xs-6\">\n" +
    "                        	<input type=\"text\" class=\"form-control\" ng-model=\"reg.imgcode\" placeholder=\"图形验证码\" />\n" +
    "                        </div>\n" +
    "                        <div class=\"col-xs-4\" ng-click=\"imgCodeRefresh()\">\n" +
    "                        	<img ng-src=\"{{imgUrl}}\" class=\"pic_yzm\">\n" +
    "                    	</div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"inputEmail3\" class=\"col-xs-1 control-label focusico\">*</label>\n" +
    "                        <div class=\"col-xs-11\"><input type=\"text\" ng-model=\"reg.nickName\" class=\"form-control\" placeholder=\"昵称\" /></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label for=\"inputEmail3\" class=\"col-xs-1 control-label focusico\">*</label>\n" +
    "                        <div class=\"col-xs-11\"><input type=\"password\" ng-model=\"reg.tradePwd\" class=\"form-control\" placeholder=\"交易密码\" /></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\" ng-if=\"codeType=='acode'\">\n" +
    "                        <label for=\"inputEmail3\" class=\"col-xs-1 control-label focusico\"></label>\n" +
    "                        <div class=\"col-xs-11\"><input type=\"text\" ng-model=\"reg.randkey\" class=\"form-control\" placeholder=\"推荐人手机号／邀请代码，如无可不填\" /></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"col-xs-12\">\n" +
    "                            <label class=\"checkbox-inline regis_tip\">\n" +
    "                              <input type=\"checkbox\" id=\"inlineCheckbox1\" ng-model=\"reg.recieve_1\" value=\"option1\">我已阅读<a ng-click=\"goStep(-1)\">服务协议</a>并同意开通首信易支付资金账户\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"col-xs-12\" ng-if=\"codeType=='acode'\">\n" +
    "                            <label class=\"checkbox-inline regis_tip\">\n" +
    "                              <input type=\"checkbox\" id=\"inlineCheckbox1\" ng-model=\"reg.recieve_2\" value=\"option1\">我已阅读并同意<a ng-click=\"declareShow('免责声明')\">免责条款</a>\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"col-xs-12\"><button ng-disabled=\"!reg.recieve_1||!reg.recieve_2\" type=\"submit\" ng-class=\"{default:!recieve}\" ng-click=\"singIn()\"  class=\"btn btn-primary btn-lg btn-block\">下一步</button></div>\n" +
    "                    </div>\n" +
    "                </form>              \n" +
    "            </div>\n" +
    "        </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- step3 注册第三步，注册成功-->\n" +
    "<div ng-if=\"step==3\">\n" +
    "		<div class=\"home_nav\">\n" +
    "        	<div class=\"row\">\n" +
    "            	<div class=\"col-xs-12 col-sm-12\">验证身份</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"row\">\n" +
    "        	<div class=\"khzc_lcon\">\n" +
    "                <div class=\"tixian_tip\">\n" +
    "                    <div class=\"zt_pic\"></div>\n" +
    "                    <p class=\"marb3 mart2\">恭喜您，注册成功！</p>\n" +
    "                </div>\n" +
    "                <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"goStep(4)\">验证身份</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!-- step4 注册第四步，实名认证-->\n" +
    "<div ng-if=\"step==4\">\n" +
    "\n" +
    "	<div class=\"home_nav\">\n" +
    "    	<div class=\"row\">\n" +
    "        	<div class=\"col-xs-12 col-sm-12\">验证身份</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    \n" +
    "    <div class=\"from_1 mart3 txfrom\">\n" +
    "        <form class=\"form-horizontal\" role=\"form\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"real.realname\" placeholder=\"输入真实姓名\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"real.idcard\" placeholder=\"输入身份证号\">\n" +
    "            </div>\n" +
    "            <div class=\"regis_tip text-right padb1\">免费认证2次，2次以上需支付5元/次手续费</div>\n" +
    "            <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"checkRealName()\" ng-model=\"btnEnable\" ng-disabled=\"!btnEnable\">完成验证</button>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!-- step5 商家实名认证成功-->\n" +
    "<div ng-if=\"step==5\">\n" +
    "    <div class=\"row\">\n" +
    "    	<div class=\"khzc_lcon\">\n" +
    "            <div class=\"tixian_tip\">\n" +
    "                <div class=\"zt_pic\"></div>\n" +
    "                <p class=\"mart1 padb1\">恭喜您已成为多美贷经纪人！</p>\n" +
    "                \n" +
    "                <div class=\"popover_tcon\">\n" +
    "                    <div class=\"popover fade top in\" role=\"tooltip\" id=\"popover207943\">\n" +
    "                        <div class=\"arrow\"></div>\n" +
    "                        <h3 class=\"popover-title\" style=\"display: none;\"></h3>\n" +
    "                        <div class=\"popover-content\">\n" +
    "                        	<p class=\"corblue\">接下来,秀出您的子二维码吧！</p>\n" +
    "                            <p>1.凡是通过您的二维码注册并且验证身份的，您便可获得提成奖励；</p>\n" +
    "                            <p>2.奖励发放到您的提成账户，可直接提现或在多美贷平台投资；</p>\n" +
    "                            <p>3.关注多没经纪人微信，随时随地查看邀请情况和账单明细：</p>\n" +
    "                            <p>A.扫下方二维码关注</p>\n" +
    "                            <!-- <p>B.点击\"关注微信\"按钮，跟着多美君的引导来关注</p> -->\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                \n" +
    "                <img ng-src=\"{{imgHead}}/img/2weima.jpg\" height=\"140\" alt=\"\" />\n" +
    "                <p class=\"padb1 corgray\">经纪人微信号</p>\n" +
    "            </div>\n" +
    "<!--             <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\">关注微信</button> -->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- step6 错误1，实名认证错误-->\n" +
    "<div ng-if=\"step==6\">	\n" +
    "    <div class=\"row\">\n" +
    "    	<div class=\"khzc_lcon\">\n" +
    "            <div class=\"tixian_tip\">\n" +
    "                <div class=\"zt_pic error_pic\"></div>\n" +
    "                <p class=\"mart2\">验证失败！</p>\n" +
    "                <p class=\"padb1 corgray\">您已验证一次，还有1次免费机会。</p>\n" +
    "            </div>\n" +
    "            <button ng-click=\"goStep(4)\" type=\"submit\" class=\"btn btn-primary btn-lg btn-block\">再次验证</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- step7 错误2，实名认证错误2次-->\n" +
    "<div ng-if=\"step==7\">\n" +
    "    <div class=\"row\">\n" +
    "    	<div class=\"khzc_lcon\">\n" +
    "            <div class=\"tixian_tip\">\n" +
    "                <div class=\"error_pic\"></div>\n" +
    "                <p class=\"mart2\">验证失败！</p>\n" +
    "                <p class=\"padb1 corgray\">您的认证失败次数超过2次！再次认证需要支付手续费。<a href=\"http://duomeidai.com\" class=\"coryellow\">去平台充值并完成认证</a></p>\n" +
    "                \n" +
    "                <div class=\"popover_tcon\">\n" +
    "                    <div class=\"popover fade top in\" role=\"tooltip\" id=\"popover207943\"><div class=\"arrow\"></div><h3 class=\"popover-title\" style=\"display: none;\"></h3><div class=\"popover-content\">只有实名验证成功后，您才可以成为多美经纪人，坐享提成奖励哦！</div></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "           \n" +
    "           	<button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" onclick=\"window.location.href='http://duomeidai.com'\">去平台充值并完成认证</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- step8 客户实名认证成功-->\n" +
    "<div ng-if=\"step==8\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"khzc_lcon\">\n" +
    "                <div class=\"tixian_tip\">\n" +
    "                    <div class=\"zt_pic\"></div>\n" +
    "                    <p class=\"mart1 padb1 bordbot\">您已成为{{brokerUserName}}{{brokerUserMobile|mobilefilter}}的客户，请向商家咨询相关活动。</p>\n" +
    "                    <p class=\"mart1 padb1 corgray\">扫下方二维码或点击\"关注微信\"按钮，跟着多美君的引导来关注官方微信，了解最新动态。</p>\n" +
    "                    <img ng-src=\"{{imgHead}}/img/2weima.jpg\" height=\"140\" alt=\"\" />\n" +
    "                    <p class=\"padb1 corgray\">多美贷微信号</p>\n" +
    "                </div>\n" +
    "               <!--  <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\">关注微信</button> -->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "</div>\n" +
    "<!-- step 商家验证码被使用-->\n" +
    "<div ng-if=\"step==9\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"khzc_lcon\">\n" +
    "                <div class=\"tixian_tip\">\n" +
    "                    <div class=\"warn_pic\"></div>\n" +
    "                    <p class=\"mart1 padb1 bordbot\">该二维码已被{{brokerUserMobile|mobilefilter}}使用</p>\n" +
    "                    <p class=\"mart1 padb1 corgray\">若是本人操作，请直接登录经纪人微信查看个人信息</p>\n" +
    "                    <img ng-src=\"{{imgHead}}/img/2weima.jpg\" height=\"140\" alt=\"\" />\n" +
    "                    <p class=\"padb1 corgray\">经纪人微信号</p>\n" +
    "                    <p class=\"padb1 corgray\">如有疑问请致电多美贷：<span class=\"corblue\">400-885-7027</span></p>\n" +
    "                </div>\n" +
    "                <a href=\"http://www.duomeidai.com\" type=\"submit\" class=\"btn btn-primary btn-lg btn-block\">访问官网</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "</div>\n" +
    "\n" +
    "<!--客户注册认证成功-->\n" +
    "<div ng-if=\"step==-100\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"khzc_lcon\">\n" +
    "                <div class=\"tixian_tip\">\n" +
    "                    <div class=\"zt_pic\"></div>\n" +
    "                    <p class=\"mart1 padb1 bordbot\">您已注册成功，请向商家咨询相关活动。</p>\n" +
    "                    <p class=\"mart1 padb1 corgray\">扫下方二维码或点击\"关注微信\"按钮，跟着多美君的引导来关注官方微信，了解最新动态。</p>\n" +
    "                    <img ng-src=\"{{imgHead}}/img/2weima.jpg\" height=\"140\" alt=\"\" />\n" +
    "                    <p class=\"padb1 corgray\">多美贷微信号</p>\n" +
    "                </div>\n" +
    "                <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\">关注微信</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- 服务协议 -->\n" +
    "<div ng-if=\"step==-1\">\n" +
    "    <div class=\"home_nav\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-12 col-sm-12\"><a ng-click=\"goStep(2)\" class=\"returna floatL\">&lsaquo;</a>服务协议</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pad0\">\n" +
    "        <p class=\"text-left font16\">\"多美贷\"网站（www.duomeidai.com，以下简称\"本网站\"）由多美惠通（北京）网络科技有限公司 （以下简称\"本公司\")负责运营。本服务协议双方为本网站用户与本公司，适用于用户注册使用本网站服务的全部活动。</p>\n" +
    "        <p class=\"text-left font16\">在注册成为本网站用户前，请您务必认真、仔细阅读并充分理解本服务协议全部内容。您在注册本网站取得用户身份时勾选同意本服务协议并成功注册为本网站用户，视为您已经充分理解和同意本服务协议全部内容，并签署了本服务协议，本服务协议立即在您与本公司之间产生合同法律效力，您注册使用本网站服务的全部活动将受到本服务协议的约束并承担相应的责任和义务。如您不同意本服务协议内容，请不要注册使用本网站服务。</p>\n" +
    "        <p class=\"text-left font16\">本服务协议包括以下所有条款，同时也包括本网站已经发布的或者将来可能发布的各类规则。所有规则均为本服务协议不可分割的一部分，与本服务协议具有同等法律效力。</p>\n" +
    "        <p class=\"text-left font16\">用户在此确认知悉并同意本公司有权根据需要不时修改、增加或删减本服务协议。本公司将采用在本网站公示的方式通知用户该等修改、增加或删减，用户有义务注意该等公示。一经本网站公示，视为已经通知到用户。若用户在本服务协议及各类规则变更后继续使用本网站服务的，视为用户已仔细认真阅读、充分理解并同意接受修改后的本服务协议及各类规则，且用户承诺遵守修改后的本服务协议及各类规则内容，并承担相应的义务和责任。若用户不同意修改后的本服务协议及各类规则内容，应立即停止使用本网站服务，本公司保留中止、终止或限制用户继续使用本网站服务的权利，但该等终止、中止或限制行为并不豁免用户在本网站已经进行的交易下所应承担的责任和义务。本公司不承担任何因此导致的法律责任。</p>\n" +
    "        <p class=\"text-left font16\">一. 本网站服务</p>\n" +
    "        <p class=\"text-left font16\">本网站为用户提供【信用咨询、评估、管理，促成用户与本网站其他用户达成交易的居间服务，还款管理等服务】，用户通过本网站居间服务与其他用户达成的所有交易项下资金的存放和移转均通过银行或第三方支付平台机构实现，本网站并不存放交易资金。</p>\n" +
    "        <p class=\"text-left font16\">二. 服务费用</p>\n" +
    "        <p class=\"text-left font16\">用户注册使用本网站服务，本公司有权向用户收取服务费用，具体服务费用以本网站公告或其他协议为准。用户承诺按照本服务协议约定向本网站支付服务费用，并同意本网站有权自其有关账户中直接扣划服务费用。用户通过本网站与其他方签订协议的，用户按照签署的协议约定向其他方支付费用。</p>\n" +
    "        <p class=\"text-left font16\">三. 使用限制</p>\n" +
    "        <p class=\"text-left font16\">1. 注册成为本网站用户必须满足如下主体资格条件：具有中华人民共和国（以下简称\"中国\"）国籍（不包括中国香港、澳门及台湾地区）、年龄在18周岁以上、具有完全民事行为能力的自然人。若不具备前述主体资格条件，请立即终止注册使用本网站服务.若违反前述规定注册使用本网站服务，本公司保留终止用户资格、追究用户或用户的监护人相关法律责任的权利。 </p>\n" +
    "        <p class=\"text-left font16\">2. 用户在注册使用本网站服务时应当根据本网站的要求提供自己的真实信息（包括但不限于真实姓名、联系电话、地址、电子邮箱等信息），并保证向本网站提供的各种信息和资料是真实、准确、完整、有效和合法的，复印件与原件一致。如用户向本网站提供的各项信息和资料发生变更，用户应当及时向本网站更新用户的信息和资料，如因用户未及时更新信息和资料导致本网站无法向用户提供服务或发生错误，由此产生的法律责任和后果由用户自己承担。如使用他人信息和文件注册使用本网站服务或向本网站提供的信息和资料不符合上述规定，由此引起的一切责任和后果均由用户本人全部承担，本公司及本网站不因此承担任何法律责任，如因此而给本公司及本网站造成损失，用户应当承担赔偿本公司及本网站损失的责任。 </p>\n" +
    "        <p class=\"text-left font16\">3. 成功注册为本网站用户后，用户应当妥善保管自己的用户名和密码，不得将用户名转让、赠与或授权给第三方使用。用户在此确认，使用其用户的用户名和密码登录本网站及由用户在本网站的用户账户下发出的一切指令均视为用户本人的行为和意思，该等指令不可逆转，由此产生的一切责任和后果由用户本人承担，本公司及本网站不承担任何责任。 </p>\n" +
    "        <p class=\"text-left font16\">4. 用户不得利用本网站从事任何违法违规活动，用户在此承诺合法使用本网站提供的服务，遵守中国现行法律、法规、规章、规范性文件以及本服务协议的约定。若用户违反上述规定，所产生的一切法律责任和后果与本公司和本网站无关，由用户自行承担，如因此给本公司和本网站造成损失的，由用户赔偿本公司和本网站的损失。本公司保留将用户违法违规行为及有关信息资料进行公示、计入用户信用档案、按照法律法规的规定提供的有关政府部门或按照有关协议约定提供给第三方的权利。 </p>\n" +
    "        <p class=\"text-left font16\">5. 如用户在本网站的某些行为或言论不合法、违反有关协议约定、侵犯本公司的利益等，本公司有权基于独立判断直接删除用户在本网站上作出的上述行为或言论，有权中止、终止、限制用户使用本网站服务，而无需通知用户，亦无需承担任何责任。如因此而给本公司及本网站造成损失的，应当赔偿本公司及本网站的损失。 </p>\n" +
    "        <p class=\"text-left font16\">四. 不保证条款</p>\n" +
    "        <p class=\"text-left font16\">本网站提供的服务中不含有任何明示、暗示的，对任何用户、任何交易的真实性、准确性、可靠性、有效性、完整性等的任何保证和承诺，用户需根据自身风险承受能力，衡量本网站披露的交易内容及交易对方的真实性、可靠性、有效性、完整性，用户因其选择使用本网站提供的服务、参与的交易等而产生的直接或间接损失均由用户自己承担，包括但不限于资金损失、利润损失、营业中断等。本公司及其股东、创始人、全体员工、代理人、关联公司、子公司、分公司均不对以上损失承担任何责任。</p>\n" +
    "        <p class=\"text-left font16\">五. 责任限制</p>\n" +
    "        <p class=\"text-left font16\">1. 基于互联网的特殊性，本公司无法保证本网站的服务不会中断，对于包括但不限于本公司、本网站及相关第三方的设备、系统存在缺陷，计算机发生故障、遭到病毒、黑客攻击或者发生地震、海啸等不可抗力而造成服务中断或因此给用户造成的损失，本公司不承担任何责任，有关损失由用户自己承担。 </p>\n" +
    "        <p class=\"text-left font16\">2. 本公司无义务监测本网站内容。用户对于本网站披露的信息、选择使用本网站提供的服务，选择参与交易等，应当自行判断真实性和承担风险，由此而产生的法律责任和后果由用户自己承担，本公司不承担任何责任。 </p>\n" +
    "        <p class=\"text-left font16\">3. 与本公司合作的第三方机构向用户提供的服务由第三方机构自行负责，本公司不对此等服务承担任何责任。 </p>\n" +
    "        <p class=\"text-left font16\">4. 本网站的内容可能涉及第三方所有的信息或第三方网站，该等信息或第三方网站的真实性、可靠性、有效性等由相关第三方负责，用户对该等信息或第三方网站自行判断并承担风险，与本网站和本公司无关。 </p>\n" +
    "        <p class=\"text-left font16\">5. 无论如何，本公司对用户承担的违约赔偿（如有）总额不超过向用户收取的服务费用总额。 </p>\n" +
    "        <p class=\"text-left font16\">六. 用户资料的使用与披露 </p>\n" +
    "        <p class=\"text-left font16\">1. 用户在此同意，对于用户提供的和本公司为提供本网站服务所需而自行收集的用户个人信息和资料，本公司有权按照本服务协议的约定进行使用或者披露。 </p>\n" +
    "        <p class=\"text-left font16\">2. 用户授权本公司基于履行有关协议、解决争议、调停纠纷、保障本网站用户交易安全的目的等使用用户的个人资料（包括但不限于用户自行提供的以及本公司信审行为所获取的其他资料）。本公司有权调查多个用户以识别问题或解决争议， 特别是本公司可审查用户的资料以区分使用多个用户名或别名的用户。 </p>\n" +
    "        <p class=\"text-left font16\">为避免用户通过本网站从事欺诈、非法或其他刑事犯罪活动，保护本网站及其正常用户合法权益，用户授权本公司可通过人工或自动程序对用户的个人资料进行评价和衡量。</p>\n" +
    "        <p class=\"text-left font16\">用户同意本公司可以使用用户的个人资料以改进本网站的推广和促销工作、分析网站的使用率、改善本网站的内容和产品推广形式，并使本网站内容、设计和服务更能符合用户的要求。这些使用能改善本网站的网页，以调整本网站网页使其更能符合用户的需求，从而使用户在使用本网站服务时得到更为顺利、有效、安全及度身订造的交易体验。</p>\n" +
    "        <p class=\"text-left font16\">用户在此同意允许本公司通过在本网站的某些网页上使用诸如\"Cookies\"的设置收集用户信息并进行分析研究，以为用户提供更好的量身服务。 </p>\n" +
    "        <p class=\"text-left font16\">3. 本公司有义务根据有关法律、法规、规章及其他政府规范性文件的要求向司法机关和政府部门提供用户的个人资料及交易信息。</p>\n" +
    "        <p class=\"text-left font16\">在用户未能按照与本公司签订的包括但不限于本服务协议或者与本网站其他用户签订的借款协议等其他法律文本的约定履行自己应尽的义务时，本公司有权将用户提供的及本公司自行收集的用户的个人信息、违约事实等通过网络、报刊、电视等方式对任何第三方披露，且本公司有权将用户提交或本公司自行收集的用户的个人资料和信息与任何第三方进行数据共享，以便对用户的其他申请进行审核等使用。由此而造成用户损失的，本公司不承担法律责任。 </p>\n" +
    "        <p class=\"text-left font16\">4. 本公司采用行业标准惯例以保护用户的个人信息和资料，鉴于技术限制，本公司不能确保用户的全部私人通讯及其他个人资料不会通过本条款中未列明的途径泄露出去。 </p>\n" +
    "        <p class=\"text-left font16\">七. 知识产权保护条款</p>\n" +
    "        <p class=\"text-left font16\">1. 本网站中的所有内容均属于本公司所有,包括但不限于文本、数据、文章、设计、源代码、软件、图片、照片、音频、视频及其他全部信息。本网站内容受中国知识产权法律法规及各国际版权公约的保护。</p>\n" +
    "        <p class=\"text-left font16\">2. 未经本公司事先书面同意,用户承诺不以任何形式复制、模仿、传播、出版、公布、展示本网站内容,包括但不限于电子的、机械的、复印的、录音录像的方式和形式等。用户承认本网站内容是属于本公司的财产。</p>\n" +
    "        <p class=\"text-left font16\">3. 未经本公司书面同意,用户不得将本网站包含的资料等任何内容发布到任何其他网站或者服务器。任何未经授权对本网站内容的使用均属于违法行为,本公司有权追究用户的法律责任。</p>\n" +
    "        <p class=\"text-left font16\">八. 违约责任 </p>\n" +
    "        <p class=\"text-left font16\">如一方发生违约行为，守约方可以书面通知方式要求违约方在指定的时限内停止违约行为，并就违约行为造成的损失要求违约方进行赔偿。</p>\n" +
    "        <p class=\"text-left font16\">九. 法律适用及争议解决 </p>\n" +
    "        <p class=\"text-left font16\">1. 本服务协议的签订、效力、履行、终止、解释和争端解决受中国法律法规的管辖。 </p>\n" +
    "        <p class=\"text-left font16\">2. 因本服务协议发生任何争议或与本服务协议有关的争议，首先应由双方友好协商解决，协商不成的，任何一方有权将纠纷提交至本公司所在地有管辖权的人民法院诉讼解决。 </p>\n" +
    "        <p class=\"text-left font16\">十. 其他条款 </p>\n" +
    "        <p class=\"text-left font16\">1. 本服务协议自您同意勾选并成功注册为本网站用户之日起生效，除非本网站终止本服务协议或者用户丧失本网站用户资格，否则本服务协议始终有效。本服务协议终止并不免除用户根据本服务协议或其他有关协议、规则所应承担的义务和责任。 </p>\n" +
    "        <p class=\"text-left font16\">2. 本公司对于用户的违约行为放弃行使本服务协议规定的权利的，不得视为其对用户的其他违约行为放弃主张本服务协议项下的权利。 </p>\n" +
    "        <p class=\"text-left font16\">3. 本服务协议部分条款被认定为无效时，不影响本服务协议其他条款的效力。 </p>\n" +
    "        <p class=\"text-left font16\">4. 本服务协议不涉及用户与本网站其他用户之间因网上交易而产生的法律关系及法律纠纷，但用户在此同意将全面接受和履行与本网站其他用户通过本网站签订的任何电子法律文本，并承诺按该法律文本享有和/或放弃相应的权利、承担和/或豁免相应的义务。 </p>\n" +
    "        <p class=\"text-left font16\">5. 本公司对本服务协议享有最终的解释权。 </p>\n" +
    "    </div>\n" +
    "    \n" +
    "   <div class=\"padt2\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/brokerfront/templates/public.qrcode.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/public.qrcode.html",
    "<div class=\"home_nav\">\n" +
    "	<div class=\"row\">\n" +
    "    	<div class=\"col-xs-12 col-sm-12\"><a href=\"/p/u/menu/index\" class=\"homea floatL\">home</a>我的邀请码</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row text-center padt2\">\n" +
    "	<div class=\"col-xs-12 col-sm-12\"><!-- <div id=\"qrcode\" style=\"width:140px;margin:auto;\"></div> --><img ng-src=\"{{inviteQrCode}}\" width=\"140px\"></div>\n" +
    "</div>\n" +
    "<div class=\"yqmlist\">\n" +
    "	<ul>\n" +
    "    	<li>\n" +
    "            <p>邀请代码</p>\n" +
    "            <p>{{code}}</p>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <p>邀请链接</p>\n" +
    "            <p><a href=\"{{url}}\">{{url}}</a></p>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("modules/brokerfront/templates/public.withdraw.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/brokerfront/templates/public.withdraw.html",
    "<!--提现提交弹窗-->\n" +
    "      <div class=\"windpub tixian_tip\" ng-if=\"show\">\n" +
    "          <div class=\"windpubcon\">\n" +
    "              <div class=\"zt_pic\"></div>\n" +
    "              <p>提现申请已提交，请等待审核！</p>\n" +
    "          </div>\n" +
    "      </div>\n" +
    "    \n" +
    "      <div class=\"home_nav\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-12 col-sm-12\"><a href=\"/p/u/menu/index\" class=\"homea floatL\">home</a>提现</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    <div ng-if=\"entity.bindBankCard==1&&step==1\">\n" +
    "      \n" +
    "        <div class=\"tcaccount\">\n" +
    "          <div class=\"floatL lpic\"></div>\n" +
    "            <div class=\"floatL rtxtnub\">\n" +
    "              <div class=\"usrlei\"><span class=\"floatL\">提成账户</span><a ng-click=\"tipsShow()\" class=\"floatL\">?</a></div>\n" +
    "                <div class=\"ramount\"><span>{{entity.usableSum|moneyfilter}}</span>元</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"tznublist tx_bank\">\n" +
    "          <div class=\"row\">\n" +
    "              <div class=\"col-xs-6 col-sm-5 text-right\">\n" +
    "\n" +
    "              </div>\n" +
    "                <div class=\"col-xs-6 col-sm-7 text-left\">\n" +
    "                  <p>{{entity.cardNo|bankfilter}}</p>\n" +
    "                  <p>{{entity.bankName}}</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"from_1 padt2 txfrom\">\n" +
    "            <form class=\"form-horizontal\" role=\"form\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"text\" onKeypress=\"return (/[\\d.]/.test(String.fromCharCode(event.keyCode)))\" class=\"form-control\" ng-model=\"params.money\" placeholder=\"输入提现金额\">\n" +
    "                </div>\n" +
    "                <div class=\"regis_tip\"><span class=\"floatL\">提现费用：3.00元</span><span class=\"floatR\">实际扣除：{{params.money*1+3|moneyfilter}}元</span></div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"password\" class=\"form-control\" ng-model=\"params.dealpwd\" placeholder=\"输入交易密码\">\n" +
    "                </div>\n" +
    "                <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"widthDraw()\" ng-model=\"btnEnable\" ng-disabled=\"!btnEnable\">确认提现</button>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "\n" +
    "    </div> \n" +
    "\n" +
    "\n" +
    "\n" +
    "  <div ng-if=\"entity&&entity.bindBankCard!=1\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"khzc_lcon\">\n" +
    "        <div class=\"tixian_tip\">\n" +
    "            <div class=\"zt_pic error_pic\"></div>\n" +
    "            <p class=\"mart2\">未绑定银行卡！</p>\n" +
    "            <p class=\"padb1 corgray\">请先在多美贷平台（www.duomeidai.com）绑定银行卡，再进行提现操作</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-if=\"step==2\"></div>\n" +
    "\n" +
    "  <div class=\"row\" ng-if=\"step==2\">\n" +
    "    <div class=\"khzc_lcon\">\n" +
    "          <div class=\"tixian_tip\">\n" +
    "              <div class=\"zt_pic\"></div>\n" +
    "              <p class=\"marb3 mart2\">恭喜您已成功提现{{params.money|moneyfilter}}元，请注意查收!</p>\n" +
    "          </div>\n" +
    "          <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ui-sref=\"brokerfront.account({role:0})\">我的账户</button>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    ");
}]);
