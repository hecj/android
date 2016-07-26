/*! weixin - v0.1.0 - 2015-04-03
* Copyright (c) 2015 lovemoon@yeah.net; Licensed GPLv2 */
var callback = function(res) {
	__callback__ = res;
}

var __env__ = "";
var __imgHead__ = "";
var __wwwHead__ = "";
if (location.href.indexOf("www") != -1) {
	__env__ = "pro";
	__imgHead__ = 'http://www.static.duomeidai.com/weixindmd';
	__wwwHead__ = 'http://www.duomeidai.com';

} else if (location.href.indexOf("test") != -1) {
	__env__ = "test";
	__imgHead__ = "http://test.static.duomeidai.com/weixindmd";
	__wwwHead__ = 'http://test.duomeidai.com';
} else {
	__env__ = "dev";
	__imgHead__ = "http://dev.static.duomeidai.com/weixindmd";
	__wwwHead__ = 'http://dev.duomeidai.com';
	// __imgHead__="http://wx.local:8811";
}


// Initialize
var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'angular-growl', 'templates', 'userModule', 'projectModule', 'infinite-scroll']);

// bootstrap
angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
	 //$("body").prepend($("<div style='height:1px;overflow:hidden;'><img src='http://dev.static.duomeidai.com/weixindmd/img/logo3.png' /></div>"))
});
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

app.filter('group', function() {
  return function(items, cols) {
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
      } else {
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
app.filter('empty', function() {
  return function(obj) {
    return !obj || angular.equals({}, obj) || angular.equals([], obj);
  };
});

// 取两个数最小的
app.filter('min', function() {
  return function(num, limit) {
    return Math.min(num, limit);
  };
});

// 取两个数最大的
app.filter('max', function() {
  return function(num, limit) {
    return Math.max(num, limit);
  };
});

// 安全过滤 配合 ng-bind-html 使用
app.filter('safe', ['$sce',
  function($sce) {
    return function(text) {
      $(".data_ul img").each(function(i, e) {
        $(e).removeAttr("width").removeAttr("height").css("width", "15%")
      });
      $(".data_ul p").add(".data_ul span").not("h3").css("color","#808080")
      return $sce.trustAsHtml(text);
    };
  }
]);
app.filter('agreeSafe', ['$sce',
  function($sce) {
    return function(text) {
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
        console.log('我的账户' + _UID_);
        msgService.errShow("请先登录");
        $state.go('user.regist');
        return;
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
          scop.message = "<div style='width:100%;height:300px;-webkit-overflow-scrolling: touch;overflow: scroll;'><iframe height='100%' width='100%' type='text/html' src='" + $scope.entity.loanAgreementURL + "' frameborder='0' allowfullscreen></iframe></div>";
          scop.confirm = function() {
            scop.$close();
          }
        }]
      });
    }
    $scope.selectTab = 'infodata';
    //控制页签显示
    $scope.showTab = function(tabName) {
        if ($scope.selectTab != tabName) {
          $scope.selectTab = tabName;
        } else {
          $scope.selectTab = '';
        }
      }
      //点击立即投资
    $scope.goInvest = function() {
      //判断是否实名认证
      service.isAuth().then(function(res) {
        if (res.code == 1) {
          $state.go('project.invest', {
            'id': $scope.entity.id
          });
        } else {
          msgService.errShow("请实名认证");
          $state.go("user.realname");
        };
      }, function(rej) {
        msgService.errShow(rej.message);
      });

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

        if (res.total / size < page) {
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

    $scope.getMoney = function() {
      //获取资金管理 -- 每次都要刷新一下,因为页面需要显示数据
      service.getMoneyDetail().then(function(res) {
        //请求成功后
        $scope.infomation = res;
      }, function(rej) {
        msgService.errShow(rej.message);
      });
    }
    $scope.getMoney();
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
      $scope.getMoney();
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
      console.log($scope.money, $scope.entity.remainingAmount);
      if (parseFloat($scope.money) > parseFloat($scope.entity.remainingAmount)) {
        console.log('投资金额不能大于可投金额');
        msgService.errShow('投资金额不能大于可投金额');
        return;
      };
      //可投金额 和 起投金额
      if ($scope.entity.remainingAmount < parseFloat($scope.entity.minTenderedSum) && $scope.money != $scope.entity.remainingAmount) {
        //可投金额 < 起投金额
        //最后一笔投资
        msgService.errShow('投资金额必须为' + $scope.entity.remainingAmount + '元');
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
          scop.message = "<div style='width:100%;height:300px;-webkit-overflow-scrolling: touch;overflow: scroll;'><iframe height='100%' width='100%' type='text/html' src='" + $scope.entity.loanAgreementURL + "' frameborder='0' allowfullscreen></iframe></div>";
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
      },
      isAuth: function() { //是否实名认证
        return $http({
          url: '/pl/u/isauth',
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
//我的账户
userModule.controller('indexController', ['$scope', '$state', 'userService', 'msgService',
  function($scope, $state, service, msgService) {
    console.log('我的账户' + _UID_);
    if (_UID_ < 0) {
      msgService.errShow("请先登录");
      $state.go("user.regist");
      return;
    };
    //帐户信息
    $scope.getAccountMsg = function() {
      service.getAccountMsg().then(function(res) {
        //请求成功后
        $scope.accountMsg = res;
        console.log($scope.accountMsg.authentication + '是否实名认证');
      }, function(rej) {
        msgService.errShow(rej.message);
      });
    }

    //获取资金管理 -- 每次都要刷新一下
    service.getMoneyDetail().then(function(res) {
      //请求成功后
      $scope.entity = res;

    }, function(rej) {
      msgService.errShow(rej.message);
    });

    //已投项目
    $scope.tapMyProject = function() {
      $state.go("user.myproject");
    }

    //资金明细
    $scope.tapBill = function() {;
      $state.go("user.bill");
    }
    $scope.getAccountMsg();
  }
]);

//资金明细==账单详情
userModule.controller('billController', ['$scope', '$state', 'userService', 'msgService',
  function($scope, $state, service, msgService) {
    if (_UID_ < 0) {
      msgService.errShow("请先登录");
      $state.go("user.regist");
      return;
    };
    //1、首先，获取账单类型列表  
    $scope.selectType = {}; //选择的类型
    service.getBillType().then(function(res) {
      $scope.billTypeList = res.billTypeList
    }, function(rej) {
      msgService.errShow(rej.message);
    });

    //打开选择时间
    $scope.dateOpen = function($event, type) {
      $event.preventDefault();
      $event.stopPropagation();
      if (type === 1) {
        $scope.opened = true;
        $scope.opened2 = false;
      } else if (type === 2) {
        $scope.opened = false;
        $scope.opened2 = true;
      }
    };
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.maxDate = new Date();

    $scope.change = function(type) {
        $scope.changeType();
      }
      //选择类型
    $scope.changeType = function() {
      page = 1;
      $scope.billList = [];
      $scope.getBillList();
    };

    //获取账单列表
    var size = 10,
      page = 1;
    $scope.getBillList = function() {
      if (!$scope.selectType) {
        $scope.selectType = {};
      };
      var params = {};
      params["billType"] = $scope.selectType.id;
      params["start"] = $scope.dateStart;
      params["end"] = $scope.dateEnd + " 59:59:00";
      params["pageNumber"] = page;
      params["pageSize"] = size;
      $scope.more = true;
      $scope.loading = true;
      service.getBillList(params).then(function(res) {
        $scope.loading = false;
        //请求成功后
        if (page == 1) {
          $scope.billList = res.billList;
        } else {
          for (var i = 0; i < res.billList.length; i++) {
            $scope.billList.push(res.billList[i]);
          };
        };

        if (res.total / res.size < page) {
          $scope.more = false;
        } else {
          $scope.more = true;
        }
      }, function(rej) {
        $scope.loading = false;
        msgService.errShow(rej.message);
      });
    };
    $scope.getBillList();

    //加载更多……
    $scope.getBillListMore = function() {
      page++;
      $scope.getBillList();
    };
    $scope.ok = function() {
      $state.go('project.list');
    }
  }
]);

//已投项目
userModule.controller('myProjectController', ['$scope', '$state', 'userService', 'msgService', '$modal',
  function($scope, $state, service, msgService, $modal) {
    if (_UID_ < 0) {
      msgService.errShow("请先登录");
      $state.go("user.regist");
      return;
    };
    $scope.imgHead = __imgHead__;
    $scope.type = 1;
    var size = 10,
      page = 1;
    //切换tab
    $scope.tapBar = function(type) {
        $scope.type = type;
        page = 1;
        $scope.list = [];
        $scope.getRecordItem();
      }
      //资金明细
    $scope.getRecordItem = function() {
        var params = {};
        params["pageNumber"] = page;
        params["pageSize"] = size;
        params["type"] = $scope.type;
        $scope.more = true;
        $scope.loading = true;
        service.getRecordItem(params).then(function(res) {
          $scope.loading = false;
          //请求成功后
          console.log(res.projectList);
          if (page == 1) {
            $scope.list = res.projectList;
          } else {
            for (var i = 0; i < res.projectList.length; i++) {
              $scope.list.push(res.projectList[i]);
            };
          };

          if (res.total / res.size < page) {
            $scope.more = false;
          } else {
            $scope.more = true;
          }
        }, function(rej) {
          $scope.loading = false;
          msgService.errShow(rej.message);
        });
      }
      //加载更多……
    $scope.getRecordMore = function() {
        page++;
        $scope.getRecordItem();
      }
      //点击还款计划
    $scope.goPlan = function(item) {
      $state.go('user.plan', {
        'id': item.investId
      });
    }

    //点击合同    协议==合同
    $scope.goAgreement = function(url) {
      messageBox('合同', url);
    }

    //这个是弹框，弹出合同用的
    var messageBox = function(msg, url) {
        $modal.open({
          templateUrl: 'common/templates/message.partial.html',
          controller: ['$scope', function(scop) {
            scop.title = msg;
            scop.message = "<div style='width:100%;height:300px;-webkit-overflow-scrolling: touch;overflow: scroll;'><iframe height='100%' width='100%' type='text/html' src='" + url + "' frameborder='0' allowfullscreen></iframe></div>";
            scop.confirm = function() {
              scop.$close();
            }
          }]
        });
      }
      //点击立即投资
    $scope.goList = function() {
        $state.go("project.list");
      }
      //设置进度
    $scope.setProgress = function(progress) {
        return {
          width: progress + '%'
        }
      }
      //看项目详情
    $scope.goDetail = function(item) {
      console.log("点击详情");
      if (_UID_ > 0) {
        $state.go('project.detail', {
          'id': item.projectId
        });
      } else {
        console.log('我的账户' + _UID_);
        msgService.errShow("请先登录");
        $state.go('user.regist');
        return;
      };
    }
    $scope.getRecordItem();
  }
]);

//还款计划
userModule.controller('planController', ['$scope', '$state', '$stateParams', 'userService', 'msgService',
  function($scope, $state, $stateParams, service, msgService) {
    //赚取金额＝回收金额-bidAmount
    //还款计划
    $scope.more = true;
    $scope.getRecordPlan = function() {
      service.getRecordPlan($stateParams.id).then(function(res) {
        //请求成功后
        $scope.list = res.repaymentPlanList;
        $scope.borrowTitle = res.borrowTitle;
        $scope.borrowId = res.borrowId;
        $scope.paymentMode = res.paymentMode;
      }, function(rej) {
        msgService.errShow(rej.message);
      });
    }
    $scope.getRecordPlan();
  }
]);

//实名认证
userModule.controller('realnameController', ['$scope', '$state', '$timeout', 'userService', 'msgService', 'cookieService',
  function($scope, $state, $timeout, service, msgService, cookieService) {
    // if (_UID_ < 0) {
    //   msgService.errShow("请先登录");
    //   $state.go("user.regist");
    //   return;
    // };
    $scope.step = 1; //1,身份验证 2，验证成功 3，验证失败 4，余额不足
    //身份证认证
    $scope.realName = ''; //真实姓名
    $scope.cardId = ''; //身份证号码
    $scope.isShowBalance = false;
    $scope.erroMsg = "验证失败，请重新验证！";
    $scope.confirm = function() {
      if ($scope.step == 1) {
        //第一步，验证身份
        if ($scope.realName.length == 0) {
          msgService.errShow('请输入姓名');
          return;
        }
        if ($scope.cardId.length == 0) {
          msgService.errShow('请输入身份证');
          return;
        }
        var regCardid15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        var regCardid18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (!(regCardid15.test($scope.cardId) || regCardid18.test($scope.cardId))) {
          msgService.errShow('身份证号码不合法');
          return;
        };

        var params = {};
        params["idNo"] = $scope.cardId;
        params["realName"] = $scope.realName;
        //实名认证过几次times
        service.getIdCardTime().then(function(res) {
          $scope.times = res;
          if ($scope.times.idNoAuthCount == '2' && ($scope.times.authenticationCost / 1.0) > ($scope.times.accountBalance / 1.0)) {
            console.log('您的可用余额不足，请充值！');
            $scope.step = 4;
            return;
          };
          //实名认证
          service.setIdCard(params).then(function(res) {
            if (res.code == 0) {
              //验证成功
              $scope.step = 2;
            } else {
              //验证失败
              $scope.step = 3;
              $scope.erroMsg = res.message;
              $scope.getIdCardTime();
            };
          }, function(rej) {
            msgService.errShow(rej.message);
          });
        }, function(rej) {
          msgService.errShow(rej.message);
        });
      } else if ($scope.step == 2) {
        //第二步，验证成功，跳到我的账户页
        $state.go("user.index");
      } else if ($scope.step == 3) {
        //第三步，验证失败，跳到我的账户页
        $scope.step = 1;
      } else {
        //第四步，验证失败，可用余额不足！
        $scope.step = 1;
      };
    }

    //刷新次数
    $scope.isShowBalance = false;
    $scope.getIdCardTime = function() {
      service.getIdCardTime().then(function(res) {
        console.log('刷新次数');
        $scope.times = res;
        if ($scope.times.idNoAuthCount == '0') {
          $scope.isShowBalance = false;
          console.log('您的认证还有2次免费机会，从第3次认证开始需要支付5元手续费。');
        } else if ($scope.times.idNoAuthCount == '1') {
          $scope.isShowBalance = false;
          console.log('您的认证还有1次免费机会，从第3次认证开始需要支付5元手续费。');
        } else if ($scope.times.idNoAuthCount == '2') {
          $scope.isShowBalance = true;
          console.log('您的认证还有0次免费机会，每次认证需要支付5元手续费。');
        } else {
          $scope.isShowBalance = true;
          console.log('您的认证还有0次免费机会，每次认证需要支付5元手续费。');
        };
      }, function(rej) {
        msgService.errShow(rej.message);
      });
    }
    $scope.getIdCardTime();
  }
]);

//注册
userModule.controller('registController', ['$scope', '$state', '$timeout', 'userService', 'msgService', 'cookieService', '$modal',
  function($scope, $state, $timeout, service, msgService, cookieService, $modal) {
    //如果已经登录，就直接调到我的账户
    if (_UID_ < 0) {
      //判断是否实名认证
      service.getUid().then(function(res) {
        _UID_ = res.uid;
        if (_UID_ > 0) {
          $state.go("user.index");
          return;
        };
        //注册包括两部分：注册、登录
        //----公共部分----
        $scope.registType = 'register'; //register  login 登录注册类型
        //图片验证码
        $scope.imgUrl = "/pl/verifycode/image?v=" + new Date() * 1;
        $scope.imgCodeRefresh = function() {
            //刷新图片
            $scope.imgUrl = "/pl/verifycode/image?v=" + new Date() * 1;
          }
          //切换tab
        $scope.tapBar = function(type) {
          $scope.registType = type;
          $scope.errorText = ''; //错误信息
          //初始化--错误信息的显示：form可以验证，但是我不会，按照我的想法来做，可能会比较麻烦，不过逻辑我很了解
          //----登录错误信息----
          $scope.error_phone_login = false; //登录手机号是否错误
          $scope.error_phoneCode_login = false; //登录手机验证码是否错误
          $scope.error_img_login = false; //登录图形验证码是否错误
          $scope.loding_login = false;
          //----注册错误信息----
          $scope.error_phone_register = false; //注册手机号是否错误
          $scope.error_phoneCode_register = false; //注册手机验证码是否错误
          $scope.error_img_register = false; //注册图形验证码是否错误
          $scope.error_pwd_register = false; //注册交易是否错误
          $scope.error_traPwd_register = false; //注册交易密码是否错误
          $scope.error_nickName_register = false; //注册昵称是否错误
          $scope.error_comm_register = false; //注册推荐码是否错误
          $scope.loding_register = false;
        }

        //----登录----
        //登录：初始化
        $scope.inputImgCode_login = ''; //登录输入的图形验证码
        $scope.phone_login = ''; //登录手机号
        $scope.phoneCode_login = ''; //登录：手机验证码

        //登录：失去焦点--手机号,
        $scope.blurPhoneLogin = function() {
          $scope.error_phone_login = false; //登录手机号是否错误
          //验证手机是否为空
          if ($scope.phone_login.length == 0) {
            $scope.error_phone_login = true; //登录手机号是否错误
            $scope.errorText = '请输入手机号';
            return;
          };
          //验证手机是否合法
          var reg = /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/;
          if (!reg.test($scope.phone_login)) {
            $scope.error_phone_login = true; //登录手机号是否错误
            $scope.errorText = '手机号格式错误';
            return;
          };
          //检查手机号是否存在
          var params = {};
          params["phone"] = $scope.phone_login;
          service.getCheckPhone(params).then(function(res) {
            if (res.code == 0) {
              //不存在
              msgService.errShow('手机号不存在,请先注册');
            }
          }, function(rej) {
            msgService.errShow(rej.message);
          });
        }

        //登录：----获取手机验证码----
        $scope.getPhoneCodeLogin = function(verifytype) {
            $scope.show_down1_login = false; //登录：是否显示短信按钮
            $scope.show_down2_login = false; //登录：是否显示语音按钮
            $scope.time_down_login = 180; //倒计时时间
            $scope.time_text_login = '180秒后重新获取'; //倒计时时间文本

            $scope.errorText = '';
            $scope.error_phone_login = false; //登录手机号是否错误
            $scope.error_phoneCode_login = false; //登录手机验证码是否错误
            $scope.error_img_login = false; //登录图形验证码是否错误
            //验证手机是否为空
            if ($scope.phone_login.length == 0) {
              $scope.error_phone_login = true; //登录手机号是否错误
              $scope.errorText = '请输入手机号';
              return;
            };
            //验证手机是否合法
            var reg = /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/;
            if (!reg.test($scope.phone_login)) {
              $scope.error_phone_login = true; //登录手机号是否错误
              $scope.errorText = '手机号格式错误';
              return;
            };
            //验证图片验证码的长度
            if ($scope.inputImgCode_login.length == 0) {
              $scope.error_img_login = true; //登录图形验证码是否错误
              $scope.errorText = '请输入图形验证码';
              return;
            };
            if ($scope.inputImgCode_login.length != 4) {
              $scope.error_img_login = true; //登录图形验证码是否错误
              $scope.errorText = '请输入正确的图形验证码';
              return;
            };
            var params = {};
            params["inputImageCode"] = $scope.inputImgCode_login; //登录的图形验证码
            params["generatedImageCode"] = ''; //cookie中的图形验证码 这个不传
            params["phoneNumber"] = $scope.phone_login; //手机号
            params["functionType"] = $scope.registType; //登录注册：类型login  register
            params["verifyCodeType"] = verifytype; //类型：1短信，2语音
            //获取手机验证码
            service.getPhoneCode(params).then(function(res) {
              if (res.code == 0) {
                msgService.errShow('发送成功请查收');
                //登录:按扭呈现倒计时的效果！
                if (verifytype == 1) {
                  $scope.show_down1_login = true; //登录：是否显示短信按钮
                } else {
                  $scope.show_down2_login = true; //登录：是否显示语音按钮
                };
                $scope.time_text_login = $scope.time_down_login + '秒后重新获取';
                var timeoutLogin = function() {
                  if ($scope.time_down_login > 0) {
                    $scope.time_down_login--;
                    $scope.time_text_login = $scope.time_down_login + '秒后重新获取';
                  } else {
                    clearInterval(timer);
                    $scope.show_down1_login = false; //登录：是否显示短信按钮
                    $scope.show_down2_login = false; //登录：是否显示语音按钮
                    $scope.time_down_login = 180; //倒计时时间
                    $scope.time_text_login = '180秒后重新获取'; //倒计时时间文本
                  }
                  $scope.$digest(); // 通知视图模型的变化
                }
                timer = setInterval(timeoutLogin, 1000);
              } else if (res.code == -108) {
                //图形验证码不对
                $scope.error_img_login = true; //登录图形验证码是否错误
                $scope.errorText = '请输入正确的图形验证码';
              } else {
                msgService.errShow(res.message);
              }
            }, function(rej) {
              msgService.errShow(rej.message);
            });
          }
          //登录:----绑定账户（测试环境的验证码都没有验证是，正式环境加）----
        $scope.login = function() {
          $scope.error_phone_login = false; //登录手机号是否错误
          $scope.error_phoneCode_login = false; //登录手机验证码是否错误
          $scope.errorText = '';
          //验证手机是否为空
          if ($scope.phone_login.length == 0) {
            $scope.error_phone_login = true;
            $scope.errorText = '请输入手机号';
            return;
          };
          //验证手机是否合法
          var reg = /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/;
          if (!reg.test($scope.phone_login)) {
            $scope.error_phone_login = true;
            $scope.errorText = '手机号格式错误';
            return;
          };
          //手机验证码是否为空
          if ($scope.phoneCode_login.length == 0) {
            $scope.error_phoneCode_login = true;
            $scope.errorText = '请输入手机验证码';
            return;
          }
          //手机验证码是否为6位
          if ($scope.phoneCode_login.length != 6) {
            $scope.error_phoneCode_login = true;
            $scope.errorText = '请输入正确的手机验证码';
            return;
          }

          var params = {};
          params["phone"] = $scope.phone_login;
          params["verifyCode"] = $scope.phoneCode_login;
          params["verifyType"] = 'login';
          $scope.loding_login = true;
          service.login(params).then(function(res) {
            $scope.loding_login = false;
            if (res.code == 0) {
              _UID_ = res.uid;
              // 判断是否登录成功，如果成功判断是否实名认证，如果认证就跳我的账户，如果没有认证跳到实名认证
              if (res.isAuth) {
                //认证过，直接调资金管理页面
                $state.go("user.index");
              } else {
                //未认证过，直接调实名认证
                $state.go("user.realname");
              };
            } else {
              msgService.errShow(res.message);
            };
          }, function(rej) {
            $scope.loding_login = false;
            msgService.errShow(rej.message);
          });
        }

        //----注册-----
        //注册：初始化
        $scope.phone_register = ''; //注册手机号
        $scope.phoneCode_register = ''; //注册：手机验证码
        $scope.inputImgCode_register = ''; //注册输入的图形验证码
        $scope.nickName_register = ''; //注册时：昵称
        $scope.loginPassword_register = ''; //注册时：登录密码
        $scope.traPassword_register = ''; //注册时：交易密码
        $scope.commendPhone_register = ''; //注册时：邀请码、推荐码
        $scope.agreementUrl_register = '/pl/register/agreement'; //协议地址
        $scope.isAgree = true; //同意协议
        $scope.isOpenThird = true; //第三方首信易
        //各种失去焦点-----手机号，昵称-------因为要判断是否在服务器上存在
        //--手机号失去焦点--
        $scope.blurPhoneRegister = function() {
            $scope.error_phone_register = false; //注册手机号是否错误
            //验证手机是否为空
            if ($scope.phone_register.length == 0) {
              $scope.error_phone_register = true; //注册手机号是否错误
              $scope.errorText = '请输入手机号';
              return;
            };
            //验证手机是否合法
            var reg = /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/;
            if (!reg.test($scope.phone_register)) {
              $scope.error_phone_register = true; //注册手机号是否错误
              $scope.errorText = '手机号格式错误';
              return;
            };
            //检查手机号是否存在
            var params = {};
            params["phone"] = $scope.phone_register;
            service.getCheckPhone(params).then(function(res) {
              if (res.code != 0) {
                //存在
                msgService.errShow('手机号已存在,请重新输入');
              }
            }, function(rej) {
              msgService.errShow(rej.message);
            });
          }
          //--昵称失去焦点--
        $scope.blurNickNameRegister = function() {
            //昵称的是否为空
            if ($scope.nickName_register.length == 0) {
              return;
            };
            //昵称的长度
            if ($scope.nickName_register.length < 2 || $scope.nickName_register.length > 20) {
              return;
            };
            if (!/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test($scope.nickName_register)) {
              return;
            }
            if (!$scope.nickName_register || $scope.nickName_register.substr(0, 1) == "_") {
              return;
            }

            //检查昵称是否存在
            var params = {};
            params["nickname"] = $scope.nickName_register;
            service.getCheckNickName(params).then(function(res) {
              if (res.code != 0) {
                //存在
                msgService.errShow('昵称已存在,请重新输入');
              }
              return;
            }, function(rej) {
              msgService.errShow(rej.message);
            });
          }
          //注册：----获取手机验证码----
        $scope.getPhoneCodeRegister = function(verifytype) {
          $scope.show_down1_register = false; //注册：是否显示短信按钮
          $scope.show_down2_register = false; //注册：是否显示语音按钮
          $scope.time_down_register = 180; //倒计时时间
          $scope.time_text_register = '180秒后重新获取'; //倒计时时间文本

          $scope.errorText = '';
          $scope.error_phone_register = false; //注册手机号是否错误
          $scope.error_phoneCode_register = false; //注册手机验证码是否错误
          $scope.error_img_register = false; //注册图形验证码是否错误
          $scope.error_pwd_register = false; //注册交易是否错误
          $scope.error_traPwd_register = false; //注册交易密码是否错误
          $scope.error_nickName_register = false; //注册昵称是否错误
          $scope.error_comm_register = false; //注册推荐码是否错误
          //验证手机是否为空
          if ($scope.phone_register.length == 0) {
            $scope.error_phone_register = true; //注册手机号是否错误
            $scope.errorText = '请输入手机号';
            return;
          };
          //验证手机是否合法
          var reg = /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/;
          if (!reg.test($scope.phone_register)) {
            $scope.error_phone_register = true; //注册手机号是否错误
            $scope.errorText = '手机号格式错误';
            return;
          };
          //验证图片验证码的长度
          if ($scope.inputImgCode_register.length == 0) {
            $scope.error_img_register = true; //注册图形验证码是否错误
            $scope.errorText = '请输入图形验证码';
            return;
          };
          if ($scope.inputImgCode_register.length != 4) {
            $scope.error_img_register = true; //注册图形验证码是否错误
            $scope.errorText = '请输入正确的图形验证码';
            return;
          };
          var params = {};
          params["inputImageCode"] = $scope.inputImgCode_register; //注册的图形验证码
          params["generatedImageCode"] = ''; //cookie中的图形验证码 这个不传
          params["phoneNumber"] = $scope.phone_register; //手机号
          params["functionType"] = $scope.registType; //注册注册：类型login  register
          params["verifyCodeType"] = verifytype; //类型：1短信，2语音
          //获取手机验证码
          service.getPhoneCode(params).then(function(res) {
            if (res.code == 0) {
              msgService.errShow('发送成功请查收');
              //注册:按扭呈现倒计时的效果！
              if (verifytype == 1) {
                $scope.show_down1_register = true; //注册：是否显示短信按钮
              } else {
                $scope.show_down2_register = true; //注册：是否显示语音按钮
              };
              $scope.time_text_register = $scope.time_down_register + '秒后重新获取';
              var timeoutRegister = function() {
                if ($scope.time_down_register > 0) {
                  $scope.time_down_register--;
                  $scope.time_text_register = $scope.time_down_register + '秒后重新获取';
                } else {
                  clearInterval(timer);
                  $scope.show_down1_register = false; //注册：是否显示短信按钮
                  $scope.show_down2_register = false; //注册：是否显示语音按钮
                  $scope.time_down_register = 180; //倒计时时间
                  $scope.time_text_register = '180秒后重新获取'; //倒计时时间文本
                }
                $scope.$digest(); // 通知视图模型的变化
              }
              timer = setInterval(timeoutRegister, 1000);
            } else if (res.code == -108) {
              //图形验证码不对
              $scope.error_img_register = true; //登录图形验证码是否错误
              $scope.errorText = '请输入正确的图形验证码';
            } else {
              msgService.errShow(res.message);
            }
          }, function(rej) {
            msgService.errShow(rej.message);
          });
        }

        $scope.register = function() {
          $scope.errorText = '';
          $scope.error_phone_register = false; //注册手机号是否错误
          $scope.error_phoneCode_register = false; //注册手机验证码是否错误
          $scope.error_img_register = false; //注册图形验证码是否错误
          $scope.error_pwd_register = false; //注册登录是否错误
          $scope.error_traPwd_register = false; //注册交易密码是否错误
          $scope.error_nickName_register = false; //注册昵称是否错误
          $scope.error_comm_register = false; //注册推荐码是否错误
          //验证手机是否为空
          if ($scope.phone_register.length == 0) {
            $scope.error_phone_register = true;
            $scope.errorText = '请输入手机号';
            return;
          };
          //验证手机是否合法
          var regPhone = /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/;
          if (!regPhone.test($scope.phone_register)) {
            $scope.error_phone_register = true;
            $scope.errorText = '手机号格式错误';
            return;
          };
          //手机验证码是否为空
          if ($scope.phoneCode_register.length == 0) {
            $scope.error_phoneCode_register = true;
            $scope.errorText = '请输入手机验证码';
            return;
          }
          //手机验证码是否为6位
          if ($scope.phoneCode_register.length != 6) {
            $scope.error_phoneCode_register = true;
            $scope.errorText = '请输入正确的手机验证码';
            return;
          }
          //昵称的是否为空
          if ($scope.nickName_register.length == 0) {
            $scope.error_nickName_register = true;
            $scope.errorText = '请输入昵称';
            return;
          };
          //昵称的长度
          if ($scope.nickName_register.length < 2 || $scope.nickName_register.length > 20) {
            $scope.error_nickName_register = true;
            $scope.errorText = '昵称长度为2-20个字符';
            return;
          };
          if (!/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test($scope.nickName_register)) {
            $scope.error_nickName_register = true;
            $scope.errorText = '昵称只能包含汉字,数字,字母及_,不能以_开头';
            return;
          }
          if (!$scope.nickName_register || $scope.nickName_register.substr(0, 1) == "_") {
            $scope.error_nickName_register = true;
            $scope.errorText = '昵称只能包含汉字,数字,字母及_,不能以_开头';
            return;
          }
          //登录密码是否为空
          if ($scope.loginPassword_register.length == 0) {
            $scope.error_pwd_register = true;
            $scope.errorText = '密码不能为空';
            return;
          }
          //登录密码的长度
          if ($scope.loginPassword_register.length < 6 || $scope.loginPassword_register.length > 20) {
            $scope.error_pwd_register = true;
            $scope.errorText = '密码长度为6-20位';
            return;
          }
          //交易密码是否为空
          if ($scope.traPassword_register.length == 0) {
            $scope.error_traPwd_register = true;
            $scope.errorText = '交易密码不能为空';
            return;
          }
          //交易密码的长度
          if ($scope.traPassword_register.length < 6 || $scope.traPassword_register.length > 20) {
            $scope.error_traPwd_register = true;
            $scope.errorText = '交易密码长度为6-20位';
            return;
          }
          //交易密码不能与登录密码一致
          if ($scope.traPassword_register == $scope.loginPassword_register) {
            $scope.error_traPwd_register = true;
            $scope.errorText = '交易密码不能与登录密码一致';
            return;
          }
          //判断邀请码是否正确
          if ($scope.commendPhone_register.length != 0 && $scope.commendPhone_register.length != 8 && $scope.commendPhone_register.length != 11) {
            $scope.error_comm_register = true;
            $scope.errorText = '邀请代码有误，请重新输入';
            return;
          }
          if (!$scope.isAgree) {
            msgService.errShow("请同意阅读并接受多美协议");
            return;
          };
          if (!$scope.isOpenThird) {
            msgService.errShow("请确定开通首信易支付资金账户");
            return;
          };
          var params = {};
          params["phone"] = $scope.phone_register;
          params["loginPwd"] = $scope.loginPassword_register;
          params["tradePwd"] = $scope.traPassword_register;
          params["randKey"] = $scope.commendPhone_register;
          params["verifyCode"] = $scope.phoneCode_register;
          params["nickName"] = $scope.nickName_register;
          params["verifyType"] = 'register';
          $scope.loding_register = true;
          service.register(params).then(function(res) {
            $scope.loding_register = false;
            //注册成功后跳到绑定账户页面
            if (res.code == 0) {
              _UID_ = res.uid;
              //注册成功,调实名认证
              $state.go("user.realname");
            } else {
              msgService.errShow(res.message);
            };

          }, function(rej) {
            $scope.loding_register = false;
            msgService.errShow(rej.message);
          });
        }

        //点击合同
        $scope.goAgreement = function() {
          //协议==合同
          messageBox('服务协议');
        }

        //这个是弹框，弹出合同用的
        var messageBox = function(msg) {
          $modal.open({
            templateUrl: 'common/templates/message.partial.html',
            controller: ['$scope', function(scop) {
              scop.title = msg;
              scop.message = "<div style='width:100%;height:300px;-webkit-overflow-scrolling: touch;overflow: scroll;'><iframe height='100%' width='100%' type='text/html' src='" + $scope.agreementUrl_register + "' frameborder='0' allowfullscreen></iframe></div>";
              scop.confirm = function() {
                scop.$close();
              }
            }]
          });
        }


      }, function(rej) {});
    } else {
      $state.go("user.index");
      return;
    };
  }
]);

//还款计划:状态
userModule.filter('planState', function () {
  return function (type) {
    if(type == 1){
      return '未还';
    }else if(type == 2){
      return '已还';
    }else if(type == 3){
      return '逾期';
    }else{
      return ' ';
    }
  };
});
//账单:+ -
userModule.filter('billState', function () {
  return function (money,type) {
    if (!money) {
      return '--';
    };
    if(type == '1'){
      return '+'+(money/1).toFixed(2)+'元';
    }else{
      return '-'+(money/1).toFixed(2)+'元';
    }
  };
});
userModule.factory('userService', ['$http',
  function ($http) {
    var path="";
    return {
      login: function (params) {//登录==绑定账号
        return $http({
          url: path+'/pl/login',
          method: 'post',
          data:params
        });
      },
      register:function(params){//注册
        return $http({
          url: '/pl/reg',
          method: 'post',
          data:params
        });
      },
      getPhoneCode:function(params){//获取手机验证码
        return $http({
          url: '/pl/verifycode/phone',
          method: 'post',
          data:params
        });
      },
      setIdCard:function(params){//身份证认证
        return $http({
          url: '/pl/u/auth',
          method: 'post',
          data:params
        });
      },
      getIdCardTime:function(){//身份证认证
        return $http({
          url: '/pl/u/authentication/times',
          method: 'get'
        });
      },
      getAccountMsg:function(){//帐户信息
        return $http({
          url: '/pl/u/account/information',
          method: 'get'
        });
      },
      getMoneyDetail:function(){//资金管理
        return $http({
          url: '/pl/u/fund',
          method: 'get'
        });
      },
      getRecordItem:function(params){//已投项目
        return $http({
          url: '/pl/u/investment',
          method: 'get',
          params: params
        });
      },
      getRecordPlan:function(investId){//还款计划
        return $http({
          url: '/pl/u/investment/'+investId+'/repayment/plan',
          method: 'get'
        });
      },
      getBillType:function(){//账单类型
        return $http({
          url: '/pl/bill/type/list',
          method: 'get'
        });
      },
      getBillList:function(params){//账单列表
        return $http({
          url: '/pl/u/bill/list',
          method: 'get',
          params: params
        });
      },
      getCheckPhone:function(params){//检查手机号是否存在
        return $http({
          url: '/pl/check/phone',
          method: 'post',
          params: params
        });
      },
      getCheckNickName:function(params){//检查昵称是否存在
        return $http({
          url: '/pl/check/nickname',
          method: 'post',
          params: params
        });
      },
      getUid: function() { //是否实名认证
        return $http({
          url: '/pl/getuid',
          method: 'get'
        });
      }
    }
  }
]);

userModule.factory('msgService',['$timeout',function ($timeout) {
  return {
    msgShow:function(selector,msg){
      var container="<div class='pub_window tips_t' style='display:none;top:25%;'></div>";
      var JObj=$(container);
      $(selector).append(JObj);
      JObj.html(msg);
      JObj.css('display', 'block');
      JObj.addClass('BounceIn');    
      $timeout(function() {
        JObj.removeClass('BounceIn');  
        JObj.addClass('BounceOut');     
        $timeout(function(){
          JObj.removeClass('BounceOut');  
          JObj.css('display', 'none');
          $(selector).remove(JObj); 
        },1000); 
      },3000);
    },
    errShow:function(msg){
      $("#errBoxText").html(msg);
      $("#errBox").css("display","block");
      $timeout(function(){
        $("#errBox").css("display","none");  
      },1500)
    },
    errMsgByCode:function(code){
      var mshow = function(msg){
        $("#errBoxText").html(msg);
        $("#errBox").css("display","block");
        $timeout(function(){
          $("#errBox").css("display","none");  
        },1500)
      };

      var msgKeyValue={
        "-1":"注册失败",
        "-5":"参数错误",
        "-13":"手机号或密码格式错误",
        "-3":"手机号已存在",
        "-4":"昵称已存在"
      };
      msgShow(msgKeyValue[code]);
      switch(code){
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


userModule.factory('cookieService',['$timeout',function ($timeout) {
  return {
    setCookie:function(name,value,time)
    {
      var exp = new Date();
      exp.setTime(exp.getTime() + time*1000);
      document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    },
    getCookie:function(name){
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg)){
        return (arr[2]);
      }else{
        return null;
      }
    },
    delCookie:function(name){
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval=getCookie(name);
      if(cval!=null){
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
      }
    }
  }
}]);

userModule.factory('safeApply', function($rootScope) {
    return function(scope, fn) {
        var phase = scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && ( typeof (fn) === 'function')) {
                fn();
            }
        } else {
            scope.$apply(fn);
        }
    }
});
angular.module('templates', ['common/templates/layout.partials.html', 'common/templates/message.partial.html', 'modules/project/templates/detail.html', 'modules/project/templates/invest.html', 'modules/project/templates/list.html', 'modules/project/templates/records.html', 'modules/user/templates/bill.html', 'modules/user/templates/index.html', 'modules/user/templates/myproject.html', 'modules/user/templates/plan.html', 'modules/user/templates/realname.html', 'modules/user/templates/regist.html']);

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
    "<div class=\"modal-body\" ng-bind-html=\"message|agreeSafe\"></div>\n" +
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
    "                        <div class=\"progress-bar\" style=\"width:{{(entity.borrowAmount-entity.remainingAmount)/entity.borrowAmount*100}}%;\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <p class=\"floatL\">\n" +
    "                        {{((entity.borrowAmount-entity.remainingAmount)/entity.borrowAmount*100).toFixed(0)}}%\n" +
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
    "                    <div ng-if=\"entity.productType==1||entity.productType==4\">\n" +
    "                        <p class=\"rate\">\n" +
    "                            <i>\n" +
    "                             {{(entity.annualRate/1).toFixed(0)}}%\n" +
    "                            </i>\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"entity.productType==2||entity.productType==3\">\n" +
    "                        <p class=\"rate\">\n" +
    "                            <i>\n" +
    "                              {{(entity.annualRate-entity.extendCarRate).toFixed(0)}}+{{entity.extendCarRate}}%\n" +
    "                            </i>\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                    <p class=\"month\">\n" +
    "                        <i>\n" +
    "                            {{entity.deadline}}\n" +
    "                        </i> 个月\n" +
    "                    </p>\n" +
    "                    <p class=\"total\">\n" +
    "                        <i>\n" +
    "                            {{entity.borrowAmount/10000.0}}\n" +
    "                            <!-- {{entity.borrowAmount/10000.0}} -->\n" +
    "                        </i> 万\n" +
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
    "                <li ng-show=\"entity.projectDescription.projectDescription.length!=0\">\n" +
    "                    <p>1、项目描述</p>\n" +
    "                    <p ng-bind-html=\"entity.projectDescription.projectDescription|safe\">\n" +
    "                        <!-- {{entity.projectDescription.projectDescription}} -->\n" +
    "                    </p>\n" +
    "                </li>\n" +
    "                <li ng-show=\"entity.projectDescription.useOfFunds.length!=0\">\n" +
    "                    <p>2、资金用途</p>\n" +
    "                    <p ng-bind-html=\"entity.projectDescription.useOfFunds|safe\">\n" +
    "                        <!-- {{entity.projectDescription.useOfFunds}} -->\n" +
    "                    </p>\n" +
    "                </li>\n" +
    "                <li ng-show=\"entity.projectDescription.sourceOfRepayment.length!=0\">\n" +
    "                    <p>3、还款来源</p>\n" +
    "                    <p ng-bind-html=\"entity.projectDescription.sourceOfRepayment|safe\">\n" +
    "                        <!-- {{entity.projectDescription.sourceOfRepayment}} -->\n" +
    "                    </p>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div ng-if=\"entity.productType==1||entity.productType==4\">\n" +
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
    "                        <li ng-bind-html=\"entity.enterpriseInformation|safe\" style=\"font-size:16px;color:#808080\">\n" +
    "                            <p>\n" +
    "                                {{entity.enterpriseInformation}}\n" +
    "                            </p>\n" +
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
    "                    <li ng-bind-html=\"entity.guaranteeInformation|safe\" style=\"font-size:16px;color:#808080\">\n" +
    "                        <p>\n" +
    "                            {{entity.guaranteeInformation}}\n" +
    "                        </p>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"entity.productType==2||entity.productType==3\">\n" +
    "            <div class=\"pub_fold qiye_data\" ng-click=\"showTab('danbdepartment')\">\n" +
    "                <div class=\"styh3\">\n" +
    "                    <h3>\n" +
    "                        担保机构\n" +
    "                    </h3>\n" +
    "                    <span ng-class=\"{upward:selectTab!='danbdepartment',down:selectTab=='danbdepartment'}\">\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <ul class=\"data_ul\" ng-show=\"selectTab=='danbdepartment'\">\n" +
    "                    <li ng-bind-html=\"entity.guaranteeAgency|safe\" style=\"font-size:16px;color:#808080\">\n" +
    "                        <p>{{entity.guaranteeAgency}}</p>\n" +
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
    "                    <li ng-bind-html=\"entity.windControlInformation|safe\" style=\"font-size:16px;color:#808080\">\n" +
    "                        <p>{{entity.windControlInformation}}</p>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"entity.productType==4\">\n" +
    "            <div class=\"pub_fold qiye_data\" ng-click=\"showTab('valueAddedService')\">\n" +
    "                <div class=\"styh3\">\n" +
    "                    <h3>\n" +
    "                        增值服务\n" +
    "                    </h3>\n" +
    "                    <span ng-class=\"{upward:selectTab!='valueAddedService',down:selectTab=='valueAddedService'}\">\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <ul class=\"data_ul\" ng-show=\"selectTab=='valueAddedService'\">\n" +
    "                    <li ng-bind-html=\"entity.valueAddedService|safe\" style=\"font-size:16px;color:#808080\">\n" +
    "                        <p>{{entity.valueAddedService}}</p>\n" +
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
    "                        <th width=\"36%\" ng-if=\"!(entity.borrowStatus==3||entity.borrowStatus==5||entity.paymentMode==4)\">\n" +
    "                            月还本息(元)\n" +
    "                        </th>\n" +
    "                        <th width=\"36%\" ng-if=\"entity.borrowStatus==3||entity.borrowStatus==5||entity.paymentMode==4\">\n" +
    "                            还款金额(元)\n" +
    "                        </th>\n" +
    "                        <th width=\"36%\" ng-if=\"!(entity.borrowStatus==3||entity.borrowStatus==5||entity.paymentMode==4)\">\n" +
    "                            待还本息(元)\n" +
    "                        </th>\n" +
    "                        <th width=\"36%\" ng-if=\"entity.borrowStatus==3||entity.borrowStatus==5||entity.paymentMode==4\">\n" +
    "                            状态\n" +
    "                        </th>\n" +
    "                    </tr>\n" +
    "                    <tr ng-repeat=\"item in entity.repaymentPlan.repaymentList\">\n" +
    "                        <td>\n" +
    "                            <p>\n" +
    "                                {{item.mon}}\n" +
    "                            </p>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <p class=\"corblue\" ng-if=\"!(entity.borrowStatus==3||entity.borrowStatus==5||entity.paymentMode==4)\">\n" +
    "                                {{item.monPay}}\n" +
    "                            </p>\n" +
    "                            <p class=\"corblue\" ng-if=\"entity.borrowStatus==3||entity.borrowStatus==5||entity.paymentMode==4\">\n" +
    "                                {{item.repaymentAmount}}\n" +
    "                            </p>\n" +
    "                        </td>\n" +
    "                        <td>\n" +
    "                            <p class=\"corred\" ng-if=\"!(entity.borrowStatus==3||entity.borrowStatus==5||entity.paymentMode==4)\">\n" +
    "                                {{item.payRemain}}\n" +
    "                            </p>\n" +
    "                            <p class=\"corred\" ng-if=\"entity.borrowStatus==3||entity.borrowStatus==5||entity.paymentMode==4\">\n" +
    "                                {{item.status}}\n" +
    "                            </p>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                    <tr>\n" +
    "                        <td colspan=\"3\">\n" +
    "                            <p>\n" +
    "                                <i class=\"corred\">\n" +
    "                                    *\n" +
    "                                </i> 项目成功募集前，还款日期待定，此还款方案为参考\n" +
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
    "            <div class=\"col-xs-12\" style=\"position:fixed;bottom:2%\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-show=\"entity.borrowStatus==1\" ng-click=\"goInvest()\">\n" +
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
    "-->\n" +
    "");
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
    "                            <span ng-if=\"entity.productType==1||entity.productType==4\">\n" +
    "                                {{(entity.annualRate/1).toFixed(0)}}%\n" +
    "                            </span>\n" +
    "                            <span ng-if=\"entity.productType==2||entity.productType==3\">\n" +
    "                                {{(entity.annualRate-entity.extendCarRate).toFixed(0)}}+{{entity.extendCarRate}}%\n" +
    "                            </span>\n" +
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
    "                    {{entity.remainingAmount}}元\n" +
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
    "                    <a href=\"javascript:void(0)\" class=\"corblue\" ng-click='goAgreement()'>\n" +
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
    "                <div class=\"radio\" ng-show=\"coupons.length!=1\" ng-repeat=\"item in coupons\">\n" +
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
    "                        <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"goStep2Invest()\" ng-disabled=\"lodingInvest\">\n" +
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
    "                        {{ (money/1).toFixed(2) }}元\n" +
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
    "                <div class=\"xmpublic\" ng-class=\"{huank_ing:item.borrowStatus==3||item.borrowStatus==5,yufa_ing:item.borrowStatus==2,toub_ing:item.borrowStatus!=2&&(item.borrowStatus!=3||item.borrowStatus!=5)}\" ng-click=\"goDetail(item)\">\n" +
    "                    <div class=\"styh4\">\n" +
    "                        <!-- <a href=\"xm_list_con.html\"> -->\n" +
    "                        <a href=\"\">\n" +
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
    "                            <div class=\"icon_3\" ng-if=\"item.borrowStatus==5\">\n" +
    "                                结\n" +
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
    "                            <div class=\"progress-bar\" style=\"width:{{(item.borrowAmount-item.remainingAmount)/item.borrowAmount*100}}%;\" ng-if=\"!(item.borrowStatus==3||item.borrowStatus==5)\">\n" +
    "                            </div>\n" +
    "                            <div class=\"progress-bar\" style=\"width:100%;\" ng-if=\"item.borrowStatus==3||item.borrowStatus==5\">\n" +
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
    "                            <i style=\"font-size:14px\">\n" +
    "                              {{item.annualRate-item.extendCarRate}}+{{item.extendCarRate}}%\n" +
    "                            </i>\n" +
    "                        </p>\n" +
    "                        </div>\n" +
    "                        <p class=\"month\">\n" +
    "                            <i style=\"font-size:14px\">\n" +
    "                                {{item.deadline}}个月\n" +
    "                            </i>\n" +
    "                        </p>\n" +
    "                        <p class=\"total\">\n" +
    "                            <i>\n" +
    "                                {{item.borrowAmount/10000.0}}万\n" +
    "                            </i>\n" +
    "                        </p>\n" +
    "                        <p class=\"start\">\n" +
    "                            <i style=\"font-size:14px\">\n" +
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
    "                {{entity.hasInvestAmount}}元\n" +
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
    "                <a href=\"javascript:\" class=\"more\" ng-if=\"entity.bidRecords.length!=0&&more\" ng-click=\"queryMore()\">加载更多</a>\n" +
    "                <a href=\"javascript:\" class=\"nomore\" ng-if=\"entity.bidRecords.length!=0&&!more\">没有更多</a>\n" +
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

angular.module("modules/user/templates/bill.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/user/templates/bill.html",
    "<div class=\"pubcent zijin_mx\">\n" +
    "    <div class=\"search_1\">\n" +
    "        <div>\n" +
    "            <select class=\"form-control\" ng-model=\"selectType\" ng-options=\"billtype.desc for billtype in billTypeList\" ng-change=\"changeType()\">\n" +
    "                <option value=\"\">类型</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <input type=\"date\" class=\"form-control\" ng-model=\"dateStart\" max-date='{{maxDate}}' ng-change=\"change(1)\" />\n" +
    "    <input type=\"date\" class=\"form-control\" ng-model=\"dateEnd\" max-date='{{maxDate}}' ng-change=\"change(2)\" />\n" +
    "    <!--  <div>\n" +
    "        结束日期\n" +
    "        <input type=\"date\" class=\"form-control\" ng-model=\"dateEnd\" max-date='{{maxDate}}' ng-change=\"change(2)\" />\n" +
    "    </div> -->\n" +
    "    <ul style=\"display:block;\">\n" +
    "        <li ng-repeat=\"item in billList\">\n" +
    "            <div class=\"col-xs-7\">\n" +
    "                <p>{{ item.billType }}</p>\n" +
    "                <span>{{ item.date }}</span>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-5\">\n" +
    "                <p ng-class=\"{corred:item.incomeOrExpenses==1,corgreen:item.incomeOrExpenses==2}\">{{ item.transactionAmount|billState:item.incomeOrExpenses}}</p>\n" +
    "                <span>结余：{{ (item.surplus/1.0).toFixed(2) }}元</span>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <div class=\"all_more\">\n" +
    "        <a href=\"javascript:\" class=\"more\" ng-show=\"billList.length!=0&&more&&!loading\" ng-click=\"getBillListMore()\">加载更多</a>\n" +
    "        <a href=\"javascript:\" class=\"more\" ng-show=\"loading\">加载中</a>\n" +
    "        <a href=\"javascript:\" class=\"nomore\" ng-show=\"billList.length!=0&&!more\">没有更多</a>\n" +
    "    </div>\n" +
    "    <div class=\"no_data\" ng-show=\"billList.length==0\">\n" +
    "        <div class=\"icon\"></div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"ok()\">立即投资</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/user/templates/index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/user/templates/index.html",
    "<div class=\"pubcent my_account\">\n" +
    "    <div class=\"big_bg\">\n" +
    "        <div class=\"money_zonge\"><span>{{entity.netAssetsAccount}}</span>元</div>\n" +
    "        <p class=\"fon16 text-center\">账户净资产</p>\n" +
    "        <div class=\"shouy_list\">\n" +
    "            <div class=\"col-xs-6 col-sm-6 lbor\">\n" +
    "                <dl class=\"floatR\">\n" +
    "                    <dt></dt>\n" +
    "                    <dd style=\"padding-left:0\">\n" +
    "                        <p>待收本息</p>\n" +
    "                        <p style=\"font-size:12px\">{{entity.totalWillReceivePI}}元</p>\n" +
    "                    </dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6 col-sm-6 rbor\">\n" +
    "                <dl class=\"floatL\">\n" +
    "                    <dt></dt>\n" +
    "                    <dd style=\"padding-left:0\">\n" +
    "                        <p>累计收益</p>\n" +
    "                        <p style=\"font-size:12px\">{{entity.accumulatedEarnings}}元</p>\n" +
    "                    </dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--资金列表-->\n" +
    "    <div class=\"tznublist\">\n" +
    "        <div class=\"row borbot\">\n" +
    "            <div class=\"col-xs-6 col-sm-6 lbor\">\n" +
    "                <dl>\n" +
    "                    <dt>\n" +
    "                        <p>冻结资金</p>\n" +
    "                    </dt>\n" +
    "                    <dd>\n" +
    "                        <p>{{entity.frozenFund}}元</p>\n" +
    "                    </dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6 col-sm-6 rbor\">\n" +
    "                <dl>\n" +
    "                    <dt>\n" +
    "                        <p>可用余额</p>\n" +
    "                    </dt>\n" +
    "                    <dd>\n" +
    "                        <p>{{entity.availableBalance}}元</p>\n" +
    "                    </dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-6 col-sm-6 lbor\">\n" +
    "                <dl>\n" +
    "                    <dt>\n" +
    "                        <p>投资资产</p>\n" +
    "                    </dt>\n" +
    "                    <dd>\n" +
    "                        <p>{{entity.investmentAssets}}元</p>\n" +
    "                    </dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6 col-sm-6 rbor\">\n" +
    "                <dl>\n" +
    "                    <dt>\n" +
    "                        <p>返利余额</p>\n" +
    "                    </dt>\n" +
    "                    <dd>\n" +
    "                        <p>{{entity.rebateBalance}}元</p>\n" +
    "                    </dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "            <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block marb1 green_but\" ng-click=\"tapMyProject()\">已投项目</button>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-12\">\n" +
    "            <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"tapBill()\">资金明细</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/user/templates/myproject.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/user/templates/myproject.html",
    "<div class=\"pubcent yitou_xm\">\n" +
    "    <ul class=\"marb1 nav nav-justified\">\n" +
    "        <li ng-class=\"{active: type == 1}\"><a href=\"javascript:\" ng-click=\"tapBar(1)\">回收中</a></li>\n" +
    "        <li ng-class=\"{active: type == 2,second: type == 1||type == 3}\"><a href=\"javascript:\" ng-click=\"tapBar(2)\">投标中</a></li>\n" +
    "        <li ng-class=\"{active: type == 3}\"><a href=\"javascript:\" ng-click=\"tapBar(3)\">已还清</a></li>\n" +
    "    </ul>\n" +
    "    <div class=\"xm_list\" ng-show=\"type == 1\">\n" +
    "        <ul class=\"huishou\" style=\"display:block;\">\n" +
    "            <li ng-repeat=\"item in list\" ng-class=\"{li_unfold: item.closed,li_default: !item.closed}\">\n" +
    "                <div class=\"styh4\" ng-click=\"item.closed=!item.closed\">\n" +
    "                    <h4>{{ item.borrowTitle }} {{ item.projectId }}</h4>\n" +
    "                </div>\n" +
    "                <div class=\"xm_con\" ng-show=\"item.closed\" >\n" +
    "                    <div class=\"jine_list\" ng-click=\"goDetail(item)\">\n" +
    "                        <p class=\"title\">投资金额</p>\n" +
    "                        <p class=\"money\">{{ (item.bidAmount/1.0).toFixed(2) }}元</p>\n" +
    "                    </div>\n" +
    "                    <div class=\"jine_list\" ng-click=\"goDetail(item)\">\n" +
    "                        <p class=\"title\">月收金额</p>\n" +
    "                        <p class=\"money\" ng-if=\"item.paymentMode==2\">{{ item.amountOfMonthlyIncome }}元</p>\n" +
    "                        <p class=\"money\" ng-if=\"item.paymentMode!=2\">--</p>\n" +
    "                    </div>\n" +
    "                    <div class=\"jine_list\" ng-click=\"goDetail(item)\">\n" +
    "                        <p class=\"title\">待收金额</p>\n" +
    "                        <p class=\"money\">{{ item.amountToBeReceived }}元</p>\n" +
    "                    </div>\n" +
    "                    <div class=\"bot_jh\">\n" +
    "                        <div class=\"floatL\">\n" +
    "                            <div class=\"botjh_c\"><span></span><a href=\"\" ng-click=\"goPlan(item)\">还款计划</a></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"floatR\">\n" +
    "                            <div class=\"botjh_c\"><span></span><a href=\"\" ng-click=\"goAgreement(item.loanAgreementURL)\">合同</a></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"xm_list\" ng-show=\"type == 2\">\n" +
    "        <ul class=\"toubiao\" style=\"display:block;\">\n" +
    "            <li ng-repeat=\"item in list\" ng-class=\"{li_unfold: item.closed,li_default: !item.closed}\">\n" +
    "                <div class=\"styh4\" ng-click=\"item.closed=!item.closed\">\n" +
    "                    <h4>{{ item.borrowTitle }} {{ item.projectId }}</h4>\n" +
    "                    <div class=\"jindu_t\">\n" +
    "                        <div class=\"pr_progress floatL\">\n" +
    "                            <div class=\"progress-bar\" ng-style=\"setProgress(item.tenderSchedule)\"></div>\n" +
    "                        </div>\n" +
    "                        <p class=\"floatR\">{{ (item.tenderSchedule/1).toFixed(0) }}%</p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"xm_con\" ng-show=\"item.closed\" >\n" +
    "                    <div class=\"jine_list\" ng-click=\"goDetail(item)\">\n" +
    "                        <p class=\"title\">投资金额</p>\n" +
    "                        <p class=\"money\">{{ (item.bidAmount/1.0).toFixed(2) }}元</p>\n" +
    "                    </div>\n" +
    "                    <div class=\"jine_list\" ng-click=\"goDetail(item)\">\n" +
    "                        <p class=\"title\">待收金额</p>\n" +
    "                        <p class=\"money\">{{ item.amountToBeReceived }}元</p>\n" +
    "                    </div>\n" +
    "                    <div class=\"bot_jh\">\n" +
    "                        <div class=\"floatR\">\n" +
    "                            <div class=\"botjh_c\"><span></span><a href=\"\" ng-click=\"goAgreement(item.loanAgreementURL)\">合同</a></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"xm_list\" ng-show=\"type == 3\">\n" +
    "        <ul class=\"huanqing\" style=\"display:block;\">\n" +
    "            <li ng-repeat=\"item in list\" ng-class=\"{li_unfold: item.closed,li_default: !item.closed}\">\n" +
    "                <div class=\"styh4\" ng-click=\"item.closed=!item.closed\">\n" +
    "                    <h4>{{ item.borrowTitle }} {{ item.projectId }}</h4>\n" +
    "                </div>\n" +
    "                <div class=\"xm_con\" ng-show=\"item.closed\" >\n" +
    "                    <div class=\"jine_list\" ng-click=\"goDetail(item)\">\n" +
    "                        <p class=\"title\">投资金额</p>\n" +
    "                        <p class=\"money\">{{ (item.bidAmount/1.0).toFixed(2) }}元</p>\n" +
    "                    </div>\n" +
    "                    <div class=\"jine_list\" ng-click=\"goDetail(item)\">\n" +
    "                        <p class=\"title\">回收金额</p>\n" +
    "                        <p class=\"money\">{{ (item.amountRecovered/1.0).toFixed(2) }}元</p>\n" +
    "                    </div>\n" +
    "                    <div class=\"jine_list\" ng-click=\"goDetail(item)\">\n" +
    "                        <p class=\"title\">赚取金额</p>\n" +
    "                        <p class=\"money\">{{ (item.amountRecovered-item.bidAmount).toFixed(2) }}元</p>\n" +
    "                    </div>\n" +
    "                    <div class=\"bot_jh\">\n" +
    "                        <div class=\"floatL\">\n" +
    "                            <div class=\"botjh_c\"><span></span><a href=\"\" ng-click=\"goPlan(item)\">还款计划</a></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"floatR\">\n" +
    "                            <div class=\"botjh_c\"><span></span><a href=\"\" ng-click=\"goAgreement(item.loanAgreementURL)\">合同</a></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"all_more\">\n" +
    "        <a href=\"javascript:\" class=\"more\" ng-show=\"list.length!=0&&more&&!loading\" ng-click=\"getRecordMore()\">加载更多</a>\n" +
    "        <a href=\"javascript:\" class=\"more\" ng-show=\"loading\">加载中</a>\n" +
    "        <a href=\"javascript:\" class=\"nomore\" ng-show=\"list.length!=0&&!more\">没有更多</a>\n" +
    "    </div>\n" +
    "    <div class=\"no_data\" style=\"display:block;\" ng-if=\"list.length==0\">\n" +
    "        <div class=\"icon\"></div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"goList()\">立即投资</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/user/templates/plan.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/user/templates/plan.html",
    "<div class=\"pubcent huank_jh\">\n" +
    "    <p class=\"fon18\">{{ borrowTitle }} {{ borrowId }}</p>\n" +
    "    <table class=\"table\">\n" +
    "        <tbody>\n" +
    "            <tr>\n" +
    "                <th width=\"37%\">还款日期</th>\n" +
    "                <th width=\"26%\">状态</th>\n" +
    "                <th width=\"37%\" ng-if=\"paymentMode!=4\">月收本息(元)</th>\n" +
    "                <th width=\"37%\" ng-if=\"paymentMode==4\">待收本息(元)</th>\n" +
    "            </tr>\n" +
    "            <tr ng-repeat=\"item in list\">\n" +
    "                <td>\n" +
    "                    <p>{{ item.date }}</p>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <p ng-class=\"{corred:item.status==2}\">{{ item.status | planState}}</p>\n" +
    "                </td>\n" +
    "                <td>\n" +
    "                    <p class=\"corblue\">{{ item.amount }}</p>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "    <div class=\"all_more\">\n" +
    "        <a href=\"javascript:\" class=\"nomore\" ng-show=\"list.length==0\">暂无还款计划</a>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/user/templates/realname.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/user/templates/realname.html",
    "<div class=\"pubcent renzheng\">\n" +
    "    <div class=\"fon18 corblack styltitle_1\"><i>实名认证</i><span></span></div>\n" +
    "    <form class=\"form-horizontal\" role=\"form\">\n" +
    "        <!--验证次数用完-->\n" +
    "        <div class=\"fon14 corred\" ng-show=\"isShowBalance\">可用余额：{{times.accountBalance}}元<span class=\"corblue\">（请在平台进行充值！）</span></div>\n" +
    "        <!--身份验证-->\n" +
    "        <div class=\"sfyz_info\" ng-show=\"step==1\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"姓名\" ng-model=\"realName\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"身份证\" ng-model=\"cardId\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <p class=\"fon12 tips_1\"><i class=\"corred marr3\">*</i>为了合同的有效性，只有实名认证后才能进行投资。</p>\n" +
    "                    <p class=\"fon12 tips_1\"><i class=\"corred marr3\">*</i>实名认证两次以上将收取5元/次手续费；暂时不支持军人身份证认证。</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--验证成功-->\n" +
    "        <div class=\"yanz_tip\" ng-show=\"step==2\">\n" +
    "            <div class=\"successful_tip\"></div>\n" +
    "            <p class=\"fon16 corgray text-center\">验证成功！</p>\n" +
    "        </div>\n" +
    "        <!--验证失败-->\n" +
    "        <div class=\"yanz_tip\" ng-show=\"step==3\">\n" +
    "            <div class=\"failure_tip\"></div>\n" +
    "            <p class=\"fon16 corgray text-center\">{{erroMsg}}</p>\n" +
    "        </div>\n" +
    "        <!--!!!验证失败时，请把下面\"确定\"按钮改成“重新验证”按钮!!!-->\n" +
    "        <div class=\"form-group\" ng-show=\"step!=4\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"confirm()\">确定</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--验证失败，可用余额不足-->\n" +
    "        <div class=\"yanz_tip\" ng-show=\"step==4\">\n" +
    "            <div class=\"failure_tip\"></div>\n" +
    "            <p class=\"fon16 corgray text-center\">验证失败，可用余额不足！</p>\n" +
    "            <p class=\"fon16 corblue padt1 text-center\">请在平台进行充值！</p>\n" +
    "        </div>\n" +
    "        <!--!!!验证失败时，请把下面按钮改成\"重新验证\"!!!-->\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("modules/user/templates/regist.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/user/templates/regist.html",
    "<!--注册/绑定页-->\n" +
    "<div class=\"pubcent register\">\n" +
    "    <div class=\"fon16 corblack\">绑定您的多美贷账号</div>\n" +
    "    <div class=\"fon12 corgray\">绑定成功后即可享受查看收益、便捷投资等一系列特权</div>\n" +
    "    <div class=\"bornone mart1 posit\">\n" +
    "        <div class=\"bacbg\">\n" +
    "            <span></span>\n" +
    "            <span class=\"second\"></span>\n" +
    "            <span class=\"third\"></span>\n" +
    "            <span class=\"fourth\"></span>\n" +
    "            <span></span>\n" +
    "        </div>\n" +
    "        <ul class=\"marb1 nav nav-justified\">\n" +
    "            <li ng-class=\"{active: registType == 'register'}\"><a href=\"javascript:\" ng-click=\"tapBar('register')\">新用户注册</a></li>\n" +
    "            <li ng-class=\"{active: registType == 'login'}\"><a href=\"javascript:\" ng-click=\"tapBar('login')\">已有账户</a></li>\n" +
    "        </ul>\n" +
    "        <!--新用户注册-->\n" +
    "        <form class=\"form-horizontal\" role=\"form\" style=\"display:block;\" ng-show=\"registType == 'register'\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"tel\" class=\"form-control\" placeholder=\"手机号\" ng-model=\"phone_register\" ng-blur=\"blurPhoneRegister()\" />\n" +
    "                    <div class=\"verify_tip\" ng-show=\"error_phone_register\">{{errorText}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"图形验证码\" ng-model=\"inputImgCode_register\" />\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-4\">\n" +
    "                    <div class=\"pic_yzm\" ><img ng-src=\"{{imgUrl}}\" ng-click=\"imgCodeRefresh()\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-12\"><div class=\"verify_tip\" ng-show=\"error_img_register\">{{errorText}}</div></div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"手机验证码\" ng-model=\"phoneCode_register\" />\n" +
    "                    <div class=\"verify_tip\" ng-show=\"error_phoneCode_register\">{{errorText}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-6\">\n" +
    "                    <input type=\"button\" value=\"短信获取\" class=\"determine\" ng-click=\"getPhoneCodeRegister(1)\" ng-show=\"!show_down1_register\" ng-disabled=\"show_down2_register\"/>\n" +
    "                    <input type=\"button\" ng-value=\"time_text_register\" class=\"countdown\" ng-show=\"show_down1_register\"/>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-6\">\n" +
    "                    <input type=\"button\" value=\"语音获取\" class=\"cancel\" ng-click=\"getPhoneCodeRegister(2)\" ng-show=\"!show_down2_register\" ng-disabled=\"show_down1_register\"/>\n" +
    "                    <input type=\"button\" ng-value=\"time_text_register\" class=\"countdown\" ng-show=\"show_down2_register\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"昵称\" ng-model=\"nickName_register\" ng-blur=\"blurNickNameRegister()\" />\n" +
    "                    <div class=\"verify_tip\" ng-show=\"error_nickName_register\">{{errorText}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"password\" class=\"form-control\" placeholder=\"密码\" ng-model=\"loginPassword_register\"/>\n" +
    "                    <div class=\"verify_tip\" ng-show=\"error_pwd_register\">{{errorText}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"password\" class=\"form-control\" placeholder=\"交易密码\" ng-model=\"traPassword_register\" />\n" +
    "                    <div class=\"verify_tip\" ng-show=\"error_traPwd_register\">{{errorText}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"推荐人手机号/邀请码,如无可不填\" ng-model=\"commendPhone_register\" />\n" +
    "                    <div class=\"verify_tip\" ng-show=\"error_comm_register\">{{errorText}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <label class=\"checkbox-inline regis_tip fon12\">\n" +
    "                        <input type=\"checkbox\" id=\"inlineCheckbox1\" value=\"option1\" ng-model=\"isAgree\">我已满18岁，已阅读并接受&nbsp;<a href=\"\" ng-click=\"goAgreement()\">服务协议</a>\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <label class=\"checkbox-inline regis_tip fon12\">\n" +
    "                        <input type=\"checkbox\" id=\"inlineCheckbox1\" value=\"option1\" ng-model=\"isOpenThird\">开通首信易支付资金账户&nbsp;<span class=\"corgray\">第三方平台托管，保障您的资金安全</span>\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"register()\" ng-disabled=\"loding_register\">注册并绑定</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <p class=\"fon12 tips_1\"><i class=\"icon_1\"></i>新用户注册成功，可获得15-95元不等的返利</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "        <!--登录：已有账户-->\n" +
    "        <form class=\"form-horizontal\" role=\"form\" style=\"display:block;\" ng-show=\"registType == 'login'\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"tel\" class=\"form-control\" placeholder=\"手机号\" ng-model=\"phone_login\" ng-blur=\"blurPhoneLogin()\"/>\n" +
    "                    <div class=\"verify_tip\" ng-show=\"error_phone_login\">{{errorText}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-8\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"图形验证码\"  ng-model=\"inputImgCode_login\"/>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-4\">\n" +
    "                    <div class=\"pic_yzm\" ng-click=\"imgCodeRefresh()\"><img ng-src=\"{{imgUrl}}\"></div>\n" +
    "\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-12\"><div class=\"verify_tip\" ng-show=\"error_img_login\">{{errorText}}</div></div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <input type=\"text\" class=\"form-control\" placeholder=\"手机验证码\" ng-model=\"phoneCode_login\"/>\n" +
    "                    <div class=\"verify_tip\" ng-show=\"error_phoneCode_login\">{{errorText}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-6\">\n" +
    "                    <input type=\"button\" value=\"短信获取\" class=\"determine\" ng-click=\"getPhoneCodeLogin(1)\" ng-show=\"!show_down1_login\" ng-disabled=\"show_down2_login\"/>\n" +
    "                    <input type=\"button\" ng-value=\"time_text_login\" class=\"countdown\" ng-show=\"show_down1_login\"/>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-6\">\n" +
    "                    <input type=\"button\" value=\"语音获取\" class=\"cancel\" ng-click=\"getPhoneCodeLogin(2)\" ng-show=\"!show_down2_login\" ng-disabled=\"show_down1_login\"/>\n" +
    "                    <input type=\"button\" ng-value=\"time_text_login\" class=\"countdown\" ng-show=\"show_down2_login\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary btn-lg btn-block\" ng-click=\"login()\" ng-disabled=\"loding_login\">绑定账号</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>");
}]);
