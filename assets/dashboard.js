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
};