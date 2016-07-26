/*! weixin - v0.1.0 - 2015-03-24
* Copyright (c) 2015 lovemoon@yeah.net; Licensed GPLv2 */
var callback=function(res) {
	__callback__=res;
}

var __env__="";
var __imgHead__="";
if(location.href.indexOf("www")!=-1){
  __env__="pro";
  __imgHead__='http://www.static.duomeidai.com/weixindmd';
}else if(location.href.indexOf("test")!=-1){
  __env__="test";
  __imgHead__="http://test.static.duomeidai.com/weixindmd";
}else{
  __env__="dev";
  __imgHead__="http://dev.static.duomeidai.com/weixindmd";
  // __imgHead__="http://wx.local:8811";
}


// Initialize
var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'angular-growl', 'templates', 'userModule', 'projectModule','infinite-scroll']);

// bootstrap
angular.element(document).ready(function () {
	angular.bootstrap(document, ['app']);
});
// HTTP拦截器
app.config(['$httpProvider',
  function($httpProvider) {
    // POST method use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    // Override transformRequest to serialize form data like jquery
    $httpProvider.defaults.transformRequest = [

      function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? serialize(data) : data;
      }
    ];

    // Add interceptor
    $httpProvider.interceptors.push(['$q', 'growl',
      function($q, growl) {
        return {
          request: function(config) {
            // REST 风格路由重写
            var rules = config.url.match(/:(\w+)/g);
            if (rules !== null) {
              angular.forEach(rules, function(rule) {
                var name = rule.substring(1);
                if (config.params && config.params.hasOwnProperty(name)) {
                  config.url = config.url.replace(rule, config.params[name]);
                  delete config.params[name];
                } else if (config.data && config.data.hasOwnProperty(name)) {
                  config.url = config.url.replace(rule, config.data[name]);
                  delete config.data[name];
                }
              });
            }
            return $q.when(config);
          },
          response: function(response) {
            if (response.config.parsing !== false && response.status === 200 && angular.isObject(response.data)) {
              var res = response.data;
              // 兼容旧数据格式 {code:0, message: '', data: {...}} --> {code:200, data: {message: '', ...}}
              res.data = res.data || {};
              if (res.data.message || res.message) {
                res.data.message = res.data.message || res.message;
              }
              //未授权
              if (res.code == -801) {
                _popAuth();
                return;
              }
              //未授权
              if (res.code == -802) {
                window.location.href = res.url;
                return;
              }
              //活动过期
              if (res.data.action_base_info) {
                if (res.data.action_base_info.actionStatus != 1 || res.data.action_base_info.currentSystemTime > res.data.action_base_info.action_end_time) {
                  window.location.href = "/#/redenvelope/active_end";
                  return;
                }
              }
              return ["0", "200", 0, 200].indexOf(res.code) !== -1 ? res.data : $q.reject(res.data);
            }
            return $q.when(response);
          },
          requestError: function(rejection) {
            growl.addErrorMessage('请求异常，请刷新重试！', {
              ttl: -1
            });
            return $q.reject(rejection);
          },
          responseError: function(rejection) {
            growl.addErrorMessage('服务器异常，请刷新重试！', {
              ttl: -1
            });
            rejection['message'] = '网络出错,请稍后再试!'; //给键赋值
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

// 配置ui-bootstrap
app.config(['paginationConfig',
  function(paginationConfig) {
    paginationConfig.directionLinks = false;
    paginationConfig.boundaryLinks = true;
    paginationConfig.maxSize = 10;
    paginationConfig.firstText = '«';
    paginationConfig.lastText = '»';
  }
]);

// 配置angular-growl
app.config(['growlProvider',
  function(growlProvider) {
    growlProvider.onlyUniqueMessages(true);
    growlProvider.globalTimeToLive(4000);
    growlProvider.globalEnableHtml(false); // ngSanitize
  }
]);

// 配置全局样式表 Home页特殊处理
app.run(['$rootScope', '$timeout',
  function($rootScope, $timeout) {
    $rootScope.$on('$stateChangeSuccess', function(event, state) {
      $rootScope.isHome = state.name === 'home';
    });
    $rootScope.menu = function() {
      if (!$rootScope.titlemenu) {
        $rootScope.titlemenu = true;
      } else {
        $rootScope.titlemenu = false;
      }
    }
    $rootScope.imgHead = __imgHead__;

    // $rootScope.gomenu = function(item) {
    //     console.log(item);
    //     console.log(_UID_);
    //     if (item == 1) {
    //       $state.go('project.list', {});
    //     }else{
    //       if (_UID_>0) {
    //         $state.go('user.index', {});
    //       }else{
    //         $state.go('user.regist', {});
    //       }
    //     }
    //   }
    // var count=0
    // var timeout = function() {
    //   $rootScope.footer=count%4;
    //   count++;
    //   timer = $timeout(timeout, 4000);
    // }
    // timeout();
    // if (_ENV_ == 'dev') {
    //   $rootScope.istrue=false;
    // } else if (_ENV_ == 'test') {
    //   $rootScope.istrue=false;
    // } else {
    //   $rootScope.istrue=true;
    // }
  }
]);
app.directive('csFocus', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      replace: false,
      link: function(scope, element) {
        var times = 0;
        (function focus() {
          if (element.is(':visible')) {
            element.focus();
          } else if (times++ < 1) {
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
app.directive('csNumber', function() {
  return {
    restrict: 'A',
    replace: false,
    link: function(scope, element) {
      element.on('focus', function() {
        this.type = 'number';
      }).on('blur', function() {
        this.type = 'text';
      });
    }
  };
});

/**
 * 保持在底部效果
 */
app.directive('csBottom', ['$window', '$document',
  function($window, $document) {
    return {
      restrict: 'A',
      replace: false,
      link: function(scope, element) {
        var listener = function() {
          element.toggleClass('keep-bottom', window.innerHeight >= $document.height());
        };

        var show = function(e) {
          // 可以调出虚拟键盘的空间类型
          var needInput = ['datetime', 'datetime-local', 'email', 'month', 'number', 'range', 'search', 'tel', 'time', 'url', 'week'].indexOf(e.target.type);
          if (element.hasClass('keep-bottom') && (e.target.tagName === 'TEXTAREA' || needInput)) {
            element.hide();
          }
        };

        var hide = function() {
          element.show();
        };

        $document.on('focus', 'input,textarea', show);
        $document.on('blur', 'input,textarea', hide);

        angular.element($window).on('resize', listener).resize();

        // 清理事件 防止内存泄露
        element.on('$destroy', function() {
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
  function($window) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function(item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
        var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

    return {
      restrict: 'A',
      template: '<canvas />',
      link: function(scope, element, attrs) {
        if (!helper.support) {
          return;
        }

        var params = scope.$eval(attrs.csThumbnail);

        if (!helper.isFile(params.file) || !helper.isImage(params.file)) {
          return;
        }

        var canvas = element.find('canvas');
        var reader = new FileReader();

        reader.onload = function(e) {
          var img = new Image();
          img.onload = function() {
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

  function() {
    return {
      restrict: 'A',
      replace: false,
      transclude: true,
      templateUrl: 'common/templates/layout.partials.html',
      link: function(scope, element, attrs) {
        // Maybe todo...
      }
    };
  }
]);

/* 计算补白：实现宽高相等效果 即正方形 */
(function() {
  var height = 62; // 实际内容高度 如果调整界面此处需更新
  var padding = null;
  app.directive('csSquare', ['$window',

    function($window) {
      return {
        restrict: 'A',
        replace: false,
        link: function(scope, element, attrs) {
          var setPadding = function() {
            if (padding === null) {
              padding = Math.max((element.width() - height) / 2, 0) + 'px 0';
            }
            element.css('padding', padding);
          };

          angular.element($window).on('resize', function() {
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

// 安全过滤 配合 ng-bind-html 使用
app.filter('safe', ['$sce',
  function ($sce) {
    return function (text) {
      return $sce.trustAsHtml(text);
    };
  }
]);

app.factory('overAll', ['$http', function($http){
	return{
		totalCustomer:function(argument) {
			
		}
	};
}]);
// Avoid console errors in browsers that lack a console.
(function() {
  var method;
  var noop = function() {};
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
(function() {
  if (typeof Array.prototype.indexOf !== 'function') {
    Array.prototype.indexOf = function(obj) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] === obj) {
          return i;
        }
      }
      return -1;
    };
  }

  if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }
})();

// 识别浏览器版本
(function() {
  var version = (function() {
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
      } else if (times++ < 2) {
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
var serialize = function(obj) {
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
      } else if (value instanceof Object) {
        for (subName in value) {
          if (value.hasOwnProperty(subName)) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += serialize(innerObj) + '&';
          }
        }
      } else if (value !== undefined && value !== null) {
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
    }
  }

  return query.length ? query.substr(0, query.length - 1) : query;
};
// define module
var projectModule = angular.module('projectModule', ['ui.router', 'ui.bootstrap']);

// config router
projectModule.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {


    $stateProvider
      .state('project', {
        url: "/project",
        "abstract": true,
        template: "<div ui-view></div>"
      })
      .state('project.list', {
        url: "/list",
        controller: 'listController',
        templateUrl: "modules/project/templates/list.html"
      })
      .state('project.detail', {
        url: "/detail/{id}",
        controller: 'detailController',
        templateUrl: "modules/project/templates/detail.html"
      })
      .state('project.records', {
        url: "/records/{id}",
        controller: 'recordsController',
        templateUrl: "modules/project/templates/records.html"
      })
      .state('project.invest', {
        url: "/invest/{id}",
        controller: 'investController',
        templateUrl: "modules/project/templates/invest.html"
      });
  }
]);
projectModule.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://dev.duomeidai.com/**'
  ]);
});
// define module
var userModule = angular.module('userModule', ['ui.router', 'ui.bootstrap']);

// config router
userModule.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    // $urlRouterProvider.otherwise("/user/regist");
    $urlRouterProvider.otherwise("/project/list");

    $stateProvider
      .state('user', {
        url: '/user',
        "abstract": true,
        template: "<div ui-view></div>"
      })
      .state('user.index', {
        url: "/index",
        controller: 'indexController',
        templateUrl: "modules/user/templates/index.html"
      })
      .state('user.bill', {
        url: "/bill",
        controller: 'billController',
        templateUrl: "modules/user/templates/bill.html"
      })
      .state('user.myproject', {
        url: "/myproject",
        controller: 'myProjectController',
        templateUrl: "modules/user/templates/myproject.html"
      })
      .state('user.plan', {
        url: "/plan/{id}",
        controller: 'planController',
        templateUrl: "modules/user/templates/plan.html"
      })
      .state('user.regist', {
        url: "/regist",
        controller: 'registController',
        templateUrl: "modules/user/templates/regist.html"
      })
      .state('user.realname', {
        url: "/realname",
        controller: 'realnameController',
        templateUrl: "modules/user/templates/realname.html"
      });
  }
]);
//$scope.partner.busDesc=$sce.trustAsHtml(res.bus.busDesc);
/*项目列表*/
projectModule.controller('listController', ['$scope', '$state', 'projectService', 'msgService', '$rootScope',
  function($scope, $state, service, msgService, $rootScope) {
    var size = 10,
      page = 1;

    //获取列表
    $scope.query = function() {
        var params = {};
        params["pageNumber"] = page;
        params["pageSize"] = size;
        $scope.loaddata = '加载中';
        service.getProductList(params).then(function(res) {
          $scope.loaddata = '加载更多';
          if (!$scope.list) {
            $scope.list = res.list;
          } else {
            for (var i = 0; i < res.list.length; i++) {
              $scope.list.push(res.list[i]);
            };
          };

          if (res.total / res.size < page) {
            $scope.more = false;
          } else {
            $scope.more = true;
          }

        }, function(rej) {
          msgService.errShow(rej.message);
        });
      }
      //获取更多
    $scope.queryMore = function() {
        page++;
        console.log('page' + page + '加载更多');
        $scope.query();
      }
      //跳详情
    $scope.goDetail = function(item) {
      console.log(item);
      //绑定验证，开发环境无法验证，发布测试环境之前改掉 Add By Zhaolei
      if (_UID_ > 0) {
        $state.go('project.detail', {
          'id': item.id
        });
      } else {
        state.go('user.regist');
      };

    }
    $scope.query();
  }
]);

/*项目详情*/
projectModule.controller('detailController', ['$scope', '$state', '$stateParams', 'projectService', 'msgService', '$modal', '$rootScope',
  function($scope, $state, $stateParams, service, msgService, $modal, $rootScope) {
    //搜索详情
    $scope.searchDetail = function() {
      service.getProductDetail({
        "productId": $stateParams.id
      }).then(function(res) {
        res.enterpriseInformation = res.enterpriseInformation.replace(/\.\./ig, __imgHead__).replace(/onclick(.*)[)]["]|onclick(.*)[)][;]["]/ig, '');
        $scope.entity = res;
        $scope.loanAgreementURL = __imgHead__ + $scope.entity.loanAgreementURL;
        //合同链接，平台的话直接ng-href="{{entity.loanAgreementURL}}",如果是开发直接{{loanAgreementURL}}
      }, function(rej) {
        msgService.errShow(rej.message);
      });
    }
    $scope.searchDetail();
    //点击合同
    $scope.goAgreement = function() {
      //协议==合同
      messageBox('协议');
    }

    //这个是弹框，弹出合同用的
    var messageBox = function(msg) {
      $modal.open({
        templateUrl: 'common/templates/message.partial.html',
        controller: ['$scope', function(scop) {
          scop.title = msg;
          scop.message = "<iframe width='100%' height='300' src='" + $scope.entity.loanAgreementURL + "' frameborder='0' allowfullscreen></iframe>";
          scop.confirm = function() {
            scop.$close();
          }
        }]
      });
    }
    $scope.selectTab = '';
    //控制页签显示
    $scope.showTab = function(tabName) {
      if ($scope.selectTab != tabName) {
        $scope.selectTab = tabName;
      } else {
        $scope.selectTab = '';
      }
    }
  }

]);

/*合同*/
projectModule.controller('agreementController', ['$scope', '$state', '$stateParams', 'projectService', 'msgService',
  function($scope, $state, $stateParams, service, msgService) {
    service.getProductDetail({
      "productId": $stateParams.id
    }).then(function(res) {
      $scope.entity = res;
      $scope.loanAgreementURL = __imgHead__ + $scope.entity.loanAgreementURL;
      console.log($scope.loanAgreementURL);
    }, function(rej) {
      msgService.errShow(rej.message);
    });
  }
]);

/*投标纪录*/
projectModule.controller('recordsController', ['$scope', '$state', '$stateParams', 'projectService', 'msgService',
  function($scope, $state, $stateParams, service, msgService) {
    var size = 10,
      page = 1;
    $scope.query = function() {
      var params = {};
      params["productId"] = $stateParams.id;
      params["pageNumber"] = page;
      params["pageSize"] = size;
      $scope.loaddata = '加载中';
      service.getBidRecord(params).then(function(res) {
        $scope.loaddata = '加载更多';
        if (!$scope.entity) {
          $scope.entity = res;
        } else {
          for (var i = 0; i < res.bidRecords.length; i++) {
            $scope.entity.bidRecords.push(res.bidRecords[i]);
          };
        };

        if (res.total / res.size < page) {
          $scope.more = false;
        } else {
          $scope.more = true;
        }
      }, function(rej) {
        msgService.errShow(rej.message);
      });
    }
    $scope.queryMore = function() {
      page++;
      console.log('page' + page + '加载更多');
      $scope.query();
    }
    $scope.query();
  }
]);

/*投资*/
projectModule.controller('investController', ['$scope', '$state', '$stateParams', 'projectService', 'msgService', '$modal',
  function($scope, $state, $stateParams, service, msgService, $modal) {
    //分步骤，第一步：立即投资，输入金额；第二步：确认投资：输入交易密码以及其他的操作；第三步：成功或者失败结果。
    $scope.step = 1;

    //获取资金管理 -- 每次都要刷新一下,因为页面需要显示数据
    service.getMoneyDetail().then(function(res) {
      //请求成功后
      $scope.infomation = res;
    }, function(rej) {
      msgService.errShow(rej.message);
    });
    //获取项目详情
    $scope.searchDetail = function() {
      service.getProductDetail({
        "productId": $stateParams.id
      }).then(function(res) {
        $scope.entity = res;
        $scope.loanAgreementURL = __imgHead__ + $scope.entity.loanAgreementURL;
      }, function(rej) {
        msgService.errShow(rej.message);
      });
    }
    $scope.searchDetail();

    // 第一步：立即投资，
    $scope.money = '';
    $scope.goStep1Invest = function() {
      if (!$scope.money) {
        console.log('请输入金额');
        msgService.errShow('请输入金额');
        return;
      };
      if ($scope.money % 100 != 0) {
        console.log('输入的金额必须为100的倍数');
        msgService.errShow('输入的金额必须为100的倍数');
        return;
      };
      if ((parseFloat($scope.infomation.availableBalance.replace(/,/ig, '')) + parseFloat($scope.infomation.rebateBalance.replace(/,/ig, ''))) < 100) {
        console.log('您的余额不足100元请充值');
        msgService.errShow('您的余额不足100元请充值');
        return;
      };
      if ((parseFloat($scope.infomation.availableBalance.replace(/,/ig, '')) + parseFloat($scope.infomation.rebateBalance.replace(/,/ig, ''))) < parseFloat($scope.money)) {
        console.log('输入金额超过可用金额+返利余额');
        msgService.errShow('输入金额超过可用金额+返利余额');
        return;
      };
      if (parseFloat($scope.money) > parseFloat($scope.entity.remainingAmount)) {
        console.log('投资金额不能大于可投金额');
        msgService.errShow('投资金额不能大于可投金额');
        return;
      };
      //可投金额 和 起投金额
      if (parseFloat($scope.entity.remainingAmount) < parseFloat($scope.entity.minTenderedSum) && parseFloat($scope.money != $scope.entity.remainingAmount)) {
        //可投金额 < 起投金额
        console.log('投资金额必须为' + $scope.entity.minTenderedSum + '元');
        msgService.errShow('投资金额必须为' + $scope.entity.minTenderedSum + '元');
        return;
      };
      if (parseFloat($scope.entity.remainingAmount) >= parseFloat($scope.entity.minTenderedSum)) {
        //可投金额 >= 起投金额
        if (parseFloat($scope.money) < parseFloat($scope.entity.minTenderedSum)) {
          //输入金额 小于 起投金额时
          console.log('投资金额不能低于起投金额' + $scope.entity.minTenderedSum + '元');
          msgService.errShow('投资金额不能低于起投金额' + $scope.entity.minTenderedSum + '元');
          return;
        }
      };
      $scope.step = 2;
      console.log('投资第一步,算预计收益');
      var params = {};
      params["investAmount"] = $scope.money;
      params["annualRate"] = $scope.entity.annualRate / 100.0;
      params["deadline"] = $scope.entity.deadline;
      service.getInvestExpect(params).then(function(res) {
        console.log('投资第二步');
        $scope.willMoney = res.expectedEarnings;
      }, function(rej) {

      });
      console.log('投资第一步,得出优惠券');
      service.getCoupons().then(function(res) {
        $scope.coupons = res.list;
        $scope.firstCoupon = {
          "id": -100,
          "sourceDesc": "不使用优惠券"
        };
        $scope.coupons.unshift($scope.firstCoupon);
        $scope.selectCoupon = {
          "id": -100
        }; //设置默认选择不使用优惠券
      }, function(rej) {});
    }


    $scope.tranPassword = '';
    $scope.usedCoupon = 0;
    $scope.couponID = 0;
    $scope.isAgree = true;
    $scope.isBalance = true;
    $scope.isRebateUsable = 1;
    $scope.lodingInvest = false;
    // 第二步：确认投资
    $scope.goStep2Invest = function() {
      if (!$scope.isAgree) {
        msgService.errShow('请同意借款协议');
        return;
      };
      if (!$scope.isBalance) {
        $scope.isRebateUsable = 2;
      } else {
        $scope.isRebateUsable = 1;
      };
      if (!$scope.tranPassword) {
        msgService.errShow('请输入交易密码');
        return;
      };

      var params = {};
      params["investAmount"] = $scope.money; //投资金额
      params["transactionPassword"] = $scope.tranPassword; //交易密码
      // params["isRebateUsable"] = 2; //isRebateUsable（1使用返利 2不用）
      params["isRebateUsable"] = $scope.isRebateUsable;
      params["productId"] = $stateParams.id; //产品ID
      if ($scope.selectCoupon.id == -100) {
        $scope.usedCoupon = 0;
        $scope.couponID = 0;
      } else {
        $scope.usedCoupon = 1;
        $scope.couponID = $scope.selectCoupon.id;
      };
      params["usedCoupon"] = $scope.usedCoupon; //usedCoupon（1使用券 0不用）
      params["couponID"] = $scope.couponID; //couponID（不用券时候传0 ）
      $scope.lodingInvest = true;
      service.getProductInvest(params).then(function(res) {
        $scope.lodingInvest = false;
        if (res.code == 0) {
          // 第三步：成功或者失败结果。
          console.log('投资第三步');
          $scope.step = 3;
        } else {
          msgService.errShow(res.message);
        };
      }, function(rej) {
        $scope.lodingInvest = false;
        msgService.errShow(rej.message);
      });
    }

    //点击合同
    $scope.goAgreement = function() {
      //协议==合同
      messageBox('协议');
    }

    //这个是弹框，弹出合同用的
    var messageBox = function(msg) {
      $modal.open({
        templateUrl: 'common/templates/message.partial.html',
        controller: ['$scope', function(scop) {
          scop.title = msg;
          scop.message = "<iframe width='100%' height='300' src='" + $scope.entity.loanAgreementURL + "' frameborder='0' allowfullscreen></iframe>";
          scop.confirm = function() {
            scop.$close();
          }
        }]
      });
    }

    $scope.ok = function() {
      console.log('确定，跳转至”已投项目-投标中“页面。');
      $state.go('user.myproject', {
        'id': $stateParams.id
      });
    }
  }
]);

//投标人:王*
projectModule.filter('bidderName', function() {
  return function(bidder) {
    if (bidder) {
      return bidder.substring(0, 1) + '**';
    } else {
      return '**';
    }
  };
});
//年化率
projectModule.filter('rateType', function() {
  return function(annualRate, extendCarRate, type) {
    if (type == '2' || type == '3') {
      return parseInt(parseInt(annualRate) - parseInt(extendCarRate)) + '+' + extendCarRate + '%';
    } else {
      return parseInt(annualRate) + '%';
    }
  };
});
//起投金额
projectModule.filter('minMoney', function() {
  return function(money) {
    var string = '';
    money = parseFloat(money);
    if (money >= 100000000) { //亿
      if ((money % 100000000) == 0) {
        string = (money / 100000000.0).toFixed(0) + '亿起';
      } else {
        string = (money / 100000000.0).toFixed(1) + '亿起';
      }
    } else if (money >= 10000000) { //千万
      if ((money % 10000000) == 0) {
        string = (money / 10000000.0).toFixed(0) + '千万起';
      } else {
        string = (money / 10000000.0).toFixed(1) + '千万起';
      }
    } else if (money >= 10000) { //万
      if ((money % 10000) == 0) {
        string = (money / 10000.0).toFixed(0) + '万起';
      } else {
        string = (money / 10000.0).toFixed(1) + '万起';
      }
    } else if (money >= 1000) { //千
      if ((money % 1000) == 0) {
        string = (money / 1000.0).toFixed(0) + '千起';
      } else {
        string = (money / 1000.0).toFixed(1) + '千起';
      }
    } else { //百
      string = money.toFixed(0) + '元起';
    }
    return string;
  };
});

projectModule.filter('imgUrl', function() {
  return function(content) {
    var str = content.replace('..','http://dev.duomeidai.com');
    return str;
      };
});
projectModule.factory('projectService', ['$http',
  function($http) {

    return {
      getProductList: function(params) { //产品列表
        return $http({
          url: '/pl/product/list',
          method: 'get',
          params: params,
          cache: false
        });
      },
      getProductDetail: function(params) { //产品详情
        return $http({
          url: '/pl/u/product/detail',
          method: 'get',
          params: params,
          cache: false
        });
      },
      getBidRecord: function(params) { //投标记录
        return $http({
          url: '/pl/u/bid/record',
          method: 'get',
          params: params,
          cache: false
        });
      },
      getContract: function(params) { //合同
        return $http({
          url: '/pl/u/agreement',
          method: 'get',
          params: params,
          cache: false
        });
      },
      getMoneyDetail: function() { //资金管理//投资的时候需要用到
        return $http({
          url: '/pl/u/fund',
          method: 'get'
        });
      },
      getProductInvest: function(params) { //投标
        return $http({
          url: '/pl/u/product/invest',
          method: 'post',
          params: params,
          cache: false
        });
      },
      getInvestExpect: function(params) { //投资时获取预计收益
        return $http({
          url: '/pl/product/invest/earnings/expect',
          method: 'get',
          params: params,
          cache: false
        });
      },
      getCoupons: function() { //获取未使用优惠券列表
        return $http({
          url: '/pl/u/unuseCoupons',
          method: 'get'
        });
      }

    };
  }
]);


projectModule.factory('msgService', ['$timeout', function($timeout) {
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
angular.module('templates', ['common/templates/layout.partials.html', 'common/templates/message.partial.html', 'modules/project/templates/detail.html', 'modules/project/templates/invest.html', 'modules/project/templates/list.html', 'modules/project/templates/records.html']);

angular.module("common/templates/layout.partials.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/templates/layout.partials.html",
    "<div class=\"container\">\n" +
    "        <!--下拉菜单弹窗-->\n" +
    "    <div class=\"windpub head_navli\" ng-if=\"titlemenu\" ng-click=\"menu()\">\n" +
    "        <div class=\"windpubcon\">\n" +
    "            <ul>\n" +
    "                <li><a href=\"#\" ui-sref=\"project.list\">投资项目</a></li>\n" +
    "                <li><a href=\"#\" ui-sref=\"user.index\">我的账户</a></li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"navbar navbar-inverse navbar-fixed-top\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <button ng-click=\"menu()\" type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "            </button>\n" +
    "            <div class=\"navbar-brand text-left pt-page-rotateCubeBottomIn toplogo\"><img ng-src=\"{{imgHead}}/img/logo.png\" height=\"100%\" alt=\"\" /></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pubcent\">\n" +
    "    <div ui-view class=\"bigbox\">\n" +
    "    </div>\n" +
    "        <!-- <p>模板页中间结构部分,添加内容时需要自定义父级名称，且适当给父级添加填充或边距！</p> -->\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div id=\"errBox\">\n" +
    "    <div id=\"errBoxShadow\"></div>\n" +
    "    <div id=\"errBoxText\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("common/templates/message.partial.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/templates/message.partial.html",
    "<div class=\"modal-header\">\n" +
    "  <a class=\"close\" ng-click=\"$dismiss()\">&times;</a>\n" +
    "  <h4 class=\"modal-title\">{{ title }}</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" ng-bind-html=\"message|safe\"></div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-default\" ng-click=\"$dismiss()\">确定</button>\n" +
    "</div>");
}]);

angular.module("modules/project/templates/detail.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/project/templates/detail.html",
    "<div class=\"pubcent xmcon_list\">\n" +
    "    <div class=\"padcall\">\n" +
    "        <li>\n" +
    "            <div class=\"xmpublic\" ng-class=\"{huank_ing:entity.borrowStatus==3,yufa_ing:entity.borrowStatus==2,toub_ing:entity.borrowStatus!=2&amp;&amp;entity.borrowStatus!=3}\">\n" +
    "                <div class=\"styh4\">\n" +
    "                    <div class=\"icon_2\">\n" +
    "                        实\n" +
    "                    </div>\n" +
    "                    <h4>\n" +
    "                        {{entity.borrowTitle}}\n" +
    "                        <a ng-click=\"goAgreement()\">\n" +
    "                            协议\n" +
    "                        </a>\n" +
    "                    </h4>\n" +
    "                </div>\n" +
    "                <div class=\"jindu_t\" ng-if=\"entity.borrowStatus!=2\">\n" +
    "                    <div class=\"pr_progress floatL\">\n" +
    "                        <div class=\"progress-bar\" style=\"width:{{100-(entity.borrowAmount-entity.remainingAmount)/entity.borrowAmount*100}}%;\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <p class=\"floatL\">\n" +
    "                        {{(100-(entity.borrowAmount-entity.remainingAmount)/entity.borrowAmount*100).toFixed(0)}}%\n" +
    "                    </p>\n" +
    "                    <div class=\"icon_3\" ng-if=\"entity.borrowStatus==3\">\n" +
    "                        还\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"jindu_t\" ng-if=\"entity.borrowStatus==2\">\n" +
    "                    <div class=\"qg_time\">\n" +
    "                        抢购时间：{{entity.panicBuyingTime}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"nubtab_list\">\n" +
    "                            <div ng-if=\"entity.productType==1||entity.productType==4\">\n" +
    "                        <p class=\"rate\">\n" +
    "                            <i>\n" +
    "                             {{entity.annualRate}}%\n" +
    "                            </i>\n" +
    "                        </p>\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"entity.productType==2||entity.productType==3\">\n" +
    "                        <p class=\"rate\">\n" +
    "                            <i>\n" +
    "                              {{entity.annualRate-entity.extendCarRate}}+{{entity.extendCarRate}}%\n" +
    "                            </i>\n" +
    "                        </p>\n" +
    "                        </div>\n" +
    "                    <p class=\"month\">\n" +
    "                        <i>\n" +
    "                            {{entity.deadline}}\n" +
    "                        </i>\n" +
    "                        个月\n" +
    "                    </p>\n" +
    "                    <p class=\"total\">\n" +
    "                        <i>\n" +
    "                            {{entity.borrowAmount/10000.0}}\n" +
    "                        </i>\n" +
    "                        万\n" +
    "                    </p>\n" +
    "                    <p class=\"start\">\n" +
    "                        <i>\n" +
    "                            {{entity.minTenderedSum|minMoney}}\n" +
    "                        </i>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class=\"jine_list\">\n" +
    "                    <p class=\"icon_5\">\n" +
    "                    </p>\n" +
    "                    <p class=\"floatL\">\n" +
    "                        {{entity.guaranteeCompanyName}}|{{entity.supportWay}}\n" +
    "                    </p>\n" +
    "                    <p class=\"floatR\">\n" +
    "                        {{entity.paymentWay}}\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </div>\n" +
    "    <div class=\"pub_folding\">\n" +
    "        <div class=\"pub_fold info_data\" ng-click=\"showTab('infodata')\">\n" +
    "            <div class=\"styh3\">\n" +
    "                <h3>\n" +
    "                    项目描述\n" +
    "                </h3>\n" +
    "                <span ng-class=\"{upward:selectTab!='infodata',down:selectTab=='infodata'}\">\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <ul class=\"data_ul\" ng-show=\"selectTab=='infodata'\">\n" +
    "                <!-- style=\"display:none;\" -->\n" +
    "                1、项目描述\n" +
    "                <li ng-bind-html=\"entity.projectDescription.projectDescription|safe\">\n" +
    "                    {{entity.projectDescription.projectDescription}}\n" +
    "                </li>\n" +
    "                2、资金用途\n" +
    "                <li ng-bind-html=\"entity.projectDescription.useOfFunds|safe\">\n" +
    "                    {{entity.projectDescription.useOfFunds}}\n" +
    "                </li>\n" +
    "                3、还款来源\n" +
    "                <li ng-bind-html=\"entity.projectDescription.sourceOfRepayment|safe\">\n" +
    "                    {{entity.projectDescription.sourceOfRepayment}}\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div ng-if=\"entity.productType==1\">\n" +
    "            <div class=\"pub_fold qiye_data\" ng-click=\"showTab('bussdata')\">\n" +
    "                <div class=\"styh3\">\n" +
    "                    <h3>\n" +
    "                        企业信息\n" +
    "                    </h3>\n" +
    "                    <span ng-class=\"{upward:selectTab!='bussdata',down:selectTab=='bussdata'}\">\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <div class=\"qiye_data_con\" ng-show=\"selectTab=='bussdata'\">\n" +
    "                    <ul class=\"data_ul\">\n" +
    "                        <li ng-bind-html=\"entity.enterpriseInformation|safe\">\n" +
    "                            {{entity.enterpriseInformation}}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"pub_fold\" ng-click=\"showTab('warrantdata')\">\n" +
    "                <div class=\"styh3\">\n" +
    "                    <h3>\n" +
    "                        担保信息\n" +
    "                    </h3>\n" +
    "                    <span ng-class=\"{upward:selectTab!='warrantdata',down:selectTab=='warrantdata'}\">\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <ul class=\"data_ul\" ng-show=\"selectTab=='warrantdata'\">\n" +
    "                    <li ng-bind-html=\"entity.guaranteeInformation|safe\">\n" +
    "                        {{entity.guaranteeInformation}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"entity.productType!=1\">\n" +
    "            <div class=\"pub_fold qiye_data\" ng-click=\"showTab('danbdepartment')\">\n" +
    "                <div class=\"styh3\">\n" +
    "                    <h3>\n" +
    "                        担保机构\n" +
    "                    </h3>\n" +
    "                    <span ng-class=\"{upward:selectTab!='danbdepartment',down:selectTab=='danbdepartment'}\">\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <ul class=\"data_ul\" ng-show=\"selectTab=='warrantdata'\">\n" +
    "                    <li>\n" +
    "                        {{entity.guaranteeAgency}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"pub_fold\" ng-click=\"showTab('fengkdata')\">\n" +
    "                <div class=\"styh3\">\n" +
    "                    <h3>\n" +
    "                        风控信息\n" +
    "                    </h3>\n" +
    "                    <span ng-class=\"{upward:selectTab!='fengkdata',down:selectTab=='fengkdata'}\">\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <ul class=\"data_ul\" ng-show=\"selectTab=='fengkdata'\">\n" +
    "                    <li ng-bind-html=\"entity.windControlInformation|safe\">\n" +
    "                        {{entity.windControlInformation}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"pub_fold\" ng-click=\"showTab('repayplan')\">\n" +
    "            <div class=\"styh3\">\n" +
    "                <h3>\n" +
    "                    还款方案\n" +
    "                </h3>\n" +
    "                <span ng-class=\"{upward:selectTab!='repayplan',down:selectTab=='repayplan'}\">\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <table class=\"table\" ng-show=\"selectTab=='repayplan'\">\n" +
    "                <tbody>\n" +
    "                    <tr>\n" +
    "                        <th width=\"28%\">\n" +
    "                            还款日期\n" +
    "                        </th>\n" +
    "                        <th width=\"36%\">\n" +
    "                            月还本息(元)\n" +
    "                        </th>\n" +
    "                        <th width=\"36%\">\n" +
    "                            待还本息(元)\n" +
    "                        </th>\n" +
    "                    </tr>\n" +
    "                    <tr ng-repeat=\"item in entity.repaymentPlan.repaymentList\">\n" +
    "                        <td>\n" +
    "                            <p>\n" +
    "                                {{item.mon}}\n" +
    "                            </p>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <p class=\"corblue\">\n" +
    "                                {{item.monPay}}\n" +
    "                            </p>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <p class=\"corred\">\n" +
    "                                {{item.payRemain}}\n" +
    "                            </p>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    <tr>\n" +
    "                        <td colspan=\"3\">\n" +
    "                            <p>\n" +
    "                                <i class=\"corred\">\n" +
    "                                    *\n" +
    "                                </i>\n" +
    "                                项目成功募集前，还款日期待定，此还款方案为参考\n" +
    "                            </p>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div class=\"pub_fold\">\n" +
    "            <div class=\"styh3\">\n" +
    "                <h3>\n" +
    "                    投标记录\n" +
    "                </h3>\n" +
    "                <a ui-sref=\"project.records({id:entity.id})\" class=\"floatR corblue fon16\">\n" +
    "                    查看&gt;\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <button type=\"submit\" ui-sref=\"project.invest({id:entity.id})\" class=\"btn btn-primary btn-lg btn-block\" ng-show=\"entity.borrowStatus==1\">\n" +
    "                    立即投资\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- 标的ID：{{entity.id}} 产品类型：{{entity.productType}} 认证类型：{{entity.authenticationType}}\n" +
    "标题：{{entity.borrowTitle}} <a ng-click='goAgreement()'>协议</a>\n" +
    "年利率：{{entity.annualRate}}\n" +
    "车贷加息：{{entity.extendCarRate}}\n" +
    "借款期限：{{entity.deadline}}\n" +
    "借款金额：{{entity.borrowAmount}}\n" +
    "可投金额：{{entity.borrowAmount}}\n" +
    "借款状态：{{entity.borrowStatus}}\n" +
    "担保公司名称：{{entity.guaranteeCompanyName}}\n" +
    "保障方式：{{entity.supportWay}}\n" +
    "还款方式：{{entity.paymentMode}}\n" +
    "还款方式文本：{{entity.paymentWay}}\n" +
    "抢购时间：{{entity.panicBuyingTime}}\n" +
    "起投金额：{{entity.minTenderedSum}} -->\n" +
    "<!-- <br>\n" +
    "项目描述<br>\n" +
    "1、项目描述：{{entity.projectDescription.projectDescription}}<br>\n" +
    "2、资金用途：{{entity.projectDescription.useOfFunds}}<br>\n" +
    "3、还款来源：{{entity.sourceOfRepayment}}<br> -->\n" +
    "<!-- <div ng-if=\"entity.productType==1\">\n" +
    "企业信息<br>\n" +
    "企业信息：{{entity.enterpriseInformation}}<br>\n" +
    "担保信息<br>\n" +
    "担保信息：{{entity.guaranteeInformation}}<br>\n" +
    "</div>\n" +
    "<div ng-if=\"entity.productType!=1\">\n" +
    "担保机构<br>\n" +
    "担保机构：{{entity.guaranteeAgency}}<br>\n" +
    "风控信息<br>\n" +
    "风控信息：{{entity.windControlInformation}}<br>\n" +
    "</div> -->\n" +
    "<!-- <br />\n" +
    "<ul>\n" +
    "    剩余期数：{{entity.repaymentPlan.forDeadline}} 已还本息：{{entity.repaymentPlan.hasPI}}\n" +
    "    待还总额：{{entity.repaymentPlan.hasSum}}\n" +
    "    <br />\n" +
    "    <li ng-repeat=\"item in entity.repaymentPlan.repaymentList\">\n" +
    "        {{item.repaymentAmount}} {{item.repaymentDate}} {{item.status}}\n" +
    "    </li>\n" +
    "</ul>\n" +
    "-->\n" +
    "<!-- <br />\n" +
    "<button type=\"submit\" ui-sref=\"project.records({id:entity.id})\">\n" +
    "    投标纪录\n" +
    "</button>\n" +
    "<br />\n" +
    "<br />\n" +
    "<br />\n" +
    "<button type=\"submit\" ui-sref=\"project.invest({id:entity.id})\">\n" +
    "    立即投资\n" +
    "</button>\n" +
    "<br />\n" +
    "<br />\n" +
    "<br />\n" +
    "<br />\n" +
    "<br />\n" +
    "<br />\n" +
    "<br />\n" +
    "-->");
}]);

angular.module("modules/project/templates/invest.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/project/templates/invest.html",
    "<div class=\"pubcent touzi_con\">\n" +
    "    <div class=\"styh4\">\n" +
    "        <div class=\"icon_2\">\n" +
    "            实\n" +
    "        </div>\n" +
    "        <h4>\n" +
    "            {{entity.borrowTitle}}\n" +
    "        </h4>\n" +
    "    </div>\n" +
    "    <div class=\"touzi_data\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-6 col-sm-6 lbor\">\n" +
    "                <dl>\n" +
    "                    <dt>\n" +
    "                    </dt>\n" +
    "                    <dd>\n" +
    "                        <p class=\"corblue\">\n" +
    "                            <span>\n" +
    "                                {{entity.annualRate}}\n" +
    "                            </span> %\n" +
    "                        </p>\n" +
    "                        <p class=\"corgray\">\n" +
    "                            年化收益\n" +
    "                        </p>\n" +
    "                    </dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6 col-sm-6 rbor\">\n" +
    "                <dl>\n" +
    "                    <dt>\n" +
    "                    </dt>\n" +
    "                    <dd>\n" +
    "                        <p class=\"corblue\">\n" +
    "                            <span>\n" +
    "                                {{entity.deadline}}\n" +
    "                            </span> 个月\n" +
    "                        </p>\n" +
    "                        <p class=\"corgray\">\n" +
    "                            期限\n" +
    "                        </p>\n" +
    "                    </dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"yue_list\" ng-show=\"step==1\">\n" +
    "        <p class=\"fon16\">\n" +
    "            可用余额:\n" +
    "            <span class=\"corred\">\n" +
    "                {{infomation.availableBalance}}元\n" +
    "            </span>\n" +
    "        </p>\n" +
    "        <p class=\"fon16\">\n" +
    "            返利余额:\n" +
    "            <span>\n" +
    "                {{infomation.rebateBalance}}元\n" +
    "            </span>\n" +
    "        </p>\n" +
    "        <p class=\"fon16\">\n" +
    "            起投金额:\n" +
    "            <span>\n" +
    "                {{entity.minTenderedSum}}元\n" +
    "            </span>\n" +
    "        </p>\n" +
    "        <form class=\"form-horizontal\" role=\"form\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"text\" name=\"money\" ng-model=\"money\" class=\"form-control jine_but\" placeholder=\"输入金额必须为100元倍数\" cs-focus autofocus required />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"fon14 marb2\">\n" +
    "                当前可投:\n" +
    "                <span class=\"corblue\">\n" +
    "                    {{entity.borrowAmount}}元\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"goStep1Invest()\">\n" +
    "                        立即投资\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"yue_list\" ng-show=\"step==2\">\n" +
    "        <div class=\"clearfix\">\n" +
    "            <p class=\"fon16 floatL\">\n" +
    "                投资余额:\n" +
    "                <span>\n" +
    "                    {{ money }}元\n" +
    "                </span>\n" +
    "            </p>\n" +
    "            <p class=\"fon16 floatR\">\n" +
    "                预计收益:\n" +
    "                <span class=\"corred\">\n" +
    "                    {{ willMoney.toFixed(2) }}元\n" +
    "                </span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <form class=\"form-horizontal\" role=\"form\">\n" +
    "            <div class=\"form-group posit\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <i class=\"jiaoyi_butico\">\n" +
    "                    </i>\n" +
    "                    <input type=\"password\" class=\"form-control jiaoyi_but\" ng-model=\"tranPassword\" placeholder=\"输入交易密码\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"fon12 borbot padb1\">\n" +
    "                <label class=\"checkbox-inline\">\n" +
    "                    <input type=\"checkbox\" id=\"inlineCheckbox1\" value=\"option1\" ng-model=\"isAgree\"> 我同意按如下&nbsp;\n" +
    "                    <a href=\"#\" class=\"corblue\" ng-click='goAgreement()'>\n" +
    "                        《借款协议（范本）》\n" +
    "                    </a> 的格式和条款生成借款协议。\n" +
    "                </label>\n" +
    "                <label class=\"checkbox-inline\">\n" +
    "                    <input type=\"checkbox\" id=\"inlineCheckbox1\" value=\"option1\" ng-model=\"isBalance\"> 优先使用返利余额&nbsp;\n" +
    "                    <span class=\"corred\">\n" +
    "                        {{infomation.rebateBalance}}元\n" +
    "                    </span> 。\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <div class=\"youhui_q\">\n" +
    "                <div class=\"radio\" ng-repeat=\"item in coupons\">\n" +
    "                    <label>\n" +
    "                        <input name=\"couponName\" id=\"{{item}}\" type=\"radio\" ng-model=\"selectCoupon.id\" ng-value=\"item.id\">\n" +
    "                        <span ng-if=\"item.id==-100\">\n" +
    "                            {{item.sourceDesc}}\n" +
    "                        </span>\n" +
    "                        <span class=\"corred\" ng-if=\"item.id!=-100\">\n" +
    "                            {{item.amount}}元现金券\n" +
    "                        </span>\n" +
    "                    </label>\n" +
    "                    <span class=\"corgray\" ng-if=\"item.id!=-100\">\n" +
    "                            有效期至：{{item.effectEndAt | date:'yyyy-MM-dd HH:mm'}}\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-xs-12\">\n" +
    "                        <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-disabled=\"!isAgree\" ng-click=\"goStep2Invest()\" ng-disabled=\"lodingInvest\">\n" +
    "                            确认投资\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"yue_list\" ng-show=\"step==3\">\n" +
    "        <dl>\n" +
    "            <dt class=\"successful_tip\">\n" +
    "            </dt>\n" +
    "            <dd>\n" +
    "                <p class=\"fon16\">\n" +
    "                    成功购买:\n" +
    "                    <span class=\"corblue\">\n" +
    "                        {{ money }}元\n" +
    "                    </span>\n" +
    "                </p>\n" +
    "                <p class=\"fon16\">\n" +
    "                    预计收益:\n" +
    "                    <span class=\"corred\">\n" +
    "                        {{ willMoney.toFixed(2) }}元\n" +
    "                    </span>\n" +
    "                </p>\n" +
    "            </dd>\n" +
    "        </dl>\n" +
    "        <form class=\"form-horizontal\" role=\"form\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"ok()\">\n" +
    "                        确定\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/project/templates/list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/project/templates/list.html",
    "<div class=\"pubcent xmlist_con\">\n" +
    "    <div class=\"fon18 corblack styltitle_1\">\n" +
    "        <i>\n" +
    "            项目列表\n" +
    "        </i>\n" +
    "        <span>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <div class=\"xm_list\">\n" +
    "        <!-- <ul infinite-scroll=\"queryMore()\"> -->\n" +
    "        <ul>\n" +
    "            <li ng-repeat=\"item in list\">\n" +
    "                <!-- <a href=\"\" ng-click=\"goDetail(item)\"> -->\n" +
    "                <!-- <div class=\"xmpublic toub_ing\"> -->\n" +
    "                <div class=\"xmpublic\" ng-class=\"{huank_ing:item.borrowStatus==3,yufa_ing:item.borrowStatus==2,toub_ing:item.borrowStatus!=2&&item.borrowStatus!=3}\">\n" +
    "                    <div class=\"styh4\">\n" +
    "                        <!-- <a href=\"xm_list_con.html\"> -->\n" +
    "                        <a href=\"\" ng-click=\"goDetail(item)\">\n" +
    "                            <div class=\"icon_2\">\n" +
    "                                实\n" +
    "                            </div>\n" +
    "                            <h4>\n" +
    "                                {{item.borrowTitle}}\n" +
    "                            </h4>\n" +
    "                            <div class=\"icon_4\" ng-if=\"item.borrowStatus==2\">\n" +
    "                                预\n" +
    "                            </div>\n" +
    "                            <div class=\"icon_3\" ng-if=\"item.borrowStatus==3\">\n" +
    "                                还\n" +
    "                            </div>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                    <div class=\"jindu_t\" ng-if=\"item.borrowStatus=='2'\">\n" +
    "                        <div class=\"qg_time\">\n" +
    "                            抢购时间：{{item.panicBuyingTime|date:'yyyy-MM-dd HH:mm'}}\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"jindu_t\" ng-if=\"item.borrowStatus!='2'\">\n" +
    "                        <div class=\"pr_progress floatL\">\n" +
    "                            <div class=\"progress-bar\" style=\"width:{{(item.borrowAmount-item.remainingAmount)/item.borrowAmount*100}}%;\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <p class=\"floatL\">\n" +
    "                            {{((item.borrowAmount-item.remainingAmount)/item.borrowAmount*100).toFixed(0)}}%\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                    <div class=\"nubtab_list\">\n" +
    "                        <div ng-if=\"item.productType==1||item.productType==4\">\n" +
    "                        <p class=\"rate\">\n" +
    "                            <i>\n" +
    "                             {{item.annualRate}}%\n" +
    "                            </i>\n" +
    "                        </p>\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"item.productType==2||item.productType==3\">\n" +
    "                        <p class=\"rate\">\n" +
    "                            <i>\n" +
    "                              {{item.annualRate-item.extendCarRate}}+{{item.extendCarRate}}%\n" +
    "                            </i>\n" +
    "                        </p>\n" +
    "                        </div>\n" +
    "                        <p class=\"month\">\n" +
    "                            <i>\n" +
    "                                {{item.deadline}}\n" +
    "                            </i>\n" +
    "                            个月\n" +
    "                        </p>\n" +
    "                        <p class=\"total\">\n" +
    "                            <i>\n" +
    "                                {{item.borrowAmount/10000.0}}\n" +
    "                            </i>\n" +
    "                            万\n" +
    "                        </p>\n" +
    "                        <p class=\"start\">\n" +
    "                            <i>\n" +
    "                                {{item.minTenderedSum|minMoney}}\n" +
    "                            </i>\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                    <div class=\"jine_list\">\n" +
    "                        <p class=\"icon_5\">\n" +
    "                        </p>\n" +
    "                        <p class=\"floatL\">\n" +
    "                            {{item.guaranteeCompanyName}}|{{item.supportWay}}\n" +
    "                        </p>\n" +
    "                        <p class=\"floatR\">\n" +
    "                            {{item.paymentWay}}\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <br>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <div class=\"all_more\">\n" +
    "            <a class=\"nomore\" ng-if=\"list.length==0\">\n" +
    "                暂无数据\n" +
    "            </a>\n" +
    "            <a class=\"more\" ng-if=\"list.length!=0&&more\" ng-click=\"queryMore()\" >\n" +
    "                {{loaddata}}\n" +
    "            </a>\n" +
    "            <a class=\"nomore\" ng-if=\"list.length!=0&&!more\" >\n" +
    "                没有更多...\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- 标的ID：{{item.id}} 标题：{{item.borrowTitle}} 产品类型：{{item.productType}}\n" +
    "认证类型：{{item.authenticationType}}<br>\n" +
    "<div ng-if=\"borrowStatus=='2'\">\n" +
    "抢购时间：{{item.panicBuyingTime|date:'yyyy-MM-dd HH:mm'}}\n" +
    "</div>\n" +
    "<div ng-if=\"borrowStatus!='2'\">\n" +
    "投标进度：{{(item.borrowAmount-item.remainingAmount)/item.borrowAmount*100}}%\n" +
    "</div>\n" +
    "年利率：{{item.annualRate-item.extendCarRate}}% + {{item.extendCarRate}}%  车贷加息：{{item.extendCarRate}}%  显示方式为：{{item.annualRate|rateType:item.extendCarRate:item.productType}} 借款期限：{{item.deadline}}个月  借款金额：{{item.borrowAmount/10000.0}}万 起投金额：{{item.minTenderedSum|minMoney}}<br>\n" +
    "担保公司方式：{{item.guaranteeCompanyName}}|{{item.supportWay}} 还款方式文本：{{item.paymentWay}}<br> -->\n" +
    "<!-- 可投金额：{{item.remainingAmount}} 借款状态：{{item.borrowStatus}} 还款方式：{{item.paymentMode}}\n" +
    "-->");
}]);

angular.module("modules/project/templates/records.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/project/templates/records.html",
    "<div class=\"pubcent tb_julu\">\n" +
    "    <div class=\"tile_nub\">\n" +
    "        <p class=\"floatL\">\n" +
    "            已投金额:\n" +
    "            <i class=\"corred\">\n" +
    "                {{entity.remainingAmount}}元\n" +
    "            </i>\n" +
    "        </p>\n" +
    "        <p class=\"floatR\">\n" +
    "            已投人次:\n" +
    "            <i class=\"corred\">\n" +
    "                {{entity.numberOfBids}}次\n" +
    "            </i>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "    <table class=\"table\">\n" +
    "        <tbody>\n" +
    "            <tr>\n" +
    "                <th width=\"33%\">\n" +
    "                    投标时间\n" +
    "                </th>\n" +
    "                <th width=\"30%\">\n" +
    "                    投标人\n" +
    "                </th>\n" +
    "                <th width=\"37%\">\n" +
    "                    投标金额(元)\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"item in entity.bidRecords\">\n" +
    "                <td>\n" +
    "                    <p>\n" +
    "                        {{item.bidTime|date:'yyyy-MM-dd HH:mm'}}\n" +
    "                    </p>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <p>\n" +
    "                        {{item.bidder|bidderName}}\n" +
    "                    </p>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <p class=\"corblue\">\n" +
    "                        {{item.bidAmount}}\n" +
    "                    </p>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "                <div class=\"all_more\">\n" +
    "                <a href=\"javascript:\" class=\"more\" ng-if=\"entity.bidRecords.length!=0&&more\" ng-click=\"queryMore()\">{{loaddata}}</a>\n" +
    "                <a href=\"javascript:\" class=\"nomore\" ng-if=\"entity.bidRecords.length!=0&&!more\">没有更多...</a>\n" +
    "                <a href=\"javascript:\" class=\"nomore\" ng-if=\"entity.bidRecords.length==0\">暂无数据</a>\n" +
    "            </div>\n" +
    "<!--     <ul>\n" +
    "        <li ng-if=\"entity.bidRecords.length==0\">\n" +
    "            暂无数据\n" +
    "        </li>\n" +
    "        <button ng-if=\"entity.bidRecords.length!=0&&more\" ng-click=\"queryMore()\">\n" +
    "            加载更多\n" +
    "        </button>\n" +
    "        <li ng-if=\"entity.bidRecords.length!=0&&!more\">\n" +
    "            没有更多了\n" +
    "        </li>\n" +
    "    </ul> -->\n" +
    "</div>");
}]);
