function loadMap() {
    const map = new mapboxgl.Map({
        container: 'map',
        style: carto.basemaps.voyager,
        center: [2.5, 33],
        zoom: 1.3,
        scrollZoom: false,
        hash: true,
        customAttribution: [
            '<a target="_blank" href="http://geoawesomeness.com">Geoawesomeness</a>'
        ]
    });

    const nav = new mapboxgl.NavigationControl({
        showCompass: false
    });
    map.addControl(nav, 'top-left');

    // Define user
    carto.setDefaultAuth({
        username: 'stephaniemongon',
        apiKey: 'VMWFFLIx15oGjDIBfzVTgw'
    });

    // Define layer
    const source = new carto.source.Dataset('top_companies_full');
    const viz = new carto.Viz(`
        @size: sqrt(clusterCount()) * 3.5
        @size2: sqrt(clusterCount()) * 7
  
        // width: scaled(@size, 1.3) // check > zoom 3
        width: ramp(zoomrange([2,5]),[@size,@size2])
        color: opacity(rgb(255, 0, 0) 0.4)
        strokeColor: opacity(rgb(255, 0, 0) 0.8)
        strokeWidth: .5
        resolution: 8
      `);
    const layer = new carto.Layer('layer', source, viz);
    layer.addTo(map, 'watername_ocean');

    const noClusterViz = new carto.Viz(`
        @companiesCount: viewportCount()
        @companiesData: viewportFeatures($cartodb_id, $name, $category, $location)

        color: opacity(red, 0.00001)
        strokeWidth: 0
      `);
    const noClusterLayer = new carto.Layer('unclusteredLayer', source, noClusterViz);

    noClusterLayer.addTo(map, 'layer');

    return {
        'map': map,
        'clusterLayer': {
            'viz': viz,
            'layer': layer
        },
        'noClusterLayer': {
            'viz': noClusterViz,
            'layer': noClusterLayer
        }
    }
}