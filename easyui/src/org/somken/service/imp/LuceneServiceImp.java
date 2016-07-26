package org.somken.service.imp;

import java.util.Map;

import org.apache.lucene.index.Term;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.WildcardQuery;
import org.somken.lucene.IndexUtil;
import org.somken.service.LuceneService;
import org.somken.util.Result;

public class LuceneServiceImp implements LuceneService {
	
	private IndexUtil indexUtil;
	
	public IndexUtil getIndexUtil() {
		return indexUtil;
	}

	public void setIndexUtil(IndexUtil indexUtil) {
		this.indexUtil = indexUtil;
	}

	@Override
	public Result searchStudent(Map<String, Object> params) {

		String name = (String)params.get("name");
		name = name == null ?"":name;
		Integer offset = (Integer)params.get("offset");
		Integer length = (Integer)params.get("length");
		
		Query query = new WildcardQuery(new Term("name", "*"+name+"*"));
		
		Result result = indexUtil.searchByQueryParse(query, offset, length);
		
		return result;
	}

}
