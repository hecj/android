/*! weixin - v0.1.0 - 2014-12-19
* Copyright (c) 2014 lovemoon@yeah.net; Licensed GPLv2 */
var callback=function(res) {
	__callback__=res;
}
// Initialize
var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'angular-growl', 'templates', 'homeModule', 'registerModule', 'decorateModule', 'redEnvelopeModule']);

// bootstrap
angular.element(document).ready(function () {
	angular.bootstrap(document, ['app']);
});
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
app.run(['$rootScope','$timeout',
  function ($rootScope,$timeout) {
    $rootScope.$on('$stateChangeSuccess', function (event, state) {
      $rootScope.isHome = state.name === 'home';
    });

    var count=0
    var timeout = function() {
      $rootScope.footer=count%3;
      count++;
      timer = $timeout(timeout, 4000);
    }
    timeout();
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
app.factory('overAll', ['$http', function($http){
	return{
		totalCustomer:function(argument) {
			
		}
	};
}])
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
// define module
var decorateModule = angular.module('decorateModule', ['ui.router', 'ui.bootstrap']);

// config router
decorateModule.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/decorate', '/decorate/houses');

    $stateProvider
      .state('decorate', {
        abstract: true,
        url: "/decorate",
        templateUrl: "modules/decorate/templates/decorate.html"
      })
      .state('decorate.houses', { // 列出房产
        url: "/houses",
        controller: 'housesController',
        templateUrl: "modules/decorate/templates/houses.html"
      })
      .state('decorate.invitation', { // 申请装修
        url: "/invitation/{houseId:[0-9]+}",
        controller: 'invitationController',
        templateUrl: "modules/decorate/templates/invitation.html"
      })
      .state('decorate.reference', { // 装修公司备案
        url: "/reference",
        controller: 'referenceController',
        templateUrl: "modules/decorate/templates/reference.html"
      })
      .state('decorate.history', { // 查看装修历史
        url: "/history",
        controller: 'historyController',
        templateUrl: "modules/decorate/templates/history.html"
      })
      .state('decorate.progress', { // 查看装修进度
        url: "/progress/{decorateId:[0-9]+}",
        controller: 'progressController',
        templateUrl: "modules/decorate/templates/progress.html"
      })
      .state('decorate.drawing', { // 上传装修图纸
        url: "/drawing/{decorateId:[0-9]+}",
        controller: 'drawingController',
        templateUrl: "modules/decorate/templates/drawing.html"
      })
      .state('decorate.confirm', { // 现场三方确认
        url: "/confirm/{decorateId:[0-9]+}",
        controller: 'confirmController',
        templateUrl: "modules/decorate/templates/confirm.html"
      })
      .state('decorate.acceptance', { // 验收装修工程
        url: "/acceptance/{decorateId:[0-9]+}",
        controller: 'acceptanceController',
        templateUrl: "modules/decorate/templates/acceptance.html"
      })
      .state('decorate.refund', { // 现场三方确认
        url: "/refund/{decorateId:[0-9]+}",
        controller: 'refundController',
        templateUrl: "modules/decorate/templates/refund.html"
      })
      .state('decorate.notice', { // 通知抽象路由
        abstract: true,
        url: "/notice",
        template: '<div class="notice" ui-view></div>'
      })
      .state('decorate.notice.initiate', { // 通知：发送申请成功
        url: "/initiate/{decorateId:[0-9]+}",
        controller: 'noticeController',
        templateUrl: "modules/decorate/templates/notice-initiate.html"
      })
      .state('decorate.notice.drawing', { // 通知：上传装修图纸
        url: "/drawing/{decorateId:[0-9]+}",
        controller: 'noticeController',
        templateUrl: "modules/decorate/templates/notice-drawing.html"
      })
      .state('decorate.notice.acceptance', { // 通知：已经发送验收申请
        url: "/acceptance/{decorateId:[0-9]+}",
        controller: 'noticeController',
        templateUrl: "modules/decorate/templates/notice-acceptance.html"
      })
      .state('decorate.notice.refund', { // 通知：退款申请已发出
        url: "/refund/{decorateId:[0-9]+}",
        controller: 'noticeController',
        templateUrl: "modules/decorate/templates/notice-refund.html"
      });
  }
]);
// define module
var homeModule = angular.module('homeModule', ['ui.router', 'ui.bootstrap']);

// config router
homeModule.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: "/home",
        controller: 'homeController',
        templateUrl: "modules/home/templates/home.html"
      })
      .state('config', {
        url: "/config",
        controller: 'configController',
        templateUrl: "modules/home/templates/config.html"
      });
  }
]);
// define module
var redEnvelopeModule = angular.module('redEnvelopeModule', ['ui.router', 'ui.bootstrap']);

