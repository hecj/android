package com.hecj.blog.front.util;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
 
import javax.imageio.ImageIO;
 
/**
 * 图像文件缩放类
 */
public class JPGTransformer {
    // 定义生目标图片的宽度和高度，给其一个就可以了
    private int targetPicWidth = 0;
    private int targetPicHeight = 0;
 
    // 定义目标图片的相比原图片的比例
    private double picScale = 0;
 
    /**
     * 构造函数
     */
    public JPGTransformer(double picScale) {
    	this.picScale = picScale;
    }
 
    /**
     * 重置JPG图片缩放器
     */
    public void resetJPGTransformer() {
        this.picScale = 0;
        this.targetPicWidth = 0;
        this.targetPicHeight = 0;
    }
 
    /**
     * 设置目标图片相对于源图片的缩放比例
     * @param scale
     * @throws JPGException
     */
    public void setPicScale(double scale){
        this.resetJPGTransformer();
        this.picScale = scale;
    }
 
    /**
     * 设置目标图片的宽度
     * @param width
     * @throws JPGException
     */
    public void setSmallWidth(int width) {
        this.resetJPGTransformer();
        this.targetPicWidth = width;
    }
 
    /**
     * 设置目标图片的高度
     * @param height
     * @throws JPGException
     */
    public void SetSmallHeight(int height) {
        this.resetJPGTransformer();
        this.targetPicHeight = height;
    }
 
    /**
     * 开始缩放图片
     *
     * @param srcPicFileName 源图片的文件名
     * @param targetPicFileName 生成目标图片的文件名
     * @throws JPGException
     */
    public void transform(File srcFile, File targetFile){
 
        if (srcFile == null || targetFile == null) {
           return;
        }
 
        // 通过缓冲读入源图片文件
        BufferedImage bSrc = null;
        try {
            // 读取文件生成BufferedImage
            bSrc = ImageIO.read(srcFile);
        } catch (IOException ex) {
        	ex.printStackTrace();
        }
        // 源图片的宽度和高度
        int srcW = bSrc.getWidth();
        int srcH = bSrc.getHeight();
 
        // 设置目标图片的实际宽度和高度
        int targetW = 0;
        int targetH = 0;
        if (this.targetPicWidth != 0) {
            // 根据设定的宽度求出长度
            targetW = this.targetPicWidth;
            targetH = (targetW * srcH) / srcW;
        } else if (this.targetPicHeight != 0) {
            // 根据设定的长度求出宽度
            targetH = this.targetPicHeight;
            targetW = (targetH * srcW) / srcH;
        } else if (this.picScale != 0) {
            // 根据设置的缩放比例设置图像的长和宽
            targetW = (int) ((float) srcW * this.picScale);
            targetH = (int) ((float) srcH * this.picScale);
        }
 
        System.out.println(" 源图片的分辨率： " + srcW + "×" + srcH);
        System.out.println(" 目标图片的分辨率： " + targetW + "×" + targetH);
        // 目标图像的缓冲对象
        BufferedImage bTarget = new BufferedImage(targetW, targetH,
                BufferedImage.TYPE_3BYTE_BGR);
 
        // 求得目标图片与源图片宽度、高度的比例。
        double sx = (double) targetW / srcW;
        double sy = (double) targetH / srcH;
 
        // 构造图像变换对象
        AffineTransform transform = new AffineTransform();
        // 设置图像转换的比例
        transform.setToScale(sx, sy);
 
        // 构造图像转换操作对象
        AffineTransformOp ato = new AffineTransformOp(transform, null);
        // 实现转换，将bSrc转换成bTarget
        ato.filter(bSrc, bTarget);
 
        // 输出目标图片
        try {
            // 将目标图片的BufferedImage写到文件中去，jpeg为图片的格式
            ImageIO.write(bTarget, "jpeg", targetFile);
        } catch (IOException ex) {
        	ex.printStackTrace();
        }
    }
 
    public static void main(String[] args){
        JPGTransformer jpg = new JPGTransformer(0.1);
        String srcFileName = "d:/1.png";
        String targetFileName = "d:/123.png";
        jpg.transform(new File(srcFileName), new File(targetFileName));
    }
}
