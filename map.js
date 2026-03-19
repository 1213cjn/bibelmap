/**
 * 圣经地理动态渲染引擎
 * 逻辑：自动读取 data.js 中的 BIBLE_HEROES 数组并绘图
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化地图，默认中心设在耶路撒冷
    // 这里的坐标只是初始值，最后会被 fitBounds 覆盖
    const map = L.map('bible-map').setView([31.7683, 35.2137], 6);

    // 2. 加载底图 (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap | 圣经地理百科'
    }).addTo(map);

    // 用于存放所有人物图层的对象，供右侧控制面板使用
    const overlayConfigs = {};
    // 用于存放所有要素组，以便最后计算地图视野
    const allFeatureGroups = [];

    // 3. 核心逻辑：自动化遍历数据
    // 检查数据是否存在，防止报错
    if (typeof BIBLE_HEROES !== 'undefined' && Array.isArray(BIBLE_HEROES)) {
        
        BIBLE_HEROES.forEach(hero => {
            const markerGroup = L.layerGroup();
            const pathCoords = [];

            // 遍历每个人的所有地点
            hero.points.forEach((point, index) => {
                // 记录坐标用于画线
                pathCoords.push(point.coords);

                // 创建标记点
                const marker = L.marker(point.coords);
                
                // 设置弹窗内容
                const popupHTML = `
                    <div style="min-width:150px">
                        <strong style="color:${hero.color}; font-size:16px;">${hero.name}</strong><br>
                        <b style="font-size:14px;">${index + 1}. ${point.name}</b><br>
                        <p style="margin-top:8px; font-size:13px; color:#555; line-height:1.4;">${point.desc}</p>
                    </div>
                `;
                marker.bindPopup(popupHTML);
                
                // 将标记加入该人物的组
                markerGroup.addLayer(marker);
            });

            // 创建路径连线
            const polyline = L.polyline(pathCoords, {
                color: hero.color,
                weight: 3,
                opacity: 0.7,
                dashArray: hero.dash || '1', // 如果没设虚线就用实线
                smoothFactor: 1
            });

            // 将标记组和线组合成一个“人物大图层”
            const heroLayer = L.layerGroup([markerGroup, polyline]);
            
            // 默认全部显示在地图上
            heroLayer.addTo(map);

            // 将该图层加入控制面板配置，并带上颜色小点作为标识
            const label = `<span style="color:${hero.color}; font-weight:bold;">●</span> ${hero.name}`;
            overlayConfigs[label] = heroLayer;

            // 收集图层以便后续缩放定位
            allFeatureGroups.push(heroLayer);
        });

    } else {
        console.error("未找到 BIBLE_HEROES 数据，请检查 data.js 是否正确引入。");
    }

    // 4. 添加图层控制面板 (右上角)
    // collapsed: false 表示默认展开，方便手机端直接点选
    L.control.layers(null, overlayConfigs, { 
        collapsed: false,
        position: 'topright' 
    }).addTo(map);

    // 5. 智能视野缩放
    // 这一步能确保无论数据跨度多大（从意大利到波斯湾），一进去都能全部看全
    if (allFeatureGroups.length > 0) {
        const totalGroup = L.featureGroup(allFeatureGroups);
        map.fitBounds(totalGroup.getBounds(), { padding: [40, 40] });
    }
});
