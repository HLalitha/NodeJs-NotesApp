// homepage
exports.homepage = async(req, res) => {
    const locals = {
        title: "NodeJs Notes ",
        description: 'Free NodeJs Notes App'
    };
   
    res.render('index', { locals });
}

// about page
exports.about = async(req, res) => {
    const locals = {
        title: "About - NodeJs Notes ",
        description: 'Free NodeJs Notes App'
    };
    
    res.render('about', locals);
}
