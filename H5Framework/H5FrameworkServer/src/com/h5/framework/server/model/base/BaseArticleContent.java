package com.h5.framework.server.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings("serial")
public abstract class BaseArticleContent<M extends BaseArticleContent<M>> extends Model<M> implements IBean {

	public void setId(java.lang.Long id) {
		set("id", id);
	}

	public java.lang.Long getId() {
		return get("id");
	}

	public void setArticleId(java.lang.Long articleId) {
		set("article_id", articleId);
	}

	public java.lang.Long getArticleId() {
		return get("article_id");
	}

	public void setContent(java.lang.String content) {
		set("content", content);
	}

	public java.lang.String getContent() {
		return get("content");
	}

	public void setContentType(java.lang.Integer contentType) {
		set("content_type", contentType);
	}

	public java.lang.Integer getContentType() {
		return get("content_type");
	}

	public void setSort(java.lang.Integer sort) {
		set("sort", sort);
	}

	public java.lang.Integer getSort() {
		return get("sort");
	}

	public void setCreateAt(java.lang.Long createAt) {
		set("create_at", createAt);
	}

	public java.lang.Long getCreateAt() {
		return get("create_at");
	}

	public void setUpdateAt(java.lang.Long updateAt) {
		set("update_at", updateAt);
	}

	public java.lang.Long getUpdateAt() {
		return get("update_at");
	}

}