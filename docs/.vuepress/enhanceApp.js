/**
 * to主题使用者：你可以去掉本文件的所有代码
 */
export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData, // 站点元数据
  isServer // 当前应用配置是处于 服务端渲染 还是 客户端
}) => {

  // 用于监控在路由变化时检查广告拦截器 (to主题使用者：你可以去掉本文件的所有代码)
  if (!isServer) {
    router.afterEach(() => {
      //check if wwads' fire function was blocked after document is ready with 3s timeout (waiting the ad loading)
      docReady(function () {
        setTimeout(function () {
          if (window._AdBlockInit === undefined) {
            ABDetected();
          }
        }, 3000);
      });

      // 删除事件改为隐藏事件
      setTimeout(() => {
        const pageAD = document.querySelector('.page-wwads');
        if (!pageAD) return;
        const btnEl = pageAD.querySelector('.wwads-hide');
        if (btnEl) {
          btnEl.onclick = () => {
            pageAD.style.display = 'none';
          }
        }
        // 显示广告模块
        if (pageAD.style.display === 'none') {
          pageAD.style.display = 'flex';
        }
      }, 900);
    })
  }
}


function ABDetected() {
  const h = "<style>.wwads-horizontal,.wwads-vertical{background-color:#f4f8fa;padding:5px;min-height:120px;margin-top:20px;box-sizing:border-box;border-radius:3px;font-family:sans-serif;display:flex;min-width:150px;position:relative;overflow:hidden;}.wwads-horizontal{flex-wrap:wrap;justify-content:center}.wwads-vertical{flex-direction:column;align-items:center;padding-bottom:32px}.wwads-horizontal a,.wwads-vertical a{text-decoration:none}.wwads-horizontal .wwads-img,.wwads-vertical .wwads-img{margin:5px}.wwads-horizontal .wwads-content,.wwads-vertical .wwads-content{margin:5px}.wwads-horizontal .wwads-content{flex:130px}.wwads-vertical .wwads-content{margin-top:10px}.wwads-horizontal .wwads-text,.wwads-content .wwads-text{font-size:14px;line-height:1.4;color:#0e1011;-webkit-font-smoothing:antialiased}.wwads-horizontal .wwads-poweredby,.wwads-vertical .wwads-poweredby{display:block;font-size:11px;color:#a6b7bf;margin-top:1em}.wwads-vertical .wwads-poweredby{position:absolute;left:10px;bottom:10px}.wwads-horizontal .wwads-poweredby span,.wwads-vertical .wwads-poweredby span{transition:all 0.2s ease-in-out;margin-left:-1em}.wwads-horizontal .wwads-poweredby span:first-child,.wwads-vertical .wwads-poweredby span:first-child{opacity:0}.wwads-horizontal:hover .wwads-poweredby span,.wwads-vertical:hover .wwads-poweredby span{opacity:1;margin-left:0}.wwads-horizontal .wwads-hide,.wwads-vertical .wwads-hide{position:absolute;right:-23px;bottom:-23px;width:46px;height:46px;border-radius:23px;transition:all 0.3s ease-in-out;cursor:pointer;}.wwads-horizontal .wwads-hide:hover,.wwads-vertical .wwads-hide:hover{background:rgb(0 0 0 /0.05)}.wwads-horizontal .wwads-hide svg,.wwads-vertical .wwads-hide svg{position:absolute;left:10px;top:10px;fill:#a6b7bf}.wwads-horizontal .wwads-hide:hover svg,.wwads-vertical .wwads-hide:hover svg{fill:#3E4546}</style><a href='https://wwads.cn/page/whitelist-wwads' class='wwads-img' target='_blank' rel='nofollow'><img src='https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store@master/blog/wwads.2a3pidhlh4ys.webp' width='130'></a><div class='wwads-content'><a href='https://wwads.cn/page/whitelist-wwads' class='wwads-text' target='_blank' rel='nofollow'>为了本站的长期运营，请将我们的网站加入广告拦截器的白名单，感谢您的支持！<span style='color: #11a8cd'>如何添加白名单?</span></a><a href='https://wwads.cn/page/end-user-privacy' class='wwads-poweredby' title='万维广告 ～ 让广告更优雅，且有用' target='_blank'><span>广告</span></a></div><a class='wwads-hide' onclick='parentNode.remove()' title='隐藏广告'><svg xmlns='http://www.w3.org/2000/svg' width='6' height='7'><path d='M.879.672L3 2.793 5.121.672a.5.5 0 11.707.707L3.708 3.5l2.12 2.121a.5.5 0 11-.707.707l-2.12-2.12-2.122 2.12a.5.5 0 11-.707-.707l2.121-2.12L.172 1.378A.5.5 0 01.879.672z'></path></svg></a>";
  const wwadsEl = document.getElementsByClassName("wwads-cn");
  const wwadsContentEl = document.querySelector('.wwads-content');
  if (wwadsEl[0] && !wwadsContentEl) {
    wwadsEl[0].innerHTML = h;
  }
};

//check document ready
function docReady(t) {
  "complete" === document.readyState ||
    "interactive" === document.readyState
    ? setTimeout(t, 1)
    : document.addEventListener("DOMContentLoaded", t);
}

export default ({
                  Vue, // VuePress 正在使用的 Vue 构造函数
                  options, // 附加到根实例的一些选项
                  router, // 当前应用的路由实例
                  siteData, // 站点元数据
                  isServer // 当前应用配置是处于 服务端渲染 或 客户端
                }) => {
  /**
   * 私密文章验证
   */
  if (!isServer) {
    // 如果开启了私密文章验证
    if (
        siteData.themeConfig.privatePage &&
        siteData.themeConfig.privatePage.openPrivate
    ) {
      router.beforeEach((to, from, next) => {
        try {
          let {
            username,
            password,
            loginPath,
            loginKey,
            loginSession,
            loginInfo,
            firstLogin,
            firstLoginKey,
          } = siteData.themeConfig.privatePage;
          !loginKey && (loginKey = "vdoing_manager"); // 默认为 vdoing_manager
          !firstLoginKey && (firstLoginKey = "vdoing_first_login"); // 默认为 vdoing_first_login
          // 网站关闭或者刷新后，清除登录状态
          if (loginSession) {
            window.addEventListener("unload", function () {
              localStorage.removeItem(loginKey);
              localStorage.removeItem(firstLoginKey);
            });
          }
          // 如果是登录页面，不需要验证
          if (loginPath == to.path || !loginPath) {
            throw new Error("无需验证");
          }
          // 尝试获取管理员曾经登录的用户信息
          let globalInfo = JSON.parse(localStorage.getItem(loginKey));
          // 管理员用户名密码验证
          if (
              globalInfo &&
              globalInfo.username == username &&
              globalInfo.password == password
          ) {
            // 存在曾经登录信息，如果登录状态过期
            if (new Date() - globalInfo.time > globalInfo.expire) {
              localStorage.removeItem(loginKey);
            } else {
              throw new Error("管理员验证成功！");
            }
          }
          // 整个网站进入前需要验证
          let isAgainLogin = true;
          if (parseInt(firstLogin) == 1 || parseInt(firstLogin) == 2) {
            parseInt(firstLogin) == 2 && (isAgainLogin = false);
            // 尝试获取第一次访问网站曾经登录的用户信息
            let firstLoginInfo = JSON.parse(
                localStorage.getItem(firstLoginKey)
            );
            !firstLoginInfo && jumpToLogin(loginPath, to.path, "first");
            if (firstLoginInfo) {
              // 先判断 loginInfo 是否存在，然后判断 loginInfo 是否对象，最后判断 loginInfo 是否有 firstLoginKey
              if (loginInfo && loginInfo.hasOwnProperty(firstLoginKey)) {
                // 进行 loginInfo 验证
                checkLoginInfo(loginInfo[firstLoginKey], firstLoginInfo) &&
                jumpToLogin(loginPath, to.path, "first");
              } else {
                jumpToLogin(loginPath, to.path, "first");
              }
            }
          }
          if (to.path == "/") {
            throw new Error("首页不需要验证！");
          }
          // 如果 firstLogin 不等于 2
          if (isAgainLogin) {
            siteData.pages.forEach((item) => {
              // 找出带有 private 的文章
              if (item.path == to.path) {
                if (
                    item.frontmatter.private &&
                    item.frontmatter.private == true
                ) {
                  // 网站关闭或者刷新后，清除登录状态
                  if (loginSession) {
                    window.addEventListener("unload", function () {
                      localStorage.removeItem(item.frontmatter.permalink);
                    });
                  }
                  // 尝试获取该私密文章曾经登录的用户信息
                  let singleInfo = JSON.parse(
                      localStorage.getItem(item.frontmatter.permalink)
                  );
                  // 都不存在登录信息
                  !singleInfo &&
                  jumpToLogin(
                      loginPath,
                      to.path,
                      item.frontmatter.loginInfo ||
                      item.frontmatter.username ||
                      item.frontmatter.password ||
                      item.frontmatter.expire
                          ? "single"
                          : "all"
                  );

                  // 单个文章私密验证
                  if (
                      (item.frontmatter.username && item.frontmatter.password) ||
                      item.frontmatter.loginInfo
                  ) {
                    // 不存在登录信息，则跳转到登录页面
                    !singleInfo && jumpToLogin(loginPath, to.path, "single");
                    // 存在曾经登录信息，如果登录状态过期
                    if (new Date() - singleInfo.time > singleInfo.expire) {
                      localStorage.removeItem(item.frontmatter.permalink);
                      jumpToLogin(loginPath, to.path, "single");
                    }
                    // 是否需要登录
                    let isLogin = true;
                    // 对 loginInfo 进行验证
                    if (Array.isArray(item.frontmatter.loginInfo)) {
                      isLogin = checkLoginInfo(
                          item.frontmatter.loginInfo,
                          singleInfo
                      );
                    }
                    // 如果 loginInfo 不存在，则进行单文章的用户名密码验证
                    if (
                        isLogin &&
                        singleInfo.username !== item.frontmatter.username &&
                        singleInfo.password !== item.frontmatter.password
                    ) {
                      jumpToLogin(loginPath, to.path, "single");
                    }
                  } else {
                    // 全局私密验证
                    let isLogin = true;
                    // 先判断 loginInfo 是否存在，然后判断 loginInfo 是否对象，最后判断 loginInfo 是否有该文章的 permalink
                    if (loginInfo && loginInfo.hasOwnProperty(to.path)) {
                      isLogin = checkLoginInfo(loginInfo[to.path], singleInfo);
                    }
                    // 如果 loginInfo 验证失败
                    isLogin && jumpToLogin(loginPath, to.path, "all");
                  }
                }
              }
            });
          }
        } catch (e) {}
        next();
      });
    }
  }
  /**
   * 检查 loginInfo 里的用户名和密码，userInfo 为曾经登录的信息
   * 匹配成功返回 false，失败返回 true
   */
  function checkLoginInfo(loginInfo, userInfo) {
    try {
      loginInfo.forEach((info) => {
        if (
            userInfo.username == info.username &&
            userInfo.password == info.password
        ) {
          // 利用异常机制跳出 forEach 循环，break、return、continue 不会起作用
          throw new Error();
        }
      });
    } catch (error) {
      return false;
    }
    return true;
  }
  /**
   * 跳转到登录页面
   * loginPath：登录页面的 permalink
   * toPath：当前页面的 permalink，verifyMode：验证方式
   */
  function jumpToLogin(loginPath, toPath, verifyMode) {
    router.push({
      path: loginPath,
      query: {
        toPath: toPath,
        verifyMode: verifyMode, // 单个文章验证（single）或全局验证（all）或网站验证（first）
      },
    });
    throw new Error("请先登录！");
  }
}
