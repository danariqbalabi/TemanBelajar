export const THEME_KEY = "temanbelajar-theme";

// dipasang di <head> biar tema kepasang sebelum halaman kegambar (ga kedip putih)
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="dark"&&t!=="light"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;