// config router
redEnvelopeModule.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/redenvelope/getSeed");

    $stateProvider
      .state('redenvelope', {
        url: '/redenvelope',
        "abstract": true,
        template: "<div ui-view></div>"
      })
      .state('redenvelope.getSeed', {
        url: "/getSeed",
        controller: 'getSeedController',
        templateUrl: "modules/redenvelope/templates/getSeed.html"
      })
      .state('redenvelope.myinfo', {
        url: "/myinfo/{friendId}/{friendNick}",
        controller: 'myinfoController',
        templateUrl: "modules/redenvelope/templates/myinfo.html"
      })
      .state('redenvelope.friend', {
        url: "/friend/{friendId}",
        controller: 'friendController',
        templateUrl: "modules/redenvelope/templates/friend.html"
      })
      .state('redenvelope.myjab', {
        url: "/myjab",
        controller: 'myjabController',
        templateUrl: "modules/redenvelope/templates/myjab.html"
      })
      .state('redenvelope.jabme', {
        url: "/jabme",
        controller: 'jabmeController',
        templateUrl: "modules/redenvelope/templates/jabme.html"
      })
      .state('redenvelope.myachivement', {
        url: "/myachivement{tab:[0-9]+}",
        controller: 'myachivementController',
        templateUrl: "modules/redenvelope/templates/myachivement.html"
      })
      .state('redenvelope.rule', {
        url: "/rule",
        controller: 'ruleController',
        templateUrl: "modules/redenvelope/templates/rule.html"
      })
      .state('redenvelope.regist', {
        url: "/regist",
        controller: 'registController',
        templateUrl: "modules/redenvelope/templates/regist.html"
      })
      .state('redenvelope.realname', {
        url: "/realname",
        controller: 'realnameController',
        templateUrl: "modules/redenvelope/templates/realname.html"
      })
      .state('redenvelope.regsuccess', {
        url: "/regsuccess/{regtype:[0-9]+}/{extra}",
        controller: 'regsuccessController',
        templateUrl: "modules/redenvelope/templates/regsuccess.html"
      })
      .state('redenvelope.actend', {
        url: "/active_end",
        controller: 'actendController',
        templateUrl: "modules/redenvelope/templates/active_end.html"
      })
      .state('redenvelope.agreement', {
        url: "/agreement",
        controller: 'agreementController',
        templateUrl: "modules/redenvelope/templates/agreement.html"
      });
  }
]);
// define module
var registerModule = angular.module('registerModule', ['ui.router', 'ui.bootstrap']);

// config router
registerModule.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when("/register", "/register/mobile");

    $stateProvider
      .state('register.regist', {
        abstract: true,
        url: "/register/regist",
        controller: 'registController',
        templateUrl: "modules/register/templates/regist.html"
      })
      .state('register.realname', {
        url: "/realname",
        controller: 'realnameController',
        templateUrl: "modules/register/templates/realname.html"
      });
  }
]);
// 列出房产列表
decorateModule.controller('housesController', ['$scope', '$state', 'decorateService',
  function ($scope, $state, service) {
    // 请求房子
    service.getHouses().then(function (res) {
      // 根据房子的小区分组
      var groups = {};
      for (var i = 0; i < res.houses.length; i++) {
        var house = res.houses[i];
        if (!groups[house.community]) {
          groups[house.community] = [];
        }
        groups[house.community].push(house);
      }

      $scope.groups = groups;
    }, function () {});

  }
]);

// 发起装修流程
decorateModule.controller('invitationController', ['$scope', '$state', '$stateParams', '$q', 'decorateService',
  function ($scope, $state, $params, $q, service) {
    $q.all([service.getHouse($params.houseId), service.getProviders()]).then(function (list) {
      // 赋值房产信息和供应商信息
      $scope.house = list[0].house;
      $scope.providers = list[1].providers;

      // 提交表单处理
      $scope.submitRequest = function () {
        service.sendInvitation($scope.house.id, $scope.provider.id, $scope.date).then(function (res) {
          $state.go('decorate.notice.initiate', {
            decorateId: res.decorateId
          });
        }, function () {});
      };
    }, function () {});
  }
]);

// 查看装修进度
decorateModule.controller('progressController', ['$scope', '$state', '$stateParams', 'decorateService',
  function ($scope, $state, $params, service) {
    service.getProgress($params.decorateId).then(function (res) {
      $scope.progress = res.progress;
      $scope.decorateId = $params.decorateId;
    }, function () {});
  }
]);

// 查看备案说明
decorateModule.controller('referenceController', ['$scope', '$state', 'decorateService',
  function ($scope, $state, service) {
    // TODO
  }
]);

// 查看装修历史
decorateModule.controller('historyController', ['$scope', '$state', 'decorateService',
  function ($scope, $state, service) {
    service.getHistory().then(function (res) {
      $scope.decorates = res.decorates;
    }, function () {});
  }
]);

// 上传图纸界面
decorateModule.controller('drawingController', ['$scope', '$state', '$stateParams', 'decorateService',
  function ($scope, $state, $params, service) {
    $scope.manualSubmit = function () {
      service.sendManualSubmit().then(function () {
        $state.go('decorate.notice.drawing', {
          decorateId: $params.decorateId
        });
      }, function () {});
    };
  }
]);

