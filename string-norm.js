function removePunctChars(str) {
  return str.replace(/[\.,;\-¡¿\?\!'"\(\)\[\]\{\}]/g, "");
}

function removeAccents(str) {
  // return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return str.replace(/á/g, "a").replace(/Á/g, "A")
    .replace(/é/g, "e").replace(/É/g, "E")
    .replace(/í/g, "i").replace(/Í/g, "I")
    .replace(/ó/g, "o").replace(/Ó/g, "O")
    .replace(/ú/g, "u").replace(/Ú/g, "U")
    .replace(/ü/g, "u");
}

function normString(str) {
  var r = str.trim().toLowerCase();
  r = removePunctChars(r);
  r = removeAccents(r);
  return r
}

function isWord(str) {
  // check if `str` are just characters.
  var r = str.trim().toLowerCase();
  r = removeAccents(r);
  return [...r].map(c => "abcdefghijklmnopqrstuvwxyz".includes(c)).every(t => t);
}
