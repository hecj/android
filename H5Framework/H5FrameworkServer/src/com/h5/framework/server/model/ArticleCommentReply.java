package com.h5.framework.server.model;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.h5.framework.server.model.base.BaseArticleCommentReply;
import com.jfinal.plugin.activerecord.Model;

public class ArticleCommentReply extends BaseArticleCommentReply<ArticleCommentReply> {

	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(ArticleCommentReply.class);
	public static final ArticleCommentReply dao = new ArticleCommentReply();
	
	
			
}
