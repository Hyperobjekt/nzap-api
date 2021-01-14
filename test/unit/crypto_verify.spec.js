const expect = require('chai').expect;
const cryptoVerify = require('../../_lib/crypto/verify');
const cryptoEncrypt = require('../../_lib/crypto/encrypt')

describe('Verify encruption Middleware', () => {

  it('should accept two argument', () => { expect(cryptoVerify.length).to.equal(2); });

  it('should reject non-string arguments', () => {
    expect(cryptoVerify(123456, 889232).toString()).to.equal('Error: Only accepts strings as arguments')
    expect(cryptoVerify(123456, "A string").toString()).to.equal('Error: Only accepts strings as arguments')
    expect(cryptoVerify("A string", 889232).toString()).to.equal('Error: Only accepts strings as arguments')
  })

  it('should expect a salted encrypted string', () => {
    expect(cryptoVerify("A string", "an unsalted string").toString()).to.equal('Error: Encrypted string must be salted')
  })

  it('should verify an encrypted string', () => {
    let secret = "thisisasecretpassword";
    let encryptedSecret = cryptoEncrypt(secret);
    expect(cryptoVerify(secret, encryptedSecret)).to.be.true;
  })

})