// 通用通知
decorateModule.controller('noticeController', ['$scope', '$state', '$stateParams', 'decorateService',
  function ($scope, $state, $params, service) {
    service.getDecorate($params.decorateId).then(function (res) {
      $scope.decorate = res.decorate;
    }, function () {});
  }
]);

// 三方现场进行装修确认
decorateModule.controller('confirmController', ['$scope', '$state', '$stateParams', 'decorateService',
  function ($scope, $state, $params, service) {
    $scope.total = 0;

    service.getCharge($params.decorateId).then(function (res) {
      $scope.charge = res.charge;
      angular.forEach($scope.charge.deposit, function (item) {
        $scope.total += item.money;
      });
      angular.forEach($scope.charge.expense, function (item) {
        $scope.total += item.money;
      });
    }, function () {});
  }
]);

// 验收房产
decorateModule.controller('acceptanceController', ['$scope', '$state', '$stateParams', 'decorateService',
  function ($scope, $state, $params, service) {
    $scope.submitVerify = function () {
      service.sendVerify($params.decorateId).then(function (res) {
        $state.go('decorate.notice.acceptance', {
          decorateId: $params.decorateId
        });
      }, function () {});
    };
  }
]);

// 申请退款
decorateModule.controller('refundController', ['$scope', '$state', '$stateParams', 'decorateService',
  function ($scope, $state, $params, service) {

    $scope.repay = 0;

    service.getCharge($params.decorateId).then(function (res) {
      $scope.charge = res.charge;
      angular.forEach($scope.charge.deposit, function (item) {
        $scope.repay += item.money;
      });
    }, function () {});

    $scope.submitRefund = function () {
      service.sendRefund($params.decorateId).then(function (res) {
        $state.go('decorate.notice.refund', {
          decorateId: $params.decorateId
        });
      }, function () {});
    };
  }
]);
// 显示装修进度 因为需分三段显示
decorateModule.directive('decorateProgress', ['$filter', '$state',
  function ($filter, $state) {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'modules/decorate/templates/decorate-progress.partial.html',
      scope: {
        stage: '@',
        items: '=',
        decorateId: '='
      },
      link: function (scope, element, attrs) {
        var section = {
          before: ['S10', 'S40'],
          process: ['S50', 'S50'],
          after: ['S60', 'S90']
        };

        var routers = {
          before: {
            'S10': '', // 已经申请等待装修供应商响应
            'S20': 'decorate.drawing', // 业主和装修供应商握手成功 -> 上传图纸
            'S30': '', // 已经上传图纸等待审核
            'S40': '' // 申请阶段全部完成
          },
          process: {
            'S40': 'decorate.confirm', // 申请流程完成后需现场确认签字
            'S50': '' // 装修中...
          },
          after: {
            'S50': 'decorate.acceptance', // 如果装修完成可以申请验收
            'S60': '', // 已申请验收待响应
            'S70': '', // 验收已响应待通过
            'S80': 'decorate.refund', // 已经验收等待退款
            'S90': '' // 退款完成
          }
        };

        scope.$watch('items', function (items) {
          if (angular.isArray(items) && items.length > 0) {

            // 仅显示需要的分组
            for (var i = 0; i < items.length; i++) {
              if (items[i].status === section[scope.stage][0]) {
                break;
              }
            }
            for (var j = items.length - 1; j >= 0; j--) {
              if (items[j].status === section[scope.stage][1]) {
                break;
              }
            }
            j = j + 1 || items.length; // 如果j = -1,j = length
            scope.group = items.slice(i, j);

            // 引导下一步
            var current = items[items.length - 1].status;
            if (current >= section[scope.stage][1]) {
              scope.action = '已办理';
              scope.muted = true;
            }
            else {
              scope.action = $filter('decorateGuide')(current, scope.stage);
            }
          }
        });

        scope.nextStep = function () {
          var myrange = section[scope.stage][1];
          var current = scope.items[scope.items.length - 1].status;
          var sref = routers[scope.stage][current];
          if (myrange > current && sref) {
            $state.go(sref, {
              decorateId: scope.decorateId
            });
          }
        };
      }
    };
  }
]);
// 将房屋状态转换为可读文字
decorateModule.filter('houseStatus', function () {
  var dict = {
    0: '申请装修',
    1: '正在装修',
    2: '已经装修'
  };
  return function (status) {
    return dict[status] || '不明状况';
  };
});

// 将装修状态转换为可读文字
decorateModule.filter('decorateStatus', function () {
  var dict = {
    'S10': '待装修公司握手',
    'S20': '待提交图纸',
    'S30': '图纸审核中',
    'S40': '待办装修许可',
    'S50': '已办许可待验收',
    'S60': '已申请验收待响应',
    'S70': '验收已响应待通过',
    'S80': '已验收待退款',
    'S90': '已退款',
    'SCANCEL': '申请取消'
  };

  return function (status) {
    return dict[status.toUpperCase()] || '不明状况';
  };
});

