import { TranslateEnumPipe } from '../pipes/translate-enum.pipe';

describe('TranslateEnumPipe', () => {
  it('create an instance', () => {
    const pipe = new TranslateEnumPipe();
    expect(pipe).toBeTruthy();
  });
});
