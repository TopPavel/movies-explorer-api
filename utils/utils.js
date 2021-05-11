function isUrl(s) {
  const urlregex = new RegExp(
    '^(http://|https://|ftp://)[^а-я\\\'"<>]+?(\\.jpg|\\.jpeg|\\.gif|\\.png|/#)',
  );
  return urlregex.test(s);
}

module.exports = {
  isUrlToImage: isUrl,
};
