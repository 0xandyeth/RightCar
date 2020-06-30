import { Crypt, RSA } from 'hybrid-crypto-js';

var crypt = new Crypt();
var rsa = new RSA();

// Increase amount of entropy
var entropy = 'Random string, integer or float';
var crypt = new Crypt({ entropy: entropy });
var rsa = new RSA({ entropy: entropy });

// Select default message digest
var crypt = new Crypt({ md: 'sha512' });

export function encrypt(message: Object) {
    // Encryption with one public RSA key
    var encrypted = crypt.encrypt(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCw/7mJzszlPo3TY4x4Lz5FSCpX
Cr8jkdkceaZnspBU3/LtpLTooCXJ2iTL3wtjFYtEU9HFZFDiVU/JDcyMMH0imroD
V2rAhGpcKTv7bGsjklfNnE0sMJxXFzd0C1NhqrwxJxjSlcPGaG4y0Jyyej67I+J7
UABUVoiLxw+86WqfqwIDAQAB
-----END PUBLIC KEY-----`, JSON.stringify(message));

return encrypted
}

export function decrypt(encrypted: Object) {
    // Decrypt encryped message with private RSA key
    var decrypted = crypt.decrypt(`-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCw/7mJzszlPo3TY4x4Lz5FSCpXCr8jkdkceaZnspBU3/LtpLTo
oCXJ2iTL3wtjFYtEU9HFZFDiVU/JDcyMMH0imroDV2rAhGpcKTv7bGsjklfNnE0s
MJxXFzd0C1NhqrwxJxjSlcPGaG4y0Jyyej67I+J7UABUVoiLxw+86WqfqwIDAQAB
AoGAdAhAxpG2irY2XZTOGl/GL77+Wq9l3FiZfuxU5XgO3EUvyRCHtFSAUVJbevcO
TPdro/Ba/U8lIysQMdqE9IY5EWV/yGiqfFOvTbd8Zw98T2zdONLluErnrztGVCb0
DYBVfHAx302qNuasWoYkOfP3iaU2dJHFtMRCqlCT7qe9hgkCQQDljvqKYQqTdJmn
eizZZFNhMU0IkhfqijK9OXx3WyHfbQmVWP/32857/Az+PYkTaNWjD2eJvx2TFu0R
qP3/oosVAkEAxWLqMd7I7irogx1q2gJnhyKklxmhHqeed7dcZWbkW17nkFRNcEWf
Yp2aTcUqrPo494+uPoWUcevjJ11GsCwvvwJAFAO9UGdZlrWp1/JNCr82jdjQkJi8
QRS/i8QBWB63+1T0avMRjji57hFxyJDw7KJNTiQ/sMDbAUIUdV+4lZtEaQJAF8dF
vUJAZGio3/qwP5kgjaf/ufAtd7rrnTJqoBCYG+W/8aQmPAs3GzMvPoUtEe+G41Pc
ws1mx56KG9jhxiFckwJBANVRl7tDftHRAbj0GQNiFNpDBy4xsdez7T6JmKGr+ALg
DvMOJMpj2+B6Fevy7AQq0Ee9OZvy68w5mpCrMwzx+rg=
-----END RSA PRIVATE KEY-----`, JSON.stringify(encrypted));
return decrypted.message
}