import ViewModel from 'register-component/register-component-viewModel';
import 'register-component/loader';
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
