package com.h5.framework.server.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings("serial")
public abstract class BaseAboutUs<M extends BaseAboutUs<M>> extends Model<M> implements IBean {

	public void setId(java.lang.Long id) {
		set("id", id);
	}

	public java.lang.Long getId() {
		return get("id");
	}

	public void setType(java.lang.Integer type) {
		set("type", type);
	}

	public java.lang.Integer getType() {
		return get("type");
	}

	public void setDesc(java.lang.String desc) {
		set("desc", desc);
	}

	public java.lang.String getDesc() {
		return get("desc");
	}

	public void setIsDelete(java.lang.Integer isDelete) {
		set("is_delete", isDelete);
	}

	public java.lang.Integer getIsDelete() {
		return get("is_delete");
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
