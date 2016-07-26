package org.somken.lucene;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.NumericField;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryParser.ParseException;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.WildcardQuery;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.LockObtainFailedException;
import org.apache.lucene.util.Version;
import org.somken.model.Student;
import org.somken.util.Result;
import org.somken.util.ResultSupport;

public class IndexUtil {
	
	private Directory directory = null;
	//单例
	private static IndexReader reader = null; 
	
	public IndexUtil(){
		try {
			directory = FSDirectory.open(new File("E:/java/index"));
			reader = IndexReader.open(directory,false);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public IndexUtil(List<Student> list){
		try{
			directory = FSDirectory.open(new File("E:/java/index"));
			
			/*List<Student> list= new ArrayList<Student>();
			
			Student stu = new Student();
			
			stu.setAddress("a");
			stu.setName("ab");
			stu.setAge(13l);
			stu.setEmail("fdf@dfd");
			stu.setId(1);
			list.add(stu);
			
			stu.setAddress("a");
			stu.setName("abc");
			stu.setAge(13l);
			stu.setEmail("fdf@dfd");
			stu.setId(2);
			list.add(stu);
			
			stu.setAddress("a");
			stu.setName("abcd");
			stu.setAge(13l);
			stu.setEmail("fdf@dfd");
			stu.setId(3);
			list.add(stu);
			
			stu.setAddress("a");
			stu.setName("abcde");
			stu.setAge(13l);
			stu.setEmail("fdf@dfd");
			stu.setId(4);
			list.add(stu);
			
			stu.setAddress("a");
			stu.setName("abcdef");
			stu.setAge(13l);
			stu.setEmail("fdf@dfd");
			stu.setId(5);
			list.add(stu);
			
			stu.setAddress("a");
			stu.setName("abcdefg");
			stu.setAge(13l);
			stu.setEmail("fdf@dfd");
			stu.setId(6);
			list.add(stu);
			
			stu.setAddress("a");
			stu.setName("abcdefgh");
			stu.setAge(13l);
			stu.setEmail("fdf@dfd");
			stu.setId(7);
			list.add(stu);
			
			stu.setAddress("a");
			stu.setName("abcdefghj");
			stu.setAge(13l);
			stu.setEmail("fdf@dfd");
			stu.setId(8);
			list.add(stu);
			*/
			index(list);
			
			reader = IndexReader.open(directory,false);
			
		}catch(Exception ex){
			ex.printStackTrace();
		}
	}
	
	/**
	 * Search的设计
	 * 在实际项目设计上reader的作用于是application
	 * 在改变索引的时间要使用IndexReader.openIfChange(reader) 去得到新的 reader对象
	 * 否则在查询的时间索引并没有改变
	 * @return
	 */
	public IndexSearcher getSearcher(){
		
		try {
			if(reader == null ){
				reader = IndexReader.open(directory);
			}else{
				IndexReader tr = IndexReader.openIfChanged(reader);
				if(tr != null){
					//把旧的reader关闭
					reader.close();
					reader = tr;
				}		
			}
			return new IndexSearcher(reader);
		} catch (CorruptIndexException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
		
	}
	
	//创建索引
	public void index(List<Student> studentList){
		
		IndexWriter writer = null;
		try{
			writer = new IndexWriter(directory, new IndexWriterConfig(Version.LUCENE_35, new StandardAnalyzer(Version.LUCENE_35)));
			Document doc = null;
			for(int i =0 ;i<studentList.size();i++){
				Student stu = studentList.get(i);
				doc = new Document();
				doc.add(new Field("email", stu.getEmail(),Field.Store.YES,Field.Index.NOT_ANALYZED));
				doc.add(new Field("address", stu.getAddress(),Field.Store.NO,Field.Index.ANALYZED));
				doc.add(new Field("name", stu.getName(),Field.Store.YES,Field.Index.ANALYZED_NO_NORMS));
			    //数字索引
				doc.add(new NumericField("id",Field.Store.YES,true).setIntValue(stu.getId()));
				doc.add(new NumericField("age",Field.Store.YES,true).setLongValue(stu.getAge()));
				
				writer.addDocument(doc);
			}
//			for(int i=0;i<ids.length;i++){
//				doc = new Document();
//				doc.add(new Field("id", ids[i],Field.Store.YES,Field.Index.NOT_ANALYZED_NO_NORMS));
//				doc.add(new Field("email", email[i],Field.Store.YES,Field.Index.NOT_ANALYZED));
//				doc.add(new Field("content", content[i],Field.Store.NO,Field.Index.ANALYZED));
//				doc.add(new Field("name", name[i],Field.Store.YES,Field.Index.ANALYZED_NO_NORMS));
//				//数字索引
//				doc.add(new NumericField("age",Field.Store.YES,true).setIntValue(ages[i]));
//				//日期
//				doc.add(new NumericField("date", Field.Store.YES,true).setLongValue(dates[i].getTime()));
//				
//				
//				//加权
//				String et = email[i].substring(email[i].lastIndexOf("@")+1);
//				System.out.println(et);
//				if(scores.containsKey(et)){
//					doc.setBoost(scores.get(et));
//				}else{
//					doc.setBoost(0.5f);
//				}
//				
//				writer.addDocument(doc);
//			}
		}catch(IOException ex){
			ex.printStackTrace();
		}finally{
			try {
				if(writer != null){
					writer.close();
				}
			} catch (CorruptIndexException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}	
	}
	
	//删除索引
	public void delete(){
		IndexWriter writer = null;
			try {
				writer = new IndexWriter(directory, new IndexWriterConfig(Version.LUCENE_35, new StandardAnalyzer(Version.LUCENE_35)));
				//参数是一个选项，可以是一个Query,也可以是一个term,term是一个精确查找的结果
				writer.deleteDocuments(new Term("id","2"));
				writer.commit();
			} catch (CorruptIndexException e) {
				e.printStackTrace();
			} catch (LockObtainFailedException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}finally{
			}
	}
	//通过reader删除索引
	public void delete02(){
		try {
			reader.deleteDocuments(new Term("id","3"));
			reader.close();
		} catch (CorruptIndexException e) {
			e.printStackTrace();
		} catch (LockObtainFailedException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
		}
	}
	
	
	//恢复索引
	public void undelete(){
		
		try {
			//恢复时必须把readOnly设置为false
			IndexReader indexReader = IndexReader.open(directory,false);
			indexReader.undeleteAll();
			
			indexReader.close();
		} catch (CorruptIndexException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}



	//查询
	public void query(){
		
		try {
			IndexReader indexReader = IndexReader.open(directory);
			System.out.println("numDocs:"+indexReader.numDocs());
			System.out.println("maxDocs:"+indexReader.maxDoc());
			System.out.println("deleteDocs:"+indexReader.numDeletedDocs());
			
			
			indexReader.close();
		} catch (CorruptIndexException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	public void merge(){
		
		IndexWriter indexWriter = null;
		try {
			indexWriter = new IndexWriter(directory, new IndexWriterConfig(Version.LUCENE_35, new StandardAnalyzer(Version.LUCENE_35)));
			//参数是一个选项，可以是一个Query,也可以是一个term,term是一个精确查找的结果
			indexWriter.forceMerge(2);
			
		} catch (CorruptIndexException e) {
			e.printStackTrace();
		} catch (LockObtainFailedException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try {
				indexWriter.close();
			} catch (CorruptIndexException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		
	}
	
	
	public void foreDelete(){
		IndexWriter indexWriter = null;
		try {
			indexWriter = new IndexWriter(directory, new IndexWriterConfig(Version.LUCENE_35, new StandardAnalyzer(Version.LUCENE_35)));
			//参数是一个选项，可以是一个Query,也可以是一个term,term是一个精确查找的结果
			//强制删除
			indexWriter.forceMergeDeletes();
		
		} catch (CorruptIndexException e) {
			e.printStackTrace();
		} catch (LockObtainFailedException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try {
				indexWriter.close();
			} catch (CorruptIndexException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	
		//更新索引
		public void update(){
			IndexWriter indexWriter = null;
				try {
					indexWriter = new IndexWriter(directory, new IndexWriterConfig(Version.LUCENE_35, new StandardAnalyzer(Version.LUCENE_35)));
					//参数是一个选项，可以是一个Query,也可以是一个term,term是一个精确查找的结果
					
					Document doc = new Document();
//					doc.add(new Field("id", "11",Field.Store.YES,Field.Index.NOT_ANALYZED_NO_NORMS));
//					doc.add(new Field("email", email[0],Field.Store.YES,Field.Index.NOT_ANALYZED));
//					doc.add(new Field("content", content[0],Field.Store.NO,Field.Index.ANALYZED));
//					doc.add(new Field("name", name[0],Field.Store.YES,Field.Index.ANALYZED_NO_NORMS));
					 
					indexWriter.updateDocument(new Term("id","1"), doc);
				
				} catch (CorruptIndexException e) {
					e.printStackTrace();
				} catch (LockObtainFailedException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}finally{
					try {
						indexWriter.close();
					} catch (CorruptIndexException e) {
						e.printStackTrace();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
		}
		/**
		 * @函数功能说明 分页查询
		 * @修改作者名字 He Chaojie  
		 * @修改时间 2013-8-4
		 * @修改内容
		 * @参数： @param q
		 * @参数： @param pageIndex
		 * @参数： @param pageSize    
		 * @return void   
		 * @throws
		 */
		public Result searchByQueryParse(Query q,int pageIndex,int pageSize) {
			
			Result result = new ResultSupport(false);
			try {
				IndexSearcher searcher = getSearcher();

				TopDocs tds = searcher.search(q,10000000);
				ScoreDoc[] sds = tds.scoreDocs;
				
				int total = sds.length;

				int end = pageIndex+pageSize;
				//防止查询的索引越界
				end = total<end ? total:end;
				
				List<Student> studentList = new ArrayList<Student>();
				for(int i=pageIndex;i<end;i++) {
					Document doc = searcher.doc(sds[i].doc);
					Student stu =new Student();
					stu.setId(Integer.valueOf(doc.get("id")));
					stu.setName(doc.get("name"));
					stu.setAddress(doc.get("address"));
					stu.setEmail(doc.get("email"));
					stu.setAge(Long.valueOf((doc.get("age"))));
					studentList.add(stu);
				}
				searcher.close();
				
				result.setDefaultModel("total", Long.valueOf(String.valueOf(total)));
				result.setDefaultModel("studentList", studentList);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			result.setSuccess(true);
			return result;
		}
		
		public static void main(String[] args) throws ParseException {
			//1、创建QueryParser对象,默认搜索域为content
			//QueryParser parser = new QueryParser(Version.LUCENE_35, "name", new StandardAnalyzer(Version.LUCENE_35));
			//搜索content中包含有like的
			
			String name = "f";
			Query query = new WildcardQuery(new Term("name", "*"+name+"*"));
			Result r = new IndexUtil().searchByQueryParse(query,0,9);
			
			List<Student> studentList=(List<Student>) r.getModels().get("studentList");
			Long total = (Long) r.getModels().get("total");
			
			for(Student s:studentList){
				System.out.println(s.getName()+s.getId());
			}
			
			System.out.println("total =="+total);
		}
}