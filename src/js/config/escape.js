var escape = {

  encodeXML: function (string) {
    var encode = {
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;',
      '<': '&lt;',
      '>': '&gt;',
      ',': '&com;',
      '\\': '&bsol;',
      'á': '&aacute;',
      'Á': '&Aacute;',
      'à': '&agrave;',
      'À': '&Agrave;',
      'â': '&acirc;',
      'Â': '&Acirc;',
      'ä': '&auml;',
      'Ä': '&Auml;',
      'ã': '&atilde;',
      'Ã': '&Atilde;',
      'å': '&aring;',
      'Å': '&Aring;',
      'æ': '&aelig;',
      'Æ': '&AElig;',
      'ç': '&ccedil;',
      'Ç': '&Ccedil;',
      'é': '&eacute;',
      'É': '&Eacute;',
      'è': '&egrave;',
      'È': '&Egrave;',
      'ê': '&ecirc;',
      'Ê': '&Ecirc;',
      'ë': '&euml;',
      'Ë': '&Euml;',
      'í': '&iacute;',
      'Í': '&Iacute;',
      'ì': '&igrave;',
      'Ì': '&Igrave;',
      'î': '&icirc;',
      'Î': '&Icirc;',
      'ï': '&iuml;',
      'Ï': '&Iuml;',
      'ñ': '&ntilde;',
      'Ñ': '&Ntilde;',
      'ó': '&oacute;',
      'Ó': '&Oacute;',
      'ò': '&ograve;',
      'Ò': '&Ograve;',
      'ô': '&ocirc;',
      'Ô': '&Ocirc;',
      'ö': '&ouml;',
      'Ö': '&Ouml;',
      'õ': '&otilde;',
      'Õ': '&Otilde;',
      'ø': '&oslash;',
      'Ø': '&Oslash;',
      'œ': '&oelig;',
      'Œ': '&OElig;',
      'ß': '&szlig;',
      'ú': '&uacute;',
      'Ú': '&Uacute;',
      'ù': '&ugrave;',
      'Ù': '&Ugrave;',
      'û': '&ucirc;',
      'Û': '&Ucirc;',
      'ü': '&uuml;',
      'Ü': '&Uuml;'
    };

    // Encode special characters and accented characters
    return string.replace(/[&"'<>,\\áÁàÀâÂäÄãÃåÅæÆçÇéÉèÈêÊëËíÍìÌîÎïÏñÑóÓòÒôÔöÖõÕøØœŒßúÚùÙûÛüÜ]/g, function (char) {
      return encode[char];
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
        '&com;': ',',
        '&bsol;': '\\',
        '&aacute;': 'á',
        '&Aacute;': 'Á',
        '&agrave;': 'à',
        '&Agrave;': 'À',
        '&acirc;': 'â',
        '&Acirc;': 'Â',
        '&auml;': 'ä',
        '&Auml;': 'Ä',
        '&atilde;': 'ã',
        '&Atilde;': 'Ã',
        '&aring;': 'å',
        '&Aring;': 'Å',
        '&aelig;': 'æ',
        '&AElig;': 'Æ',
        '&ccedil;': 'ç',
        '&Ccedil;': 'Ç',
        '&eacute;': 'é',
        '&Eacute;': 'É',
        '&egrave;': 'è',
        '&Egrave;': 'È',
        '&ecirc;': 'ê',
        '&Ecirc;': 'Ê',
        '&euml;': 'ë',
        '&Euml;': 'Ë',
        '&iacute;': 'í',
        '&Iacute;': 'Í',
        '&igrave;': 'ì',
        '&Igrave;': 'Ì',
        '&icirc;': 'î',
        '&Icirc;': 'Î',
        '&iuml;': 'ï',
        '&Iuml;': 'Ï',
        '&ntilde;': 'ñ',
        '&Ntilde;': 'Ñ',
        '&oacute;': 'ó',
        '&Oacute;': 'Ó',
        '&ograve;': 'ò',
        '&Ograve;': 'Ò',
        '&ocirc;': 'ô',
        '&Ocirc;': 'Ô',
        '&ouml;': 'ö',
        '&Ouml;': 'Ö',
        '&otilde;': 'õ',
        '&Otilde;': 'Õ',
        '&oslash;': 'ø',
        '&Oslash;': 'Ø',
        '&oelig;': 'œ',
        '&OElig;': 'Œ',
        '&szlig;': 'ß',
        '&uacute;': 'ú',
        '&Uacute;': 'Ú',
        '&ugrave;': 'ù',
        '&Ugrave;': 'Ù',
        '&ucirc;': 'û',
        '&Ucirc;': 'Û',
        '&uuml;': 'ü',
        '&Uuml;': 'Ü'
      };

      // Remove double backslashes
      let str = string.replace(/\\\\/g, '\\');

      // Replace encoded entities
      return str.replace(
        /(&amp;|&quot;|&apos;|&lt;|&gt;|&com;|&bsol;|&aacute;|&Aacute;|&agrave;|&Agrave;|&acirc;|&Acirc;|&auml;|&Auml;|&atilde;|&Atilde;|&aring;|&Aring;|&aelig;|&AElig;|&ccedil;|&Ccedil;|&eacute;|&Eacute;|&egrave;|&Egrave;|&ecirc;|&Ecirc;|&euml;|&Euml;|&iacute;|&Iacute;|&igrave;|&Igrave;|&icirc;|&Icirc;|&iuml;|&Iuml;|&ntilde;|&Ntilde;|&oacute;|&Oacute;|&ograve;|&Ograve;|&ocirc;|&Ocirc;|&ouml;|&Ouml;|&otilde;|&Otilde;|&oslash;|&Oslash;|&oelig;|&OElig;|&szlig;|&uacute;|&Uacute;|&ugrave;|&Ugrave;|&ucirc;|&Ucirc;|&uuml;|&Uuml;)/g,
        function (item) {
          return decode[item];
        }
      );
    }


  }
}
export default escape;