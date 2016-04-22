var agolSchemas = require('agol-schemas');
var RSVP = require('rsvp');
var path = require('path');
var fs = require('fs');

agolSchemas.getSchema('swaggerDefinitions').then(function (defs) {
  fs.readFile(path.resolve(__dirname, '..', 'data/swagger.json'), 'utf8', function (error, data) {
    if (error) throw error;
    var swaggerDoc = JSON.parse(data);
    swaggerDoc.definitions = defs;
    
    fs.readFile(path.resolve(__dirname, '..', 'data/body-parameters.json'), 'utf8', function (err, data) {
      var bodyParametersDefs = JSON.parse(data);
      Object.keys(bodyParametersDefs.definitions).forEach(function (key) {
        swaggerDoc.definitions[key] = bodyParametersDefs.definitions[key];
      });
      
      fs.writeFile(path.resolve(__dirname, '..', 'data/swagger.json'), JSON.stringify(swaggerDoc, null, 2), function () {
        console.log('Swagger definitions updated');
      });

    });
  });
});
