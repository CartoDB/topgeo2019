function hideLoader() {
    document.getElementById('loader').style.opacity = '0';
  }

function loadMap() {
    const map = new mapboxgl.Map({
        container: 'map',
        style: carto.basemaps.voyager,
        center: [2.5, 33],
        zoom: 1.3,
        scrollZoom: false
        // hash: true
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
        @c_count: clusterCount()
        @manRamp: buckets(@c_count, [1, 2, 3, 4, 5])
        @colorRamp: ramp(@manRamp, sunset)
        @opacity1: opacity(@colorRamp, 1)
        @opacity2: opacity(@colorRamp, 0.7)

        // width: ramp(zoomrange([2,4]),[@size,@size2])

        width: sqrt(ramp(@manRamp, [0, 9^2]))
        color: ramp(zoomrange([3.5, 4]),[@opacity1,@opacity2])
        strokeColor: @opacity1
        strokeWidth: .5
        resolution: 8
      `);
      const layer = new carto.Layer('layer', source, viz);
  
      layer.addTo(map);

      layer.on('loaded', () => {
        hideLoader();
      });
      
}
 
