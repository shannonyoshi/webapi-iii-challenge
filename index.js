const server = require("./server");

const port = 5000


server.listen(port, ()=> {
    console.log(`\n**********Server Running on Port ${port}***********`)
})