// 将装修状态转换为可读文字
decorateModule.filter('decorateGuide', function () {
  var dict = {
    before: {
      "S10": "等待握手",
      "S20": "提交图纸",
      "S30": "审核中",
      "S40": "已办理"
    },
    process: {
      "S40": "查看",
      "S50": "已办理"
    },
    after: {
      "S50": "申请验收",
      "S60": "申请中",
      "S70": "审核中",
      "S80": "申请退款",
      "S90": "已办理"
    }
  };

  return function (status, group) {
    return dict[group][status] || '';
  };
});
decorateModule.factory('decorateService', ['$http',
  function ($http) {

    return {

      // 获取业主房产明细
      getHouses: function () {
        return $http({
          url: 'interface/decorate/houses.json',
          method: 'get'
        });
      },

      // 获取装修进度信息
      getProgress: function (decorateId) {
        return $http({
          url: 'interface/decorate/progress.json',
          method: 'get',
          params: {
            decorateId: decorateId
          }
        });
      },

      // 获取供应商列表
      getProviders: function () {
        return $http({
          url: 'interface/decorate/providers.json',
          method: 'get'
        });
      },

      // 获取房屋信息
      getHouse: function (id) {
        return $http({
          url: 'interface/decorate/house.json',
          method: 'get',
          params: {
            id: id
          }
        });
      },

      // 获得装修详情
      getDecorate: function (id) {
        return $http({
          url: 'interface/decorate/decorate.json',
          method: 'get',
          params: {
            id: id
          }
        });
      },

      // 获得业主装修历史
      getHistory: function () {
        return $http({
          url: 'interface/decorate/history.json',
          method: 'get'
        });
      },

      // 发送装修申请
      sendInvitation: function (houseId, decorateId, date) {
        return $http({
          url: 'interface/decorate/invitation.json',
          method: 'post',
          data: {
            houseId: houseId,
            decorateId: decorateId,
            date: date
          }
        });
      },

      // 发送提交图纸通知
      sendManualSubmit: function (decorateId) {
        return $http({
          url: 'interface/decorate/success.json',
          method: 'post',
          data: {
            decorateId: decorateId
          }
        });
      },

      // 获取装修账单
      getCharge: function (decorateId) {
        return $http({
          url: 'interface/decorate/charge.json',
          method: 'get',
          params: {
            decorateId: decorateId
          }
        });
      },

      // 验收装修工程
      sendVerify: function (decorateId) {
        return $http({
          url: 'interface/decorate/verify.json',
          method: 'post',
          data: {
            decorateId: decorateId
          }
        });
      },

      // 申请退款
      sendRefund: function (decorateId) {
        return $http({
          url: 'interface/decorate/success.json',
          method: 'post',
          data: {
            decorateId: decorateId
          }
        });
      }

    };
  }
]);
angular.module('templates', ['common/templates/layout.partials.html', 'modules/decorate/templates/acceptance.html', 'modules/decorate/templates/confirm.html', 'modules/decorate/templates/decorate-progress.partial.html', 'modules/decorate/templates/decorate.html', 'modules/decorate/templates/drawing.html', 'modules/decorate/templates/history.html', 'modules/decorate/templates/houses.html', 'modules/decorate/templates/invitation.html', 'modules/decorate/templates/notice-acceptance.html', 'modules/decorate/templates/notice-drawing.html', 'modules/decorate/templates/notice-initiate.html', 'modules/decorate/templates/notice-refund.html', 'modules/decorate/templates/progress.html', 'modules/decorate/templates/reference.html', 'modules/decorate/templates/refund.html']);

angular.module("common/templates/layout.partials.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/templates/layout.partials.html",
    "<!-- <a href=\"/index2.jsp?v=1\" style=\"font-size:40px;\">接口</a> -->\n" +
    " <div class=\"container posit\">\n" +
    "	<div ui-view class=\"bigbox\">\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "      <div class=\"footer\">\n" +
    "          <div class=\"row\" ng-if=\"footer==0\">\n" +
    "            <div class=\"col-xs-12 col-sm-12 col-md-12\">\n" +
    "                <a href=\"http://www.duomeidai.com\"><div class=\"pull-left fot-logo FadeInR\"></div></a>\n" +
    "                <h4 class=\"pull-right FadeInR\"  style=\"-webkit-animation-delay: 0.2s\">实现平凡人的财富梦想</h4>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"row\" ng-if=\"footer==1\">\n" +
    "            <div class=\"col-xs-12 col-sm-12 col-md-12\"><p><span class=\"FadeInR\">不以过高收益来吸引用户</span><br/><span class=\"FadeInR\"  style=\"-webkit-animation-delay: 0.2s\">不因资金站岗而放松风控</span></p></div>\n" +
    "          </div>\n" +
    "          <div class=\"row\" ng-if=\"footer==2\">\n" +
    "            <div class=\"col-xs-12 col-sm-12 col-md-12 FadeInR\"><p>关注\"多美惠通多美贷\"，寻找更多好戳友</p></div>\n" +
    "          </div>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div id=\"errBox\"> \n" +
    "	<div id=\"errBoxShadow\"></div>\n" +
    "	<div id=\"errBoxText\"></div>\n" +
    "</div>");
}]);

