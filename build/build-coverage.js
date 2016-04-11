var fs = require('fs');
var path = require('path');
var config = require('../config/config');
var coverageConfig = require('agol-schemas/config/coverage-config');

var routerNames = [];

/**
 * Determines whether a certain item of the ArcGIS REST API is covered or not
 * @param {object} coverage Coverage object that contains number of completed items, total count, description all items
 * @param {object} coverageItem Item who coverage will be checked
 * @returns {string} Text representation of whether an item is covered or not
 */
function getCoverage(coverage, coverageItem) {
  if (coverageItem.hasOwnProperty("children") && coverageItem.children.length != 0) {
    coverage.description += "**" + coverageItem.title + "**  \n";
    return coverageItem.children.reduce(getCoverage, coverage);
  }
  else if (!coverageItem.hasOwnProperty("children") && coverageItem.title != "") {
    if (routerNames.indexOf(coverageItem.schema) != -1) {
      coverage.description += "✔ ";
      coverage.completed += 1;
    }
    else {
      coverage.description += "✖ ";
    }
    coverage.itemsCount += 1;
    coverage.description += "[" + coverageItem.title + "](" + coverageItem.url + ")" + "  \n";
    return coverage;
  }
  else {
    return coverage;
  }
}

/**
 * Collects coverage for all ArcGIS REST API items. Writes results to file specified in config.coverageFile
 */
function collectCoverage() {
  
  collectSwaggerRouterNames(function (names) {
    
    routerNames = names;

    var coverage = {
      completed: 0,
      itemsCount: 0,
      description: ""
    };
    coverage = coverageConfig.reduce(getCoverage, coverage);
    
    var coverageText = "### agol-swagger Coverage of ArcGIS REST API \n" 
    + "Completed items: " + coverage.completed + "  \n" 
    + "Total items: " + coverage.itemsCount + "  \n" 
    + "Completed: " + ((coverage.completed / coverage.itemsCount) * 100).toFixed(0) + " %  \n\n\n" 
    + coverage.description;
    
    // Write to file
    fs.writeFile(path.resolve(__dirname, '..', config.docFolder + "/" + config.coverageFile), coverageText);
  });
}

function collectSwaggerRouterNames(callback) {
  fs.readFile(path.resolve(__dirname, '..', 'data/swagger.json'), function (error, data) {
    if (error) throw error;
    var swaggerDoc = JSON.parse(data);
    var names = Object.keys(swaggerDoc.paths).map(function (swaggerPath) {
      return swaggerDoc.paths[swaggerPath]['x-swagger-router-controller'];
    }).filter(function (routerName) { 
      return routerName != undefined;
    });
    callback(names); 
  });
}

module.exports = {
  collectCoverage: collectCoverage
};

collectCoverage();