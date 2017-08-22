## gulp-query-webpack
Webpack plugin for [gulp-query](https://github.com/gulp-query/gulp-query)

Uses
[babel-loader](https://www.npmjs.com/package/babel-loader),
[style-loader](https://www.npmjs.com/package/style-loader),
[css-loader](https://www.npmjs.com/package/css-loader) and
[sass-loader](https://www.npmjs.com/package/sass-loader)

```
npm install gulp-query gulp-query-webpack
```

### Example
Paste the code into your `gulpfile.js` and configure it
```javascript
let build = require('gulp-query')
  , webpack = require('gulp-query-webpack')
;
build((query) => {
    query.plugins([js])
      .webpack('src/js/app.js','js/','app')
    
      // Rename and own babel config
      .webpack('src/js/admin.js','js/undercover.js',{
        babel: {
          presets: ['env']
        }
      })
    
      // Config as object
      .webpack({
        from: 'src/js/main.js',
        to: 'js/',
        name: 'main'
      })
    ;
});
```
And feel the freedom
```
gulp
gulp --production // For production
gulp watch // Wathing change
gulp webpack // Only for webpack
gulp webpack:app // Only for app.js
gulp webpack:admin webpack:main watch // Wathcing change only for admin.js and main.js
...
```

### Options
```javascript
.webpack({
    name: "new_name", // For gulp webpack:new_name 
    from: "src/js/app.js",
    to: "js/", // set filename "js/concat.js" -- for rename
    source_map: true,
    source_map_type: 'inline',
    full: false, // if set true is without compress in prod
    babel: {
      presets: ['env']
    }
})
```