describe.only('$Ref metadata', function () {
  'use strict';

  it.skip('should not save metadata if the dereference.metadata option is not set', function () {

  });

  it('should save metadata for internal refs', function () {
    var parser = new $RefParser();
    return parser
      .dereference(path.rel('specs/metadata/spec.yaml'), { dereference: { metadata: true }})
      .then(function (schema) {
        var metadata = $RefParser.getMetadata(schema.properties.a);
        expect(metadata).to.be.an('object');
        expect(metadata.$ref).to.eq('#/definitions/internal');
        expect(metadata.pathFromRoot).to.eq('#/properties/a');
        expect(metadata.path).to.contain('spec.yaml#/properties/a');
      });
  });

  it('should save metadata for external refs', function () {
    var parser = new $RefParser();
    return parser
      .dereference(path.rel('specs/metadata/spec.yaml'), { dereference: { metadata: true }})
      .then(function (schema) {
        var metadata = $RefParser.getMetadata(schema.properties.b);
        expect(metadata).to.be.an('object');
        expect(metadata.$ref).to.eq('external.yaml');
        expect(metadata.pathFromRoot).to.eq('#/properties/b');
        expect(metadata.path).to.contain('spec.yaml#/properties/b');
      });
  });

  it.skip('should save metadata for inline schemas', function () {
    var parser = new $RefParser();

    var schema = {
      title: 'Person',
      type: 'object',
      properties: {
        firstName: {
          $ref: '#/definitions/name'
        },
        lastName: {
          $ref: '#/definitions/name'
        }
      },
      definitions: {
        name: {
          type: 'string',
          minLength: 1
        }
      }
    };

    var options = {
      dereference: {
        metadata: true
      }
    };

    return parser
      .dereference(schema, options)
      .then(function (dereferenced) {
        var firstName = dereferenced.properties.firstName;
        var lastName = dereferenced.properties.lastName;

        // The "firstName" property has been dereferenced
        expect(firstName).to.deep.equal({
          type: 'string',
          minLength: 1,
        });

        expect(parser.getMetadata(firstName)).to.deep.equal({
          $ref: '#/definitions/name',
          path: '',
          pathFromRoot: '#/properties/firstName',
        });

        // The "lastName" property has been dereferenced to the same object, with the same metadata
        expect(lastName).to.equal(firstName);
        expect(parser.getMetadata(lastName)).to.equal(parser.getMetadata(firstName));
      });
  });
});
