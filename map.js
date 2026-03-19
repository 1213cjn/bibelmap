// 当 HTML 文档完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    initDemoMap();
});

function initDemoMap() {
    // 1. 初始化地图对象
    // 'bible-map' 是 index.html 中 div 的 ID
    // .setView([35.5, 33.0], 6) 设置初始中心坐标（地中海东部）和缩放级别
    const map = L.map('bible-map').setView([35.5, 33.0], 6);

    // 2. 加载地图底图 (Tile Layer)
    // 这里使用 OpenStreetMap 的标准底图，完全免费无需 Key
    // 如果你想用古卷风格，可以用 Esri World Imagery (卫星图)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap 门徒地图 Demo'
    }).addTo(map);

    // 3. 定义保罗第一次布道之旅的地点数据
    // 经纬度为标准标准 approximate 坐标
    const journeyLocations = [
        { name: "叙利亚安提阿", coords: [36.1578, 36.1613], scripture: "使徒行传 13:1-3", desc: "出发地。圣灵差遣保罗和巴拿巴。" },
        { name: "西流基", coords: [36.1264, 35.9525], scripture: "使徒行传 13:4", desc: "海港。由此乘船前往塞浦路斯。" },
        { name: "撒拉米 (塞浦路斯)", coords: [35.1833, 33.9], scripture: "使徒行传 13:5", desc: "在犹太人各会堂里传讲神的道。" },
        { name: "帕弗 (塞浦路斯)", coords: [34.7667, 32.4167], scripture: "使徒行传 13:6-12", desc: "方伯士求保罗蒙召；惩罚术士以利马。" },
        { name: "别加 (潘菲利亚)", coords: [36.95, 30.65], scripture: "使徒行传 13:13", desc: "约翰马可在此离开，回到耶路撒冷。" },
        { name: "彼西底的安提阿", coords: [38.3, 31.2], scripture: "使徒行传 13:14-52", desc: "在会堂的长篇布道；外邦人欢喜，犹太人逼迫。" },
        { name: "以哥念", coords: [37.8667, 32.4833], scripture: "使徒行传 14:1-7", desc: "门徒增多；犹太人和外邦人同谋要用石头打他们。" },
        { name: "路司得", coords: [37.6, 32.2167], scripture: "使徒行传 14:8-19", desc: "医治瘸子；被误认为是神祇；后被犹太人挑唆石头打保罗。" },
        { name: "特庇", coords: [37.35, 33.65], scripture: "使徒行传 14:20-21", desc: "传福音，使许多人作门徒。然后原路返回。" }
    ];

    // 4. 在地图上撒标记 (Markers)
    // 创建一个图层组来存放所有标记，方便管理
    const markerGroup = L.layerGroup().addTo(map);

    // 定义自定义图标（这里用 Leaflet默认图标，可以通过更高级设置换成数字或特定图标）
    
    journeyLocations.forEach((loc, index) => {
        // 创建一个标记
        const marker = L.marker(loc.coords);

        // 创建弹窗内容 (使用 HTML格式化)
        const popupContent = `
            <b>${index + 1}. ${loc.name}</b><br>
            <i>${loc. scripture}</i><br>
            <p style="margin-top:5px; font-size:13px;">${loc.desc}</p>
        `;

        // 将弹窗绑定到标记上
        marker.bindPopup(popupContent);

        // 将标记添加到图层组
        markerGroup.addLayer(marker);
    });

    // 5. 画出布道路线 (Polyline)
    // 路线坐标序列（特庇之后的原路返回就不重复画线了）
    const routeCoords = journeyLocations.map(loc => loc.coords);

    // 创建一条折线
    const routeLine = L.polyline(routeCoords, {
        color: '#e53e3e',   // 红色，显眼
        weight: 3,         // 线宽
        opacity: 0.7,      // 透明度
        dashArray: '5, 10' // 虚线，看起来更有“行程”感
    }).addTo(map);

    // 6. 自动调整缩放级别以包含所有标记和路线
    // 如果你要做保罗所有行程，这步非常重要
    map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
}
document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('bible-map').setView([32.5, 35.0], 8);

    // 基础底图
    const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // --- 数据定义 ---

    // 1. 耶稣的传道路径 (重点在加利利和犹太地)
    const jesusPoints = [
        { name: "拿撒勒", coords: [32.7019, 35.3033], desc: "耶稣长大的地方。" },
        { name: "约旦河", coords: [31.8386, 35.5444], desc: "耶稣受洗的地方。" },
        { name: "迦拿", coords: [32.7464, 35.3297], desc: "变水为酒的神迹。" },
        { name: "迦百农", coords: [32.8811, 35.5750], desc: "耶稣传道的核心基地。" },
        { name: "提比哩亚(加利利海)", coords: [32.7936, 35.5312], desc: "平静风浪，走在水面上。" },
        { name: "耶路撒冷", coords: [31.7683, 35.2137], desc: "最后的晚餐、受难与复活。" }
    ];

    // 2. 保罗第一次布道 (原本的数据)
    const paul1Points = [
        { name: "叙利亚安提阿", coords: [36.1578, 36.1613], desc: "宣教出发点。" },
        { name: "帕弗", coords: [34.7667, 32.4167], desc: "使术士眼瞎。" },
        { name: "别加", coords: [36.95, 30.65], desc: "马可离开。" },
        { name: "路司得", coords: [37.6, 32.2167], desc: "医治瘸子，被石头打。" }
    ];

    // --- 图层创建函数 ---

    function createRouteLayer(points, color, label) {
        const markers = L.layerGroup();
        const coords = [];

        points.forEach((loc, i) => {
            coords.push(loc.coords);
            L.marker(loc.coords)
                .bindPopup(`<b>${label}: ${loc.name}</b><br>${loc.desc}`)
                .addTo(markers);
        });

        const line = L.polyline(coords, {
            color: color,
            weight: 4,
            opacity: 0.6,
            dashArray: color === 'blue' ? '1' : '5, 10' // 耶稣用实线，保罗用虚线区分
        });

        return L.layerGroup([markers, line]);
    }

    // 创建各图层
    const jesusLayer = createRouteLayer(jesusPoints, 'blue', '耶稣');
    const paul1Layer = createRouteLayer(paul1Points, 'red', '保罗');

    // 默认显示耶稣的路径
// 👇 关键修改 1：把两个图层都默认添加到地图上
    jesusLayer.addTo(map);
    paul1Layer.addTo(map);

    // --- 图层控制开关 --- (这部分保持不变，用户依然可以手动关掉某个图层)
    const overlays = {
        "耶稣传道轨迹": jesusLayer,
        "保罗第一次布道": paul1Layer
    };
    L.control.layers(null, overlays, { collapsed: false }).addTo(map);

    // 👇 关键修改 2：把所有路线打包，让地图自动缩放并把它们全部框在屏幕内
    const allLayers = L.featureGroup([jesusLayer, paul1Layer]);
    // padding: [30, 30] 是为了给四周留出 30 像素的边缘，防止路线贴到屏幕死角
    map.fitBounds(allLayers.getBounds(), { padding: [30, 30] });
});
