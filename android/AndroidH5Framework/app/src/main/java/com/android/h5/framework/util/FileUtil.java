package com.android.h5.framework.util;

import android.graphics.Bitmap;

import org.apache.http.util.EncodingUtils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * File utility
 * <p/>
 * Created by simon on 14-3-25.
 */
public class FileUtil {

    private static final String SUFFIX_TMP = ".tmp";

    public static  boolean deleteAllFile(File file){
        System.out.println(file.getName());
        if(file.exists()){

            if(file.isFile()){
                file.delete();
            }
            else if(file.isDirectory()){
                File[] subs = file.listFiles();
                for(File sub : subs){
                    deleteAllFile(sub);
                }
                file.delete();
            }
        }
        return true;

    }

    public static String readFileInString(InputStream fileInputStream, String encoding) {
        String result = "";
        try {
            int length = fileInputStream.available();
            byte[] buffer = new byte[length];
            fileInputStream.read(buffer);
            result = EncodingUtils.getString(buffer, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * Create folder
     *
     * @param path path of the folder
     */
    public static void createFolder(String path) {
        File file = new File(path);
        if (!file.exists())
            file.mkdirs();
    }

    /**
     * If the file of given path exists
     *
     * @param filePath path of file
     * @return true if the file exists
     */
    public static boolean fileExists(String filePath) {
        return new File(filePath).exists();
    }

    /**
     * Unpack zip file
     *
     * @param path
     * @param zipname
     */
    public static void unpackZip(String path, String zipname) throws Exception {
        InputStream is;
        ZipInputStream zis;

        String filename;
        is = new FileInputStream(path + File.separator + zipname);
        zis = new ZipInputStream(new BufferedInputStream(is));
        ZipEntry ze;
        byte[] buffer = new byte[1024];
        int count;

        while ((ze = zis.getNextEntry()) != null) {
            filename = ze.getName();
            // Need to create directories if not exists, or
            // it will generate an Exception...
            if (ze.isDirectory()) {
                File fmd = new File(path + File.separator + filename);
                fmd.mkdirs();
                continue;
            }

            FileOutputStream fout = new FileOutputStream(path + File.separator
                    + filename);

            while ((count = zis.read(buffer)) != -1) {
                fout.write(buffer, 0, count);
            }

            fout.close();
            zis.closeEntry();
        }
        zis.close();
    }

    /**
     * 拷贝文件
     *
     * @param fromFile
     * @param toFile
     * @throws IOException
     */
    public static void copyFile(File fromFile, File toFile) throws IOException {

        FileInputStream from = null;
        FileOutputStream to = null;
        try {
            from = new FileInputStream(fromFile);
            to = new FileOutputStream(toFile);
            byte[] buffer = new byte[1024];
            int bytesRead;

            while ((bytesRead = from.read(buffer)) != -1)
                to.write(buffer, 0, bytesRead); // write
        } finally {
            if (from != null)
                try {
                    from.close();
                } catch (IOException e) {

                }
            if (to != null)
                try {
                    to.close();
                } catch (IOException e) {
                }
        }
    }

    /**
     * 保存bitmap
     * @param bitmap
     * @param file
     */
    public static void saveBitmap(Bitmap bitmap,File file) {
        try {
            FileOutputStream out = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 90, out);
            out.flush();
            out.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
