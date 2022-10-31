const path = require('path')
const fs = require('fs')
const folder = path.join(__dirname, 'secret-folder')
const pathFilesArray = []

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
    if(err) throw err;
    const fileData = files.filter(elem => elem.isFile())
    fileData.forEach( async (elem) => {
        const pathFile = path.join(folder, elem.name)
        pathFilesArray.push(pathFile)
   })

    pathFilesArray.forEach((element) =>{
        fs.stat(element, (err, stats) => {
            if(err) throw err;
            let basename = (path.basename(element)).replace('.', ' - ')
            console.log(basename + ' - ' + stats.size + 'b')
        })
    })    
})

