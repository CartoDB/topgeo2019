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

function refreshData(variables) {
    vm.companiesCount = variables.companiesCount.value;
    const properties = vm.companiesProperties;
    vm.companiesData = variables.companiesData.value.map(function (entry) {
        if (entry && entry.properties) {
            const props = entry.properties;
            result = {};
            properties.forEach(prop => {
                result[prop] = entry.properties[prop]
            });
            return result;

        } else {
            return null
        }
    })
}

function loadDashboard(vm, data) {
    const viz = data.noClusterLayer.viz;
    const layer = data.noClusterLayer.layer;

    layer.on('updated', function () {
        refreshData(viz.variables);
    })
    layer.on('loaded', function () {
        refreshData(viz.variables);
    })
}