const process = require('process');
const path = require('path')
const fs = require('fs')
const textFile = path.join(__dirname, 'text.txt')
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>'
})
const exitText = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Thank you! have a nice day and see you soon!
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n`

fs.open(textFile, 'a', (err)=>{
    if(err) throw err
    console.log(`
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Hi! What do you want to write in your notebook?:
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`
    )
})

rl.on('line', (input) => {
    if(input === 'exit'){
        process.exit();
    }

    fs.appendFile(textFile, input + '\r\n', (err)=>{
        if(err) throw err
        console.log('<the data has been successfully added...>\n')
    })
});


// process.on('SIGINT', () => {
//     console.log('\nХорошего дня!\n');
//     process.exit();
//   });

  process.on('exit', () => {
    console.log(exitText);
    process.exit();
  });




