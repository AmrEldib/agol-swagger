var agolSchemas = require('agol-schemas');
var RSVP = require('rsvp');
var path = require('path');
var fs = require('fs');

agolSchemas.getSchema('swaggerDefinitions').then(function (defs) {
  fs.readFile(path.resolve(__dirname, '..', 'data/swagger.json'), function (error, data) {
    if (error) throw error;
    var swaggerDoc = JSON.parse(data);
    swaggerDoc.definitions = defs;
    fs.writeFile(path.resolve(__dirname, '..', 'data/swagger.json'), JSON.stringify(swaggerDoc, null, 2), function () {
      console.log('Swagger definitions updated');
    });
  });
});
