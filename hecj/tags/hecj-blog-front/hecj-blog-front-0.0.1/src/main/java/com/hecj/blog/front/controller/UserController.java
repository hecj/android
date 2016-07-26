package com.hecj.blog.front.controller;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.front.interceptor.LoginInterceptor;
import com.hecj.blog.front.util.UserUtil;
import com.hecj.blog.service.email.EmailVars;
import com.hecj.blog.service.email.MailSendService;
import com.hecj.blog.service.model.Article;
import com.hecj.blog.service.model.AuthToken;
import com.hecj.blog.service.model.NoticeTemplate;
import com.hecj.blog.service.model.SendEmailRecord;
import com.hecj.blog.service.model.User;
import com.hecj.blog.service.model.UserPasswordRecord;
import com.hecj.blog.service.util.NoticeTemplateConst;
import com.hecj.common.mail.service.MailService;
import com.hecj.common.mail.service.MailServiceFactory;
import com.hecj.common.utils.ResultJson;
import com.hecj.common.utils.StringUtil;
import com.hecj.common.utils.encryp.MD5;
import com.jfinal.aop.Before;
import com.jfinal.aop.ClearInterceptor;
import com.jfinal.aop.ClearLayer;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.IAtom;
import com.jfinal.plugin.activerecord.Page;

@Before(LoginInterceptor.class)
public class UserController extends Controller{

	private static final Log log = LogFactory.getLog(UserController.class);
	
	/**
	 * 个人中心页面
	 */
	public void index(){
		User user = UserUtil.getUser(getSession());
		try{
			Map<String,Object> params = new HashMap<String,Object>();
			params.put("pageNumber", 1);
			params.put("pageSize", 10);
			params.put("user_id", user.getLong("id"));
			Page<Article> articlePage = Article.dao.queryArticleByPage(params);
			setAttr("articlePage", articlePage);
			
			renderFreeMarker("/page/user/index.html");
		} catch (Exception e) {
			renderError(400);
		}
	}
	
	/**
	 * 注册用户
	 */
	@Before(POST.class)
	@ClearInterceptor(ClearLayer.ALL)
	public void registerUser(){
		
		final String email = getPara("email");
		final String password = getPara("password");
		String repassword = getPara("repassword");
		if(StringUtil.isStrEmpty(email)){
			renderJson(new ResultJson(-1l, "用户名不合法"));
			return;
		}
		
		if(!password.equals(repassword)){
			renderJson(new ResultJson(-2l, "两次密码不一致"));
			return;
		}
		
		User ouser = User.dao.findByEmail(email);
		if(ouser != null){
			//renderJson(new ResultJson(-3l, "用户已被注册"));
			//return;
		}
		
		log.info("注册邮箱email{}:"+email);
		try {
			final User user = new User();
			user.put("email", email);
			user.put("nickname", email);
			user.put("password", MD5.md5crypt(password));
			user.put("create_at", System.currentTimeMillis());
			user.put("update_at", System.currentTimeMillis());
			
			Db.tx(new IAtom() {
				@Override
				public boolean run() throws SQLException {
				//	user.save();
					
					new UserPasswordRecord().put("user_id", user.getLong("id"))
						.put("password_des", password)
						.put("password_md5", MD5.md5crypt(password))
						.put("create_at", System.currentTimeMillis())
						.save();
					
					return true;
				}
			});
			
			UserUtil.setUser(user, getSession());
			
			try {
				
				new Thread(){
					@Override
					public void run() {
						
						MailSendService mailSendService = new MailSendService();
						EmailVars emailVars = new EmailVars().setEmail(email).putVar("%email%", email);
						mailSendService.sendEmail("注册用户成功", "email_user_reg_success", emailVars);
						
						/*
						NoticeTemplate noticeTemplate = NoticeTemplate.dao.findByTempName(NoticeTemplateConst.mail_user_reg_success);
						String title = noticeTemplate.getStr("title");
						String content = noticeTemplate.getStr("content");
						content = content.replace("%EMAIL%", email);
						MailService mailService = MailServiceFactory.getInstance();
						
						boolean sendStatus = mailService.sendHtml(email, title, content);
						if(sendStatus){
							SendEmailRecord sendEmailRecord = new SendEmailRecord();
							sendEmailRecord.put("title", title);
							sendEmailRecord.put("content", content);
							sendEmailRecord.put("sender", -1);
							sendEmailRecord.put("sender_email", -1);
							sendEmailRecord.put("reciver", user.getLong("id"));
							sendEmailRecord.put("reciver_email", email);
							sendEmailRecord.put("type", 1);
							sendEmailRecord.put("id_delete", 0);
							sendEmailRecord.put("create_at", System.currentTimeMillis());
							sendEmailRecord.save();
							log.info("邮件发送成功，保存邮件信息sendEmailRecordId:"+sendEmailRecord.getLong("id"));
						}*/
					}
				}.start();
				
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			renderJson(new ResultJson(200l, "success"));
			
		} catch (Exception e) {
			e.printStackTrace();
			renderJson(new ResultJson(-100000l, e.getMessage()));
		}
	}
	
	/**
	 * 登录
	 */
	@Before(POST.class)
	@ClearInterceptor(ClearLayer.ALL)
	public void login(){
		
		String email = getPara("email");
		String password = getPara("password");
		if(StringUtil.isStrEmpty(email)){
			renderJson(new ResultJson(-1l, "用户名不合法"));
			return;
		}
		User ouser = User.dao.findByEmail(email);
		if(ouser == null){
			renderJson(new ResultJson(-2l, "用户不存在"));
			return;
		}
		if(!ouser.getStr("password").equals(MD5.md5crypt(password))){
			renderJson(new ResultJson(-3l, "密码不正确"));
			return;
		}
		UserUtil.setUser(ouser, getSession());
		renderJson(new ResultJson(200l, "success"));
	}
	
	/**
	 * 注销
	 */
	public void logout(){
		UserUtil.removeUser(getSession());
		redirect("/");
	}
	
	/**
	 * 发邮件注册
	 */
	@Before(POST.class)
	@ClearInterceptor(ClearLayer.ALL)
	public void sendMailReg(){
		final String email = getPara("email");
		log.info("正在注册用户，发送邮件设置密码email:"+email);
		try {
			
			User user = User.dao.findByEmail(email);
			if(user != null){
				renderJson(new ResultJson(-1l, "邮箱已被注册"));
				return;
			}
			
			final String token = UUID.randomUUID().toString();
			
			//生成注册token
			AuthToken authToken = new AuthToken();
			authToken.put("email", email);
			authToken.put("token", token);
			authToken.put("type", 2);
			authToken.put("is_verify", 0);
			// 24小时有效
			authToken.put("valid_at", System.currentTimeMillis()+24*60*60*1000);
			authToken.put("create_at", System.currentTimeMillis());
			authToken.save();
			
			new Thread(){
				@Override
				public void run() {
					
					MailSendService mailSendService = new MailSendService();
					EmailVars emailVars = new EmailVars().setEmail(email)
							.putVar("%email%", email)
							.putVar("%token%", token);
					mailSendService.sendEmail("注册激活邮件", "mail_user_reg_auth_token", emailVars);
					
					/*					// 邮件模板
					NoticeTemplate noticeTemplate = NoticeTemplate.dao.findByTempName(NoticeTemplateConst.mail_user_reg_auth_token);
					String title = noticeTemplate.getStr("title");
					String content = noticeTemplate.getStr("content");
					content = content.replace("%email%", email);
					content = content.replace("%token%", token);
					MailService mailService = MailServiceFactory.getInstance();
					
					boolean sendStatus = mailService.sendHtml(email, title, content);
					if(sendStatus){
						
						// 邮件记录
						SendEmailRecord sendEmailRecord = new SendEmailRecord();
						sendEmailRecord.put("title", title);
						sendEmailRecord.put("content", content);
						sendEmailRecord.put("sender", -1);
						sendEmailRecord.put("sender_email", -1);
						sendEmailRecord.put("reciver", -1);
						sendEmailRecord.put("reciver_email", email);
						sendEmailRecord.put("type", 1);
						sendEmailRecord.put("id_delete", 0);
						sendEmailRecord.put("create_at", System.currentTimeMillis());
						sendEmailRecord.save();
						log.info("邮件发送成功，保存邮件信息sendEmailRecordId:"+sendEmailRecord.getLong("id"));
					}
					*/
				}
			}.start();
			renderJson(new ResultJson(200l, "success"));
		} catch (Exception e) {
			e.printStackTrace();
			renderJson(new ResultJson(-100000l, e.getMessage()));
		}
	}
	
	/**
	 * 设置密码
	 */
	@Before(POST.class)
	@ClearInterceptor(ClearLayer.ALL)
	public void setpwd(){
		
		final String passwd = getPara("passwd");
		String repasswd = getPara("repasswd");
		String token = getPara("token");
		
		try {
			
			AuthToken authToken = AuthToken.dao.findByToken(token);
			
			if(authToken.getInt("is_verify") == 1){
				// token 无效
				renderJson(new ResultJson(-1l, "token失效"));
				return;
			}
			
			Long create_at = authToken.getLong("create_at");
			Long valid_at = authToken.getLong("valid_at");
			
			if (create_at.longValue() + 24 * 60 * 60 * 1000 > valid_at.longValue()) {
				// token 无效
				renderJson(new ResultJson(-1l, "token失效"));
				return;
			}
			
			if(StringUtil.isObjectEmpty(passwd)){
				renderJson(new ResultJson(-2l, "密码不能为空"));
				return;
			}
			
			if(!passwd.equals(repasswd)){
				renderJson(new ResultJson(-3l, "密码不一致"));
				return;
			}
			
			String email = authToken.get("email");
			final User user = new User();
			user.put("email", email);
			user.put("username", email);
			user.put("nickname", email);
			user.put("password", MD5.md5crypt(passwd));
			user.put("create_at", System.currentTimeMillis());
			user.put("update_at", System.currentTimeMillis());
			
			Db.tx(new IAtom() {
				@Override
				public boolean run() throws SQLException {
					user.save();
					
					UserPasswordRecord upr = new UserPasswordRecord();
					upr.put("user_id", user.getLong("id"));
					upr.put("password_des", passwd);
					upr.put("password_md5", user.get("password"));
					upr.put("create_at", System.currentTimeMillis());
					upr.save();
					
					return true;
				}
			});
			
			renderJson(new ResultJson(200l, "success"));
			
		} catch (Exception e) {
			e.printStackTrace();
			renderJson(new ResultJson(-100000l, e.getMessage()));
		}
	}
	
}
