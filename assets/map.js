function hideLoader() {
    document.getElementById('loader').style.opacity = '0';
  }

function loadMap() {
    const map = new mapboxgl.Map({
        container: 'map',
        style: carto.basemaps.voyager,
        center: [2.5, 33],
        zoom: 1.3,
        scrollZoom: false,
        hash: true
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
  
      // temporary
      function updateZoom() {
        const zoom = map.getZoom().toFixed(2);
        document.getElementById('js-zoom').innerText = `Zoom: ${zoom}`;
      }
      map.on('load', updateZoom);
      map.on('move', updateZoom);

      // Define layer
      const source = new carto.source.Dataset('top_companies_full');
      const viz = new carto.Viz(`
        @size: sqrt(clusterCount()) * 3.5
        @size2: sqrt(clusterCount()) * 7

        width: ramp(zoomrange([2,5]),[@size,@size2])
        color: opacity(rgb(255, 0, 0) 0.4)
        strokeColor: opacity(rgb(255, 0, 0) 0.8)
        strokeWidth: .5
        resolution: 8

        // FOR LABELS
        @c_count: clusterCount()
        @v_features: viewportFeatures(clusterCount())
      `);
      const layer = new carto.Layer('layer', source, viz);

      // Create labeling layer centroids
      layer.on('loaded', () => {
        map.addSource('labels', { type: 'geojson', data: null });
        const labelSource = map.getSource('labels');

        const layerUpdated = function () {
          // const features = viz.variables.c_count.value;
          // const features = viz.variables.v_features.value;

          // const geojsonFeatures = features.map(f => {
          //   return {
          //     "type": "Feature",
          //     "geometry": {
          //       "type": "Point",
          //       "coordinates": f.getRenderedCentroid()
          //     },
          //     "properties": {
          //       "label_field": `${f.properties[ c_count ]}`,
          //     }
          //   }
          // });

          // labelSource.setData({
          //   type: 'FeatureCollection',
          //   features: geojsonFeatures
          // });
        };

        layer.on('updated', layerUpdated);

      });
  
      layer.addTo(map);
      layer.on('loaded', hideLoader);
}
 
