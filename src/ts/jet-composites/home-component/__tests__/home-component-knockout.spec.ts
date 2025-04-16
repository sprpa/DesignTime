import 'home-component/loader';
import * as Context from 'ojs/ojcontext';
import * as ko from 'knockout';
import 'ojs/ojknockout';

declare const expect: Chai.ExpectStatic;

describe('Knockout sample test', () => {
  const markup = `<home-component></home-component>`;
  describe('sample test', () => {
    it('Markup should not be null', () => {
      expect(markup).not.null;
    });
  });
});