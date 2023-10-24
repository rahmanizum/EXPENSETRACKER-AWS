
exports.gethomePage = (request, response, next) => {
    response.sendFile('home.html', { root: 'views' });
}
exports.geterrorPage = (request,response,next) =>{
    response.sendFile('notFound.html',{root:'views'});
}

