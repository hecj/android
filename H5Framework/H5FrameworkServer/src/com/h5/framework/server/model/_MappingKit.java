package com.h5.framework.server.model;

import com.jfinal.plugin.activerecord.ActiveRecordPlugin;

/**
 * Generated by JFinal, do not modify this file.
 * <pre>
 * Example:
 * public void configPlugin(Plugins me) {
 *     ActiveRecordPlugin arp = new ActiveRecordPlugin(...);
 *     _MappingKit.mapping(arp);
 *     me.add(arp);
 * }
 * </pre>
 */
public class _MappingKit {

	public static void mapping(ActiveRecordPlugin arp) {
		arp.addMapping("about_us", "id", AboutUs.class);
		arp.addMapping("article", "id", Article.class);
		arp.addMapping("article_comment", "id", ArticleComment.class);
		arp.addMapping("article_comment_reply", "id", ArticleCommentReply.class);
		arp.addMapping("article_content", "id", ArticleContent.class);
		arp.addMapping("article_type", "id", ArticleType.class);
		arp.addMapping("notice_template", "id", NoticeTemplate.class);
		arp.addMapping("user", "id", User.class);
		arp.addMapping("user_password_record", "id", UserPasswordRecord.class);
		arp.addMapping("wx_user", "openid", WxUser.class);
		arp.addMapping("wx_user_relation", "id", WxUserRelaton.class);
	}
}

