package com.h5.framework.server.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import org.apache.log4j.Logger;

import com.h5.framework.server.util.FileUtil;
import com.h5.framework.server.util.JPGTransformer;
import com.h5.framework.server.util.ResultJson;
import com.jfinal.aop.Before;
import com.jfinal.aop.Clear;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.kit.PropKit;
import com.jfinal.upload.UploadFile;

/**
 * 上传
 */
public class UploadController extends BaseController {
	
	private static final Logger log = Logger.getLogger(UploadController.class);
	
	/**
     * 上传图片
     */
	@Clear
    @Before(POST.class)
    public void uploadImage() throws IOException{
    	
    	String fileName = getPara("fileName");
    	log.info("fileName{}:"+fileName);
    	File file = null;
    	BufferedInputStream bis = null;
    	BufferedOutputStream out = null;
    	try {
    		// 静态文件临时目录
    		String head_img_dir = PropKit.get("head_img_dir");
    		UploadFile uploadFile = getFile("file");
    		file = uploadFile.getFile();
    		
    		String file_name = file.getName();
    		log.info("filename:"+file_name);
    		String ext = FileUtil.getExt(file.getName());
    		if(ext==null || "".equals(ext)){
    			log.error("上传文件类型不正确{}:"+file_name+","+ext);
    			renderJson(new ResultJson(-1L,"上传文件类型不正确"));
    			return;
    		}
    		//验证上传文件类型
//    		String upload_images_file_types = PropKit.get("head_img_type");
//    		if(!upload_images_file_types.contains(ext.toLowerCase())){
//    			log.info("上传文件类型不正确{}:"+file_name);
//    			renderJson(new ResultJson(-1L,"上传文件类型不正确"));
//    			boolean b = file.delete();
//    			log.info("删除文件："+b);
//    			return;
//    		}
//    		
    		String new_file_name = fileName+".jpg";
    		
    		InputStream ins = new FileInputStream(file);
    		int fileSize = ins.available();
    		ins.close();
    		
    		log.info("图片大小 fileSize："+fileSize);

    		if(fileSize > 1024*1024){
    			log.info("图片大于1M，压缩处理 fileSize："+fileSize);
    			// 压缩处理
    			// 计算缩放比例
    			double scale = 1d/(fileSize/(500*1024));
    			JPGTransformer jpg = new JPGTransformer(scale);
   		     	jpg.transform(file, new File(head_img_dir+"/"+new_file_name));
    		} else{
    			// 原样保存
    			FileUtil.copyFile(file,new File(head_img_dir+"/"+new_file_name));
    		}
    	
    		log.info("上传图片:"+new_file_name);
    		ResultJson result = new ResultJson();
        	result.setCode(200l);
        	Map<String,Object> data = new HashMap<String,Object>();
        	data.put("image_name", new_file_name);
        	result.setData(data);
        	result.setMessage("success");
        	
        	renderJson(result);
    	} catch (Exception e) {
			log.error("上传文件失败:"+e.getMessage());
			e.printStackTrace();
			renderJson(new ResultJson(-100000L,"上传图片失败"));
		} finally{
			if(file != null && file.exists()){
				file.delete();
			}
			if(bis != null){
				bis.close();
			}
			if(out != null){
				out.flush();
	    		out.close();
			}
		}
    }
	
	
}





