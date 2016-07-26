package com.h5.framework.server.intercept;

import java.io.IOException;
import java.net.URLEncoder;
import java.sql.Timestamp;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.h5.framework.server.model.WxUser;
import com.h5.framework.server.util.ObjectUtils;
import com.h5.framework.server.util.StringUtil;
import com.h5.framework.server.util.UserUtil;
import com.jfinal.aop.Invocation;
import com.jfinal.kit.PropKit;
import com.jfinal.weixin.sdk.api.ApiConfig;
import com.jfinal.weixin.sdk.api.ApiConfigKit;
import com.jfinal.weixin.sdk.api.ApiResult;
import com.jfinal.weixin.sdk.api.SnsAccessToken;
import com.jfinal.weixin.sdk.api.SnsAccessTokenApi;
import com.jfinal.weixin.sdk.api.UserApi;
import com.jfinal.weixin.sdk.jfinal.MsgInterceptor;
/**
 * 微信拦截器
 * 测试号管理微信号： gh_8ce564f7cc21  退出
	------------------
	测试号信息
	appID
	wxadccdb564fa04a71
	appsecret
	6583b0af1ca3658da9faccaed3d9fdd2
	--------------------
	接口配置信息修改
	请填写接口配置信息，此信息需要你有自己的服务器资源，填写的URL需要正确响应微信发送的Token验证，请阅读消息接口使用指南。
	URL
	http://hechaojie.com/weixin
	Token
	hechaojie
	-------------------
	JS接口安全域名修改
	设置JS接口安全域后，通过关注该测试号，开发者即可在该域名下调用微信开放的JS接口，请阅读微信JSSDK开发文档。
	域名
	http://hechaojie.com/
 */
public class WenXinInterceptor extends MsgInterceptor{
	
	public static Log log = LogFactory.getLog(WenXinInterceptor.class);
	
	/**
	 * 微信授权时带的code，可以用来验证信息合法
	 */
	private static final String WEIXIN_STATE = ObjectUtils.getUUID();
	
	public void intercept(Invocation ai) {
		HttpServletRequest req = ai.getController().getRequest();
		HttpServletResponse resp = ai.getController().getResponse();
		try {
			// 第一步首先判断是否微信浏览器，不是微信浏览器则放行
			if(!UserUtil.isWeiXin(req)){
				ai.invoke();
				return;
			}
			System.out.println("---------是微信浏览器，开始拦截...");
			// 第二步1.存在openid 则放行
			String _openId = UserUtil.getOpenId(req);
			System.out.println("_openId{}:"+_openId);
			if(!StringUtil.isStrEmpty(_openId)){
				System.out.println("【openid存在，跳出拦截器】");
				ai.invoke();
				return;
			}
			
			// 第三步 没有openId则需要获取code,然后根据code获取用户tonken,最后获取用户信息
			
			String code = req.getParameter("code");
			String state = req.getParameter("state");
			System.out.println("code{},state{}:"+code+","+state);
			if(!StringUtil.isStrEmpty(code) && WEIXIN_STATE.equals(state)){
				// ##########授权步骤2#########
				// 获取授权信息
				SnsAccessToken token = SnsAccessTokenApi.getSnsAccessToken(PropKit.get("weixin_appId"), PropKit.get("weixin_appSecret"), code);
				System.out.println("获取授权openid{}:"+token.getOpenid());
				ApiConfigKit.setThreadLocalApiConfig(getApiConfig());
				ApiResult result = UserApi.getUserInfo(token.getOpenid());
				System.out.println("获取用户授权信息result{}:"+result);
				// 关联用户
				/*openid	用户的唯一标识
				nickname	用户昵称
				sex	用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
				province	用户个人资料填写的省份
				city	普通用户个人资料填写的城市
				country	国家，如中国为CN
				headimgurl	用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
				privilege	用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
				unionid	
				*/
				WxUser wxUser = new WxUser();
				wxUser.set("openid", result.get("openid"));
				wxUser.set("nickname", result.get("nickname"));
				wxUser.set("sex", result.get("sex"));
				wxUser.set("province", result.get("province"));
				wxUser.set("city", result.get("city"));
				wxUser.set("country", result.get("country"));
				wxUser.set("headimgurl", result.get("headimgurl"));
				wxUser.set("privilege", result.get("privilege"));
				wxUser.set("unionid", result.get("unionid"));
				wxUser.set("updatetime", new Timestamp(System.currentTimeMillis()));
				if(WxUser.dao.findById(token.getOpenid()) == null){
					// 未保存过则添加
					wxUser.set("createtime", new Timestamp(System.currentTimeMillis()));
					wxUser.save();
				} else{
					// 已保存过则修改
					wxUser.update();
				}
				UserUtil.setOpenId(req, token.getOpenid());
				// 也可以将openid放入cookie
			} else{
				// ##########授权步骤1#########
				System.out.println("---------开始获取code...");
				// 获取code
				String queryString = req.getQueryString();
				String uri = req.getRequestURI();
				String back_url = uri;
				if(queryString != null){
					back_url = uri+"?"+queryString;
				}
				System.out.println("--domain:"+UserUtil.getDomain(req));
				back_url = URLEncoder.encode(UserUtil.getDomain(req)+back_url, "UTF-8");
				String authurl = SnsAccessTokenApi.getAuthorizeURL(PropKit.get("weixin_appId"), back_url, WEIXIN_STATE, false);
				System.out.println("authurl:\n"+authurl);
				ai.getController().redirect(authurl);
				return;
			}
			ai.invoke();
		} catch (Exception ex) {
			ex.printStackTrace();
			return;
		}
	}
	
	public ApiConfig getApiConfig() {
		ApiConfig ac = new ApiConfig();
		
		// 配置微信 API 相关常量
		ac.setToken(PropKit.get("weixin_token"));
		ac.setAppId(PropKit.get("weixin_appId"));
		ac.setAppSecret(PropKit.get("weixin_appSecret"));
		
		/**
		 *  是否对消息进行加密，对应于微信平台的消息加解密方式：
		 *  1：true进行加密且必须配置 encodingAesKey
		 *  2：false采用明文模式，同时也支持混合模式
		 */
		ac.setEncryptMessage(PropKit.getBoolean("encryptMessage", false));
		ac.setEncodingAesKey(PropKit.get("encodingAesKey", "setting it in config file"));
		return ac;
	}
	
}
