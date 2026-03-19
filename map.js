document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('bible-map').setView([32, 35], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap 圣经地理百科'
    }).addTo(map);

    const overlayConfigs = {};
    const allFeatureGroups = [];

    // --- 自动化渲染核心逻辑 ---
    BIBLE_HEROES.forEach(hero => {
        const markers = L.layerGroup();
        const latlngs = [];

        hero.points.forEach((p, index) => {
            latlngs.push(p.coords);
            L.marker(p.coords)
                .bindPopup(`<b>${hero.name}：${p.name}</b><br>${p.desc}`)
                .addTo(markers);
        });

        const line = L.polyline(latlngs, {
            color: hero.color,
            weight: 3,
            dashArray: hero.dash,
            opacity: 0.7
        });

        // 合并点和线为一个图层组
        const heroLayer = L.layerGroup([markers, line]);
        heroLayer.addTo(map); // 默认全部显示

        // 存入控制面板配置
        overlayConfigs[`<span style='color:${hero.color}'>●</span> ${hero.name}`] = heroLayer;
        allFeatureGroups.push(heroLayer);
    });

    // 添加控制面板
    L.control.layers(null, overlayConfigs, { collapsed: false }).addTo(map);

    // 自动缩放视角包含所有人
    const totalBounds = L.featureGroup(allFeatureGroups).getBounds();
    map.fitBounds(totalBounds, { padding: [40, 40] });
});
