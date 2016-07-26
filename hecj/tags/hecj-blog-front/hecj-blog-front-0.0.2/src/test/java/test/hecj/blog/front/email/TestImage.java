package test.hecj.blog.front.email;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import com.hecj.blog.front.util.JPGTransformer;

public class TestImage {

	/**
	 * @param args void
	 * @Version		V1.0
	 * @date		2016-1-4 上午1:36:06
	 * @author hechaojie
	 * @throws IOException 
	 * @modify
	 */
	public static void main(String[] args) throws IOException {

//		String srcFile = "d:/a/IMG_1348.jpg";
		String srcFile = "d:/a/20m.jpg";
		BufferedImage bufferedImage = ImageIO.read(new File(srcFile));   
		System.out.println("图片宽度："+bufferedImage.getWidth());
		
		JPGTransformer jpg = new JPGTransformer(0.1d);
	    jpg.transform(new File(srcFile),new File("d:/a/1.jpg"));
	}

}
