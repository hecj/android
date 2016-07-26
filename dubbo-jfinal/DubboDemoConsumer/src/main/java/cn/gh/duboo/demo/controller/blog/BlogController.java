package cn.gh.duboo.demo.controller.blog;

import cn.gh.duboo.demo.model.Blog;
import cn.gh.duboo.demo.service.BlogService;

import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.plugin.spring.Inject;
import com.jfinal.plugin.spring.IocInterceptor;

@Before({ BlogInterceptor.class, IocInterceptor.class })
public class BlogController extends Controller {

	@Inject.BY_NAME
	private BlogService blogService;

	public void index() {
		setAttr("blogPage", blogService.paginate(getParaToInt(0, 1), 10));
		render("blog.html");
	}

	public void add() {
		render("add.html");
	}

	@Before(BlogValidator.class)
	public void save() {
		Blog blog = getModel(Blog.class, "blog");
		blogService.save(blog);
		redirect("/blog");
	}

	public void edit() {
		setAttr("blog", blogService.findById(getPara()));
	}

	@Before(BlogValidator.class)
	public void update() {
		Blog blog = getModel(Blog.class, "blog");
		blogService.update(blog);
		redirect("/blog");
	}

	public void delete() {
		blogService.deleteById(getPara());
		redirect("/blog");
	}
}
