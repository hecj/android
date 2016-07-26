package com.demo.service.u.model;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

import cn.peon.core.kit.StringUtil;
import com.demo.util.ArrayUtil;

 /**
 *用户
 */
@SuppressWarnings("serial")
public class U extends Model<U> {
	public static final U dao = new U();
	 /**
	 *基本分页方法
	 */
	public Page<U> _page(int pn,int ps) {
		return dao.paginate(pn, ps, "select *", "from u order by id desc");
	}
	
	/**根据id删除多个对象
	 * @param ids
	 * @return
	 */
	public int deleteByIds(String... ids) {
		String[] ay = ArrayUtil.getPrePareArray(ids.length);
		String str = StringUtil.join(ay,",");
		return Db.update("delete from u where id in ("+str+")", ids);
	}
}