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
        @size: sqrt(@c_count) * 3
        @size2: @c_count * 6
        @colorRamp: ramp(buckets(@c_count, [1, 2, 3, 4, 5, 6, 7, 8]), sunset)
        @colorOpacity: 0.7

        width: ramp(zoomrange([2,4]),[@size,@size2])
        color: opacity(@colorRamp, @colorOpacity)
        strokeColor: opacity(ramp(buckets(@c_count, [1, 2, 3, 4, 5, 6, 7, 8]), sunset) 0.9)
        strokeWidth: .5
        resolution: 8
      `);
      const layer = new carto.Layer('layer', source, viz);
  
      layer.addTo(map);

      layer.on('loaded', () => {
        hideLoader();

        //** ADD LEGEND **//
        // Request data for legend from the layer viz variables 'myRamp' and 'myOpacity'
        const colorLegend = layer.viz.variables.colorRamp.getLegendData();
        const opacity = layer.viz.variables.colorOpacity.value;

        let colorLegendList = '';

        // Create list elements for legend
        colorLegend.data.forEach((legend, index) => {
          const color = legend.value;
          // Add the predefined opacity to the ramp color components
          const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
          // Style for legend items based on geometry type
          colorLegendList +=
            `<li><span class="point-mark" style="background-color:${rgba}; border: 1px solid black;"></span><span>${legend.key}</span></li>\n`;
          // Place list items in the content section of the title/legend box
          document.getElementById('content').innerHTML = colorLegendList;
        });

      });
      
}
 
