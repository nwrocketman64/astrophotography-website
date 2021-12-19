// GET the 404 page.
exports.get404 = (req, res, next) => {
    res.status(404).render('404.html', {
      title: 'Page Not Found',
      path: '/home'
    });
  };
  
  // GET the 500 page.
  exports.get500 = (req, res, next) => {
    res.status(500).render('500.html', {
      title: 'Error has Occured',
      path: '/home'
    });
  };