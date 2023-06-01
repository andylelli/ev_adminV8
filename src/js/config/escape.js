var escape = {

    encodeXML: function (string) {
      var encode = {
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
        '<': '&lt;',
        '>': '&gt;',
        '\\': '&bsol;',
        ',': '&com;', 
      };
      return string.replaceAll(/([\&"'<>\\,])/g, function (str, item) {
        return encode[item];
      });
  
    },
    decodeXML: function (string) {
      if (string) {
        var decode = {
          '&amp;': '&',
          '&quot;': '"',
          '&apos;': "'",
          '&lt;': '<',
          '&gt;': '>',
          '&bsol;': '\\',
          '&com;': ',',
        };
        let str = string.replaceAll(/\\\\/g, '\\');
        return str.replaceAll(/(&amp;|&quot;|&apos;|&lt;|&gt;|&bsol;|&com;)/g,
          function (item) {
            return decode[item];
          });
      }
    }
  }
  export default escape;