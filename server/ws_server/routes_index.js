// 在routes文件夹下添加路由文件之后，需要把路由文件引入下面数组。
let routes = [
    require('./routes/example.js'),
    // continue
];

let routeArray = [];

routes.forEach((routesObject) => {
    Object.keys(routesObject).forEach((routeName) => {
        let Route = routesObject[routeName];
        routeArray.push(Route);
    })
})

module.exports = routeArray;
