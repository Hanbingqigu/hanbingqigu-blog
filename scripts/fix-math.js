console.log("loaded fix-math.js");
hexo.extend.filter.register('before_post_render', function(data) {
    data.content = data.content.replace(/\\begin\{align\*?\}/g, '\\begin{aligned}');
    data.content = data.content.replace(/\\end\{align\*?\}/g, '\\end{aligned}');

    return data;
});