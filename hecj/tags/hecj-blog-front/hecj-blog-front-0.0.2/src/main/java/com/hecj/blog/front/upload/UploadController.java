package com.hecj.blog.front.upload;

import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.log4j.Logger;

import com.hecj.blog.front.util.JPGTransformer;
import com.hecj.blog.service.util.Constant;
import com.hecj.blog.service.util.FileUtil;
import com.hecj.blog.service.util.OrdersUtils;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.kit.PropKit;
import com.jfinal.upload.UploadFile;

public class UploadController extends Controller {

	private static final Logger log = Logger.getLogger(UploadController.class);
	// 10MB
	private static final int MAXSIZE = 50 * 1024 * 1024;

    /**
     * 项目复审提交-项目介绍-富文本上传图片
     * by HECJ
     */
    public void uploadFile() throws IOException{
    	
    	File file = null;
    	BufferedInputStream bis = null;
    	BufferedOutputStream out = null;
    	try {
    		
    		// 静态文件临时目录
    		String upload_file_temps_dir = PropKit.use("file.properties").get("upload_file_temps_dir");
    		UploadFile uploadFile = getFile("uploadFile", upload_file_temps_dir , MAXSIZE);
    		file = uploadFile.getFile();
    		
    		String file_name = file.getName();
    		String ext = FileUtil.getExt(file.getName());
    		if(ext==null || "".equals(ext)){
    			log.info("上传文件类型不正确{}:"+file_name);
    			Map<String, Object> result = new HashMap<String, Object>();
        		result.put("error", 1);
        		result.put("message", "上传文件类型不正确");
//        		setAttr("result", result);
//        		renderFreeMarker("/page/json/kindeditor-upload-json.html");
//        		renderJson(result);
        		renderHtml(JsonKit.toJson(result));
    			return;
    		}
    		
    		String new_file_name = OrdersUtils.getRandomPictureName()+"."+ext;
    		
//    		FileInputStream fis = new FileInputStream(file);
//    		bis = new BufferedInputStream(fis);
//    		byte[] bs =new byte[bis.available()];
//    		bis.read(bs);
    		
    		String newFileName = upload_file_temps_dir+"/"+new_file_name;

    		InputStream ins = new FileInputStream(file);
    		int fileSize = ins.available();
    		ins.close();
    		
    		log.info("图片大小 fileSize："+fileSize);
    		
//    		BufferedImage bufferedImage = ImageIO.read(file);   
//    		System.out.println("图片宽度："+bufferedImage.getWidth());
    		if(fileSize > 1024*1024){
    			// 压缩处理
//    			ScaleImageUtils.resize(500, newFileName, file);
    			// 计算缩放比例
    			double scale = 1d/(fileSize/(500*1024));
    			JPGTransformer jpg = new JPGTransformer(scale);
   		     	jpg.transform(file, new File(newFileName));
    			
    		} else{
    			// 原样保存
    			FileUtil.copyFile(file,new File(newFileName));
    		}
    		
//    		FileUtil.copyFile(file,new File(newFileName));
    		log.info("复制文件");
    		
    		//写入文件
//    		OutputStream fos = new FileOutputStream(new File(upload_file_temps_dir+"/"+new_file_name));
//    		out = new BufferedOutputStream(fos);
//    		out.write(bs);
    		
        	// 静态域名
        	String static_url = Constant.RESOURCE_URL;
        	// 相对静态域名路径
        	String static_upload_file_temp_url = PropKit.use("file.properties").get("static_upload_file_temp_url");
        	if(static_upload_file_temp_url != null && !static_upload_file_temp_url.equals("")){
        		static_url += static_upload_file_temp_url+"/";
        	}
        	static_url += new_file_name;
        	log.info("文件地址{}:"+static_url);

        	Map<String, Object> result = new HashMap<String, Object>();
    		result.put("code", 200);
    		result.put("url", static_url);
//    		setAttr("result", result);
    		/**
    		 * 因富文本框架kindeditor在IE下上传返回json下载文件。需返回json文件才识别数据。
    		 * 所有用了这种方式返回数据。
    		 */
//    		renderJson(result);
    		renderHtml(JsonKit.toJson(result));
    	} catch (Exception e) {
    		log.error("上传文件失败:"+e.getMessage());
			e.printStackTrace();
			Map<String, Object> result = new HashMap<String, Object>();
    		result.put("error", 1);
    		result.put("message", e.getMessage());
//    		setAttr("result", result);
//    		renderFreeMarker("/page/json/kindeditor-upload-json.html");
//    		renderJson(result);
    		renderHtml(JsonKit.toJson(result));
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
