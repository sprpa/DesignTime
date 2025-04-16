import ViewModel from 'home-component/home-component-viewModel';
import 'home-component/loader';
import * as Context from 'ojs/ojcontext';

declare const expect: Chai.ExpectStatic;

describe('Unit tests - sample test', () => {
  describe('UI tests', () => {
    it('check that the declared variable not equal to null', () => {
      const dummyTest = 'My dummy test';
      expect(dummyTest).not.to.be.null;
    });
  });
});
