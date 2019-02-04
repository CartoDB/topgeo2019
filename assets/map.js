function loadMap() {
    const map = new mapboxgl.Map({
        container: 'map',
        style: carto.basemaps.voyager,
        center: [-5, 23],
        zoom: 1.3,
        scrollZoom: false,
        // hash: true,
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
    const source = new carto.source.SQL("select *, cast(unnest(regexp_matches(founded_at,'[0-9]{4}')) as int) as founded_year from top_companies_full");
    const viz = new carto.Viz(`
        @c_count: clusterCount()
        @manRamp: buckets(@c_count, [1, 2, 3, 4, 5])
        @fillRamp: ramp(@manRamp, sunset)
        @strokeColorRamp1: ramp(@manRamp, [#f3e79b,#E3B556,#E17767,#D8514C,#E24EE5,#934AB7,#5c53a5])
        @strokeColorRamp2: ramp(@manRamp, [#f3e79b,#E39206,#E17767,#D8514C,#E24EE5,#934AB7,#5c53a5])
        @sizeRamp: ramp(@manRamp, [0, 13])
        @list: viewportFeatures($cartodb_id)

        width: ramp(zoomrange([2, 4, 6]),[@sizeRamp, @sizeRamp * 4, @sizeRamp * 6])
        color: ramp(zoomrange([1.4, 2]),[ opacity(@fillRamp,1), opacity(@fillRamp,0.7) ])
        strokeColor: ramp(zoomrange([2, 5]),[ opacity(@strokeColorRamp1,1), opacity(@strokeColorRamp2,0.5) ])
        strokeWidth: ramp(zoomrange([2, 7]),[1, ramp(@manRamp, [1.2, 2.4, 3.6, 4.8, 6]) ])
        resolution: 8
      `);
    const layer = new carto.Layer('layer', source, viz);
    layer.addTo(map);

    // Labels
    layer.on('loaded', function () {
        map.addSource('labels', {
            type: 'geojson',
            data: null
        });
        const labelSource = map.getSource('labels');

        const layerUpdated = function () {
            const features = viz.variables.list.value;
            const geoJson = {
                type: 'FeatureCollection',
                features: features.map(f => {
                    const count = f._rawFeature._cdb_feature_count;
                    return {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": f.getRenderedCentroid()
                        },
                        "properties": {
                            "count": count
                        }
                    }
                })
            };
            labelSource.setData(geoJson);
        };

        layer.on('updated', layerUpdated);

        // Style labels
        map.addLayer({
            "id": "my-labels",
            "type": "symbol",
            "source": "labels",
            "layout": {
                "text-field": "{count}",
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": {
                    "stops": [
                      [2.9, 0],
                      [3, 9.5],
                      [6, 18]
                    ]
                },
                "text-offset": [0, 0],
                "text-anchor": "center",
                "text-max-width": 8,
                "text-justify": "center"
            },
            "paint": {
                "text-color": "white",
                "text-halo-color": "#4C5C6B",
                "text-halo-width": 0.5,
                "text-halo-blur": 0.5
            },
            "filter": ['>=', 'count', 2]
        });
    });

    // Unclustered layer for table rendering
    
    const companiesProperties = vm.companiesProperties.map(function (prop) {
        return `$${prop}`
    }).join(', ');

    const noClusterViz = new carto.Viz(`
        @companiesCount: viewportCount()
        @companiesData: viewportFeatures(${companiesProperties})

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