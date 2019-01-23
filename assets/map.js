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

        width: ramp(zoomrange([2,4]),[@size,@size2])
        color: opacity(ramp(buckets(@c_count, [1, 2, 3, 4, 5, 6, 7, 8]), sunset) 0.7)
        strokeColor: opacity(ramp(buckets(@c_count, [1, 2, 3, 4, 5, 6, 7, 8]), sunset) 0.9)
        strokeWidth: .5
        resolution: 8
      `);
      const layer = new carto.Layer('layer', source, viz);
  
      layer.addTo(map);

      //** ADD LEGEND **//

        // A function to convert map colors to HEX values for legend
        function rgbToHex(color) {
          return "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
      }

      // When layer loads, trigger legend event
      layer.on('loaded', () => {
          hideLoader();

          // Request data for legend from the layer viz
          const colorLegend = layer.viz.color.getLegendData();
          let colorLegendList = '';

          // Create list elements for legend
          colorLegend.data.forEach((legend, index) => {
              const color = rgbToHex(legend.value);

              // Style for legend items based on geometry type
              colorLegendList +=
                  `<li><span class="point-mark" style="background-color:${color}; border: 1px solid black;"></span><span>${legend.key.replace('CARTO_VL_OTHERS', 'Other weather')}</span></li>\n`;
          });

          // Place list items in the content section of the title/legend box
          document.getElementById('content').innerHTML = colorLegendList;
      });
}
 
