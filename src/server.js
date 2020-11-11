const express = require("express")
const bodyParser = require('body-parser')
const producto = require("./routes/producto")
const pedidosCliente = require("./routes/pedidosCliente")
const pedidosProveedor = require("./routes/pedidosProveedor")
const ciclos = require("./routes/ciclos")
const balances = require("./routes/balances")
const cuotas = require("./routes/cuotas")

var cors = require('cors')
const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/alive', (req,res) => {
    res.send('<h1>Yes</h1>')
})

app.use("/productos", producto);
app.use("/pedidos/cliente", pedidosCliente);
app.use("/pedidos/proveedor", pedidosProveedor);
app.use("/ciclos", ciclos);
app.use("/balances", balances);
app.use("/cuotas", cuotas);

const PORT = 3001
app.listen(PORT, console.log(`Server started at http://localhost:${PORT}`));