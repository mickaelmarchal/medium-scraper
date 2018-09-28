var request = require('request');
var cheerio = require('cheerio');
var Promise = require('promise');

function getPosts(medium) {
  return new Promise(function (resolve, reject) {
    request(`https://medium.com/${medium.user}/latest`, function (error, response, html) {
      if (error) reject(error);
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var posts = [];
        $('.streamItem--postPreview').each(function(index, article) {
          var image = $(article).find('.graf-image').first().data('image-id');
          posts[index] = {
            title: $(article).find('.graf--leading').text(),
            excerpt: $(article).find('.graf--trailing').text(),            
            time: $(article).find('time').text(),
            timeISO: $(article).find('time').attr('datetime'),
            image: image ? `https://cdn-images-1.medium.com/max/900/${image}` : null,
            url: $(article).find('.postArticle-readMore').find('a').attr('href').split('?')[0]
          }
        })
        posts.success = true;

        resolve(posts);
      }
    });
  });
}

module.exports = {getPosts};