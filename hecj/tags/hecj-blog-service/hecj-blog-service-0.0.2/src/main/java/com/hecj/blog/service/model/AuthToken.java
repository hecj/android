package com.hecj.blog.service.model;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jfinal.plugin.activerecord.Model;
/**
 * Token认证表
 */
public class AuthToken  extends Model<AuthToken> {

	private static final long serialVersionUID = 1L;
	public static final AuthToken dao = new AuthToken();
	private static final Log log = LogFactory.getLog(AuthToken.class);

	public AuthToken findByToken(String token) {
		log.info("token {} : " + token);
		String querySQL = "select * from email_auth_token at where at.token = ?";
		try {
			List<AuthToken> list = dao.find(querySQL, new Object[] { token });
			if (list != null && list.size() > 0) {
				return list.get(0);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
