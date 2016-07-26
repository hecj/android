package com.jfinal.plugin.activerecord;

import java.util.Map;

public final class TableInitKit {

	/**
	 * 手动初始化Model对就的Table字段数据
	 * 
	 * @param tableName
	 *            表名
	 * @param modelClass
	 *            model的Class
	 * @param attrTypeMap
	 *            字段类型Map
	 */
	public static void init(String tableName, Class<? extends Model<?>> modelClass,
			Map<String, Class<?>> attrTypeMap) {
		init(tableName, "id", modelClass, attrTypeMap);
	}

	/**
	 * 手动初始化Model对就的Table字段数据
	 * 
	 * @param tableName
	 *            表名
	 * @param primaryKey
	 *            主键名
	 * @param modelClass
	 *            model的Class
	 * @param attrTypeMap
	 *            字段类型Map
	 */
	public static void init(String tableName, String primaryKey,
			Class<? extends Model<?>> modelClass, Map<String, Class<?>> attrTypeMapTypeMap) {
		Table blogTable = new Table(tableName, primaryKey, modelClass);
		blogTable.setColumnTypeMap(attrTypeMapTypeMap);

		TableMapping.me().putTable(blogTable);
	}
}
