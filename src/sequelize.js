const {Sequelize, DataTypes} = require("sequelize")
const BalanceModel = require("./models/Balance")
const CategoriaModel = require("./models/Categoria")
const CicloModel = require("./models/Ciclo")
const ClienteModel = require("./models/Cliente")
const CuotaModel = require("./models/Cuota")
const DetallePedidoModel = require("./models/DetallePedido")
const LineaModel = require("./models/Linea")
const PedidoModel = require("./models/Pedido")
const PedidoClienteModel = require("./models/PedidoCliente")
const PedidoProveedorModel = require("./models/PedidoProveedor")
const ProductoModel = require("./models/Producto")

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
});

//(async () => await sequelize.sync({alter:true}))();

const Balance = BalanceModel(sequelize,DataTypes);
const Categoria = CategoriaModel(sequelize,DataTypes);
const Ciclo = CicloModel(sequelize,DataTypes);
const Cliente = ClienteModel(sequelize,DataTypes);
const Cuota = CuotaModel(sequelize,DataTypes);
const DetallePedido = DetallePedidoModel(sequelize,DataTypes);
const Linea = LineaModel(sequelize,DataTypes);
const Pedido = PedidoModel(sequelize,DataTypes);
const PedidoCliente = PedidoClienteModel(sequelize,DataTypes);
const PedidoProveedor = PedidoProveedorModel(sequelize,DataTypes);
const Producto =  ProductoModel(sequelize,DataTypes);

//CATEGORIA LINEA

//one to many
//Categoria.hasMany(Producto)
//Producto.belongsTo(Categoria)

Pedido.DetallePedido = Pedido.hasMany(DetallePedido)
DetallePedido.belongsTo(Pedido)

PedidoCliente.hasMany(Cuota)
Cuota.belongsTo(PedidoCliente)

Cliente.hasMany(PedidoCliente)
PedidoCliente.Cliente = PedidoCliente.belongsTo(Cliente)

Ciclo.hasMany(Pedido)
Pedido.Ciclo = Pedido.belongsTo(Ciclo)

//one to one
Ciclo.hasOne(Balance)
Balance.Ciclo = Balance.belongsTo(Ciclo)

Producto.hasOne(DetallePedido)
DetallePedido.Producto = DetallePedido.belongsTo(Producto)

Pedido.hasOne(PedidoCliente)
PedidoCliente.Pedido = PedidoCliente.belongsTo(Pedido)

Pedido.hasOne(PedidoProveedor)
PedidoProveedor.Pedido = PedidoProveedor.belongsTo(Pedido)

module.exports = {
    Balance,
    Categoria,
    Cliente,
    Ciclo,
    Cuota,
    DetallePedido,
    Linea,
    Pedido,
    PedidoCliente,
    PedidoProveedor,
    Producto,
    sequelize,
}