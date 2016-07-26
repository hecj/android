package com.h5.framework.server.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.sql.Timestamp;

import org.apache.log4j.Logger;

import com.h5.framework.server.model.WxUser;
import com.h5.framework.server.util.UserUtil;
import com.jfinal.aop.Before;
import com.jfinal.aop.Clear;
import com.jfinal.kit.PropKit;
import com.jfinal.weixin.sdk.api.AccessTokenApi;
import com.jfinal.weixin.sdk.api.ApiConfig;
import com.jfinal.weixin.sdk.api.ApiResult;
import com.jfinal.weixin.sdk.api.UserApi;
import com.jfinal.weixin.sdk.jfinal.MsgControllerAdapter;
import com.jfinal.weixin.sdk.jfinal.MsgInterceptor;
import com.jfinal.weixin.sdk.msg.in.InTextMsg;
import com.jfinal.weixin.sdk.msg.in.event.InFollowEvent;
import com.jfinal.weixin.sdk.msg.in.event.InMenuEvent;

/**
 * 微信
 */
@Clear // 清除全局拦截器
@Before(MsgInterceptor.class) // 必须添加拦截器
public class WeiXinController extends MsgControllerAdapter {
	
	private static final Logger log = Logger.getLogger(WeiXinController.class);

	/**
	 * 这里接收微信请求
	 */
	public void index(){
		System.out.println("微信服务器交互...");
		super.index();
		String openid = getPara("openid");
		System.out.println("当前用户openid:"+openid);
		System.out.println(getRequest().getRemoteHost());
		getRequest().getSession().setAttribute("openId", openid);
		renderNull();
	}

	@Override
	protected void processInFollowEvent(InFollowEvent inFollowEvent) {
		System.out.println("processInFollowEvent:"+inFollowEvent.toString());
		
		String openid = inFollowEvent.getFromUserName();//关注人的openid
		if(inFollowEvent.getEvent().equals("subscribe")){//当前是关注状态
			ApiResult result = UserApi.getUserInfo(openid);
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
			if(WxUser.dao.findById(openid) == null){
				// 未保存过则添加
				wxUser.set("createtime", new Timestamp(System.currentTimeMillis()));
				wxUser.save();
			} else{
				// 已保存过则修改
				wxUser.update();
			}
			UserUtil.setOpenId(getRequest(), openid);
			// 也可以将openid放入cookie
		} else{
			// 取消关注
			
		}
	}

	@Override
	protected void processInTextMsg(InTextMsg inTextMsg) {
		System.out.println(inTextMsg.getContent());
		System.out.println("processInTextMsg");
	}

	@Override
	protected void processInMenuEvent(InMenuEvent inMenuEvent) {
		System.out.println("AccessToken:\n"+AccessTokenApi.getAccessTokenStr());
		System.out.println("processInMenuEvent");
	}

	@Override
	/**
	 * 如果要支持多公众账号，只需要在此返回各个公众号对应的  ApiConfig 对象即可
	 * 可以通过在请求 url 中挂参数来动态从数据库中获取 ApiConfig 属性值
	 */
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
	
	public void test() throws UnsupportedEncodingException{
		String request = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={APPID}&redirect_uri={REDIRECT_URI}&response_type=code&scope={SCOPE}&state={STATE}#wechat_redirect";
		request = request.replace("{APPID}", (PropKit.get("weixin_appId"))
						.replace("{REDIRECT_URI}", URLEncoder.encode("http://hechaojie.com/weixin/test2","UTF-8"))
						.replace("{SCOPE}", "snsapi_userinfo")
						.replace("{STATE}", "hechaojie"));
		log.info(" oauth2 authorize request :" + request);
		redirect(request);
	}
	
	public void test2(){
		
	}
	
}