angular.module("modules/decorate/templates/acceptance.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/acceptance.html",
    "<div class=\"request\">\n" +
    "  <form name=\"acceptanceForm\" ng-submit=\"submitVerify()\">\n" +
    "    <dl class=\"terms\">\n" +
    "      <dt class=\"small text-light\">您的装修公司</dt>\n" +
    "      <dd class=\"simulate-control\">某某某装修公司</dd>\n" +
    "    </dl>\n" +
    "    <dl class=\"terms\">\n" +
    "      <dt class=\"small text-light\">您的个人信息</dt>\n" +
    "      <dd class=\"simulate-control clearfix\">\n" +
    "        <span class=\"pull-left\">张三先生</span>\n" +
    "        <span class=\"pull-right text-lighter\">186****5297</span>\n" +
    "      </dd>\n" +
    "    </dl>\n" +
    "    <dl class=\"terms\">\n" +
    "      <dt class=\"small text-light\">您的装修房间</dt>\n" +
    "      <dd class=\"simulate-control\">\n" +
    "        炫特嘉园3C1905\n" +
    "      </dd>\n" +
    "    </dl>\n" +
    "    <dl class=\"terms\">\n" +
    "      <dt class=\"small text-light\">您希望的验收日期</dt>\n" +
    "      <dd>\n" +
    "        <input class=\"form-control\" type=\"date\" ng-model=\"date\"  placeholder=\"选择验收日期\" required />\n" +
    "      </dd>\n" +
    "    </dl>\n" +
    "    <div class=\"full-width\" style=\"position:absolute;bottom:10px;padding: 0 15px;\">\n" +
    "      <button type=\"submit\" class=\"btn btn-primary full-width\" ng-disabled=\"acceptanceForm.$invalid\">申请验收</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>");
}]);

angular.module("modules/decorate/templates/confirm.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/confirm.html",
    "<div id=\"reference\">\n" +
    "  <div class=\"main text-light\">\n" +
    "    <p>请和您委托的装修公司负责人共同到物业办理装修入场许可。需携带材料如下：</p>\n" +
    "    <dl class=\"indent\">\n" +
    "      <dt class=\"text-default\">您的个人信息材料：</dt>\n" +
    "      <dd>- 身份证原件</dd>\n" +
    "      <dd>- 购房合同</dd>\n" +
    "    </dl>\n" +
    "    <dl class=\"indent\">\n" +
    "      <dt class=\"text-default\">装修公司信息材料：</dt>\n" +
    "      <dd>- 营业执照</dd>\n" +
    "      <dd>- 现场负责人身份证原件</dd>\n" +
    "    </dl>\n" +
    "    <dl class=\"indent\">\n" +
    "      <dt class=\"text-default\">手续费用：</dt>\n" +
    "      <dd>- 您需缴纳的费用合计为：￥{{ total|number:2 }}</dd>\n" +
    "      <dd>\n" +
    "        <span class=\"tiny text-muted details\">\n" +
    "          ( 包括：\n" +
    "          <span class=\"item\" ng-repeat=\"item in charge.deposit\">{{ item.name }} ￥{{ item.money|number:2 }}</span>\n" +
    "          <span class=\"item\" ng-repeat=\"item in charge.expense\">{{ item.name }} ￥{{ item.money|number:2 }}</span>)\n" +
    "        </span>\n" +
    "      </dd>\n" +
    "    </dl>\n" +
    "    <dl class=\"indent\">\n" +
    "      <dt class=\"text-default\">现场需要您签字确认：</dt>\n" +
    "      <dd>- 您的装修图纸</dd>\n" +
    "      <dd>- 装修授权委托书</dd>\n" +
    "      <dd>- 其他相关装修规定</dd>\n" +
    "    </dl>\n" +
    "  </div>\n" +
    "  <div class=\"full-width\" style=\"position:absolute;bottom:10px;padding: 0 15px;\">\n" +
    "    <a type=\"submit\" class=\"btn btn-primary full-width\" href=\"tel:010-60238889\">预约办理装修许可: 010-60238889</a>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("modules/decorate/templates/decorate-progress.partial.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/decorate-progress.partial.html",
    "<dd>\n" +
    "  <a class=\"desc\" ng-click=\"nextStep(item)\">\n" +
    "    <span class=\"status pull-right\" ng-hide=\"!action\" ng-class=\"{'text-light': muted}\">{{ action }}</span>\n" +
    "    <span class=\"apartment text-default\" ng-transclude></span>\n" +
    "  </a>\n" +
    "  <ul class=\"list-unstyled text-muted small\" ng-if=\"group\">\n" +
    "    <li class=\"clearfix\" ng-repeat=\"item in group\">\n" +
    "      <span class=\"pull-left\">{{ item.time|date:'yyyy-MM-dd HH:mm' }}</span>\n" +
    "      <span class=\"pull-right\">{{ item.status|decorateStatus }}</span>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</dd>\n" +
    "\n" +
    "");
}]);

angular.module("modules/decorate/templates/decorate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/decorate.html",
    "<div id=\"decorate\" ui-view></div>");
}]);

angular.module("modules/decorate/templates/drawing.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/drawing.html",
    "<div class=\"drawing\">\n" +
    "  <h5 class=\"small text-light\">提交装修图纸方式：</h5>\n" +
    "  <a class=\"btn btn-success full-width\">1）在线提交装修图纸</a>\n" +
    "  <a class=\"btn btn-primary full-width\" ng-click=\"manualSubmit()\">2）装修公司现场提交</a>\n" +
    "</div>");
}]);

angular.module("modules/decorate/templates/history.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/history.html",
    "<div class=\"history\">\n" +
    "  <a class=\"text-default\" ui-sref=\"decorate.progress({decorateId: decorate.id})\" ng-repeat=\"decorate in decorates\">\n" +
    "    <dl class=\"terms tiny\">\n" +
    "      <dt class=\"clearfix\">\n" +
    "        <span class=\"pull-left text-light\">序列号：{{ decorate.id }}</span>\n" +
    "        <span class=\"pull-right text-warning\">{{ decorate.status|decorateStatus }}</span>\n" +
    "      </dt>\n" +
    "      <dd class=\"simulate-control\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "          <div class=\"row\">\n" +
    "            <div class=\"col-xs-6 col-sm-6 text-overflow\">\n" +
    "              <span class=\"text-muted\">社区：</span>{{ decorate.buildingName }}\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6 col-sm-6\">\n" +
    "              <span class=\"text-muted\">申请日期：</span>{{ decorate.time|date:'yyyy-MM-dd' }}\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </dd>\n" +
    "      <dd class=\"simulate-control text-overflow\"><span class=\"text-muted\">申请人：</span>{{ decorate.userName }} {{ decorate.userMobile }} @{{ decorate.roomName }}</dd>\n" +
    "      <dd class=\"simulate-control text-overflow\"><span class=\"text-muted\">装修公司：</span>{{ decorate.provider }}</dd>\n" +
    "    </dl>\n" +
    "  </a>\n" +
    "</div>");
}]);

angular.module("modules/decorate/templates/houses.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/houses.html",
    "<div class=\"have-house\" ng-if=\"!(groups|empty)\">\n" +
    "  <dl class=\"terms\" ng-repeat=\"(community, houses) in groups\">\n" +
    "    <dt class=\"small text-light\">{{ community }}</dt>\n" +
    "    <dd ng-repeat=\"house in houses\">\n" +
    "      <a class=\"desc\" ng-if=\"house.decorateId\" ui-sref=\"decorate.progress({decorateId: house.decorateId})\">\n" +
    "        <span class=\"status pull-right\" ng-class=\"{'text-muted': house.status === 2}\">{{ house.status|houseStatus }}</span>\n" +
    "        <span class=\"apartment text-overflow text-default\">{{ house.apartment }}</span>\n" +
    "      </a>\n" +
    "      <a class=\"desc\" ng-if=\"!house.decorateId\" ui-sref=\"decorate.invitation({houseId: house.id})\">\n" +
    "        <span class=\"status pull-right\" ng-class=\"{'text-muted': house.status === 2}\">{{ house.status|houseStatus }}</span>\n" +
    "        <span class=\"apartment text-overflow text-default\">{{ house.apartment }}</span>\n" +
    "      </a>\n" +
    "    </dd>\n" +
    "  </dl>\n" +
    "  <div class=\"correction small text-muted\">\n" +
    "    <p>房间信息不对？</p>\n" +
    "    <p>请联系客服确认：<a href=\"tel:01060898888\">010-60898888</a></p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"havent-house\" ng-if=\"groups|empty\">\n" +
    "  <div class=\"correction small\">\n" +
    "    <p>啊哦，系统未搜索到与您相关的房间信息~ <br />其实您有相关的房间？</p>\n" +
    "    <p>请联系客服确认：<a href=\"tel:01060898888\">010-60898888</a></p>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("modules/decorate/templates/invitation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/invitation.html",
    "<div class=\"request\">\n" +
    "  <form name=\"delegateForm\" ng-submit=\"submitRequest()\">\n" +
    "    <dl class=\"terms\">\n" +
    "      <dt class=\"small text-light\">请选择委托的装修公司</dt>\n" +
    "      <dd class=\"select\">\n" +
    "        <select class=\"form-control\" name=\"provider\" ng-model=\"provider\" ng-options=\"provider.name for provider in providers\" required>\n" +
    "          <option value=\"\">请选择</option>\n" +
    "        </select>\n" +
    "      </dd>\n" +
    "    </dl>\n" +
    "    <div ng-show=\"delegateForm.provider.$valid\">\n" +
    "      <dl class=\"terms\">\n" +
    "        <dt class=\"small text-light\">您的装修需求</dt>\n" +
    "        <dd>\n" +
    "          <input class=\"form-control\" name=\"date\" type=\"date\" ng-model=\"date\"  placeholder=\"选择预计开工的日期\" required />\n" +
    "        </dd>\n" +
    "      </dl>\n" +
    "\n" +
    "      <dl class=\"terms\">\n" +
    "        <dt class=\"small text-light\">您的个人信息</dt>\n" +
    "        <dd class=\"simulate-control clearfix\">\n" +
    "          <span class=\"pull-left\">张三先生</span>\n" +
    "          <span class=\"pull-right text-lighter\">186****5297</span>\n" +
    "        </dd>\n" +
    "      </dl>\n" +
    "\n" +
    "      <dl class=\"terms\">\n" +
    "        <dt class=\"small text-light\">您要装修的房间是</dt>\n" +
    "        <dd class=\"simulate-control\">\n" +
    "          {{ house.community }} {{ house.apartment }}\n" +
    "        </dd>\n" +
    "      </dl>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-hide=\"delegateForm.provider.$valid\" class=\"correction small\">\n" +
    "      <a ui-sref=\"decorate.reference\">您想委托的装修公司不在列表？</a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"full-width\" style=\"position:fixed;bottom:10px;padding: 0 15px;width:100%;\">\n" +
    "      <button type=\"submit\" class=\"btn btn-primary full-width\" ng-disabled=\"delegateForm.$invalid\">提交</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>");
}]);

angular.module("modules/decorate/templates/notice-acceptance.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/notice-acceptance.html",
    "<p class=\"message\">您已申请装修验收，我们会尽快与您和您的装修公司联络，实施验收。</p>\n" +
    "<dl class=\"terms small\">\n" +
    "  <dt class=\"text-warning text-right\">待物业反馈</dt>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">社区：</span>{{ decorate.house.community }}</dd>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">申请人：</span>张先生 186****5297 @{{ decorate.house.apartment }}</dd>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">装修公司：</span>{{ decorate.provider.name }}</dd>\n" +
    "</dl>\n" +
    "<div class=\"full-width\" style=\"position:absolute;bottom:10px;padding: 0 15px;\">\n" +
    "  <p class=\"text-muted tiny\">您也可以随时关注我的装修手续，了解办理进展。</p>\n" +
    "  <a ui-sref=\"decorate.progress({decorateId: decorate.id})\" class=\"btn btn-default full-width\">查看我的装修手续</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/decorate/templates/notice-drawing.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/notice-drawing.html",
    "<p class=\"message\">已通知您委托的装修公司提交装修平面设计图。也请督促他们尽快提交。</p>\n" +
    "<dl class=\"terms small\">\n" +
    "  <dt class=\"text-warning text-right\">待装修公司提交图纸</dt>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">社区：</span>{{ decorate.house.community }}</dd>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">申请人：</span>张先生 186****5297 @{{ decorate.house.apartment }}</dd>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">装修公司：</span>{{ decorate.provider.name }}</dd>\n" +
    "</dl>\n" +
    "<div class=\"full-width\" style=\"position:absolute;bottom:10px;padding: 0 15px;\">\n" +
    "  <p class=\"text-muted tiny\">您也可以随时关注我的装修手续，了解办理进展。</p>\n" +
    "  <a ui-sref=\"decorate.progress({decorateId: decorate.id})\" class=\"btn btn-default full-width\">查看我的装修手续</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/decorate/templates/notice-initiate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/notice-initiate.html",
    "<p class=\"message\">已向您委托的装修公司发出握手请求，请提醒对方在24小时内相应。</p>\n" +
    "<dl class=\"terms small\">\n" +
    "  <dt class=\"text-warning text-right\">待装修公司握手</dt>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">社区：</span>{{ decorate.house.community }}</dd>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">申请人：</span>张先生 186****5297 @{{ decorate.house.apartment }}</dd>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">装修公司：</span>{{ decorate.provider.name }}</dd>\n" +
    "</dl>\n" +
    "<div class=\"full-width\" style=\"position:absolute;bottom:10px;padding: 0 15px;\">\n" +
    "  <p class=\"text-muted tiny\">您也可以随时关注我的装修手续，了解办理进展。</p>\n" +
    "  <a ui-sref=\"decorate.progress({decorateId: decorate.id})\" class=\"btn btn-default full-width\">查看我的装修手续</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/decorate/templates/notice-refund.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/notice-refund.html",
    "<p class=\"message\">您已申请验收退款。我们需要在此后3个月内对您房间的装修质量作进一步观察。</p>\n" +
    "<dl class=\"terms small\">\n" +
    "  <dt class=\"text-warning text-right\">待物业退款</dt>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">社区：</span>{{ decorate.house.community }}</dd>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">申请人：</span>张先生 186****5297 @{{ decorate.house.apartment }}</dd>\n" +
    "  <dd class=\"simulate-control\"><span class=\"text-muted\">装修公司：</span>{{ decorate.provider.name }}</dd>\n" +
    "</dl>\n" +
    "<div class=\"full-width\" style=\"position:absolute;bottom:10px;padding: 0 15px;\">\n" +
    "  <p class=\"text-muted tiny\">您也可以随时关注我的装修手续，了解办理进展。</p>\n" +
    "  <a ui-sref=\"decorate.progress({decorateId: decorate.id})\" class=\"btn btn-default full-width\">查看我的装修手续</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/decorate/templates/progress.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/progress.html",
    "<div class=\"decorate-progress\">\n" +
    "  <div class=\"title small text-light\">北京时代天街10栋1单元1601室 装修单</div>\n" +
    "  <dl class=\"terms\">\n" +
    "    <decorate-progress stage=\"before\" decorate-id=\"decorateId\" items=\"progress\">在线提交装修许可申请</decorate-progress>\n" +
    "  </dl>\n" +
    "  <dl class=\"terms\">\n" +
    "    <decorate-progress stage=\"process\" decorate-id=\"decorateId\" items=\"progress\">现场办理装修许可</decorate-progress>\n" +
    "  </dl>\n" +
    "  <dl class=\"terms\">\n" +
    "    <decorate-progress stage=\"after\" decorate-id=\"decorateId\" items=\"progress\">在线申请验收&amp;押金退款</decorate-progress>\n" +
    "  </dl>\n" +
    "</div>");
}]);

angular.module("modules/decorate/templates/reference.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/reference.html",
    "<div id=\"reference\">\n" +
    "  <div class=\"main text-light\">\n" +
    "    <p>请了解以下龙湖社区供应商备案须知，尽快携带必须材料，来物业备案。</p>\n" +
    "    <dl class=\"indent\">\n" +
    "      <dt class=\"text-default\">请携带以下材料：</dt>\n" +
    "      <dd>- 公司营业执照复印件</dd>\n" +
    "      <dd>- 法人身份证复印件</dd>\n" +
    "      <dd>- 法人手机号</dd>\n" +
    "      <dd>- 现场负责人身份证原件及复印件</dd>\n" +
    "      <dd>- 现场负责人手机号</dd>\n" +
    "    </dl>\n" +
    "    <dl>\n" +
    "      <dt class=\"text-default\">请到这里来备案：</dt>\n" +
    "      <dd>北京时代天街 客服中心</dd>\n" +
    "      <dd>地址：北京市大兴区广平路3号B102</dd>\n" +
    "      <dd>电话：<a href=\"tel:010-60238899\">010-60238899</a></dd>\n" +
    "    </dl>\n" +
    "  </div>\n" +
    "  <div class=\"full-width\" style=\"position:absolute;bottom:10px;padding: 0 15px;\">\n" +
    "    <a type=\"submit\" class=\"btn btn-primary full-width\">将《备案须知》分享给装修公司</a>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("modules/decorate/templates/refund.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/decorate/templates/refund.html",
    "<div id=\"reference\">\n" +
    "  <div class=\"main text-light\">\n" +
    "    <p>您的房间装修已验收。</p>\n" +
    "    <p>我们需要在此后3个月内对您房间的装修质量作进一步观察，确认无外观防漏等问题后，为您办理正式押金退款。</p>\n" +
    "    <dl class=\"indent\">\n" +
    "      <dt class=\"text-default\">预计退款金额：</dt>\n" +
    "      <dd>- 退款金额：￥{{ repay|number:2 }}</dd>\n" +
    "      <dd>\n" +
    "        <span class=\"tiny text-muted details\">\n" +
    "          ( 扣除：<span class=\"item\" ng-repeat=\"item in charge.expense\">{{ item.name }} ￥{{ item.money|number:2 }}</span>)\n" +
    "        </span>\n" +
    "      </dd>\n" +
    "    </dl>\n" +
    "    <dl class=\"indent\">\n" +
    "      <dt class=\"text-default\">预计退款时间：</dt>\n" +
    "      <dd>- 退款时间：2014-08-08</dd>\n" +
    "    </dl>\n" +
    "  </div>\n" +
    "  <div class=\"full-width\" style=\"position:absolute;bottom:10px;padding: 0 15px;\">\n" +
    "    <a ng-click=\"submitRefund()\" class=\"btn btn-primary full-width\">申请退款</a>\n" +
    "  </div>\n" +
    "</div>");
}]);
