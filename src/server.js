const express = require("express")
const bodyParser = require('body-parser')
const producto = require("./routes/producto")
const pedidos = require("./routes/pedidos")
const ciclos = require("./routes/ciclos")

var cors = require('cors')
const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/alive', (req,res) => {
    res.send('<h1>Yes</h1>')
})

app.use("/productos", producto);
app.use("/pedidos", pedidos);
app.use("/ciclos", ciclos);

const PORT = 3001
app.listen(PORT, console.log(`Server started at http://localhost:${PORT}`));