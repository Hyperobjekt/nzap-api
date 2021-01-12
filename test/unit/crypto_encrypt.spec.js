const expect = require('chai').expect;
const cryptoEncrypt = require('../../_lib/crypto/encrypt')

describe('Encrypt string Middleware', () => {

  it('should accept one argument', () => { expect(cryptoEncrypt.length).to.equal(1); });

  it('should reject non-string arguments', () => {
    const encryptedVal = cryptoEncrypt(123456);
    expect(encryptedVal.toString()).to.equal('Error: Only accepts strings as arguments')
  })

  it('should return a string not equal to the argument', () => {
    let str = "secret";
    const encryptedVal = cryptoEncrypt(str);
    expect(encryptedVal).to.not.equal(str)
  })

})
