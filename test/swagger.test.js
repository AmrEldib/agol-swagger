var assert = require('assert');
var fs = require('fs');
var path = require('path');
var tv4 = require('tv4');

describe("Swagger schema", function () {
  it("Check if schema is valid", function (done) {
    this.timeout(5000);
    JSON.parse(fs.readFileSync(path.resolve(__dirname + '/swagger2'), 'utf8'));
    tv4.addSchema(JSON.parse(fs.readFileSync(path.resolve(__dirname + '/swagger2'), 'utf8')));
    var swaggerSchema = tv4.getSchema('http://swagger.io/v2/schema.json#');
    fs.readFile(path.resolve(__dirname + '/..' + '/data/swagger.json'), 'utf8', function (err, swaggerText) {
      var result = tv4.validateMultiple(JSON.parse(swaggerText), swaggerSchema);
      var textOfError = result.errors.reduce(function (text, error) {
        return text
            + "Message: " + error.message + "\n"
            + "Params: " + JSON.stringify(error.params) + "\n"
            + "Error code: " + error.code + "\n"
            + "Data path: " + error.dataPath + "\n"
            + "------------------- \n"
      }, "\n")
      assert.equal(result.valid, true, textOfError);
      done();
    });
  })
});
