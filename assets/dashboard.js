// hello

function _toggleDrawer() {
    document
        .querySelector('.as-toolbar__actions')
        .classList.toggle('as-toolbar__actions--visible');
}


function _toggleAbout() {
    document
        .querySelector('.js-about')
        .classList.toggle('js-about--hidden');
}

function refreshCompaniesData(variables) {
    vm.companiesCount = variables.companiesCount.value;
    const properties = vm.companiesProperties;
    vm.companiesData = variables.companiesData.value.map(function (entry) {
        if (entry && entry.properties) {
            const props = entry.properties;
            result = {};
            properties.forEach(prop => {
                result[prop] = entry.properties[prop]
            });
            result['coordinates'] = entry.getRenderedCentroid()
            return result;

        } else {
            return null
        }
    });

    vm.companiesData.sort(function(prev,next){
        return prev['founded_year'] - next['founded_year'];
    })
}

function refreshClusters(viz){

}

function loadDashboard(vm, data) {
    const map = data.map;
    const noClusterViz = data.noClusterLayer.viz;
    const noClusterLayer = data.noClusterLayer.layer;

    noClusterLayer.on('updated', function () {
        refreshCompaniesData(noClusterViz.variables);
    })
    noClusterLayer.on('loaded', function () {
        refreshCompaniesData(noClusterViz.variables);
    })

    const clusterViz = data.clusterLayer.viz;
    const clusterLayer = data.clusterLayer.layer;

    clusterLayer.on('updated',function(){
        refreshClusters(clusterViz);
    });
    clusterLayer.on('loaded',function(){
        map.addSource('labels', { type: 'geojson', data: null });
        const labelSource = map.getSource('labels');

        const layerUpdated = function () {
            const features = clusterViz.variables.list.value;
            const geoJson = {
                type: 'FeatureCollection',
                features:  features.map(f => {
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
            
              console.log(geoJson);
            labelSource.setData(geoJson);
          };
    
          clusterLayer.on('updated', layerUpdated);
    
          // Style labels
          map.addLayer({
            "id": "my-labels",
            "type": "symbol",
            "source": "labels",
            "layout": {
              "text-field": "{count}",
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": 10,
              "text-offset": [0, 0],
              "text-anchor": "top",
              "text-max-width": 8,
              "text-justify": "center"
            },
            "paint": {
              "text-color": "white",
              "text-halo-color": "fuchsia",
              "text-halo-width": 0.5,
              "text-halo-blur": 0.5
            },
            "filter": ['>=','count',2]
          });

    });
};