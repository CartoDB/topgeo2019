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
      layer.on('loaded', hideLoader);
}
 
