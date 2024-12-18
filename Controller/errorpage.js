const path=require('path');

exports.errorpage = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views' , 'error.html'));
}