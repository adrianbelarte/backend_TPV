⚙️ 1. Crear el modelo User
npx sequelize-cli model:generate --name User --attributes nombre:string,email:string,password:string,rol:string
🔐 Campos:

nombre: Nombre del usuario
email: Email de acceso
password: Hasheada con bcrypt
rol: 'admin' o 'vendedor'

📦 Producto
Producto individual que se puede vender.
id, nombre, precio, imagen, categoriaId
Relación muchos a muchos con otros productos como extras 
(ya lo tienes implementado como ProductoExtra)


🛒 3. Crear modelo Producto
npx sequelize-cli model:generate --name Producto --attributes nombre:string,precio:float,imagen:string,categoriaId:integer
Relación: Un producto pertenece a una categoría

🧩 NUEVO MODELO: ProductoExtra
npx sequelize-cli model:generate --name ProductoExtra --attributes productoId:integer,extraId:integer
Cada fila significa: "el producto productoId permite añadirse el producto extraId"

🧾 Ticket
Representa una venta en curso o finalizada, con una lista de productos.
🔧 Lo que debe tener:
id, fecha, hora, tipo_pago, total
Nueva relación: Muchos a muchos con Producto, usando una tabla intermedia: TicketProducto

Tabla intermedia TicketProducto:
npx sequelize-cli model:generate --name TicketProducto --attributes ticketId:integer,productoId:integer,cantidad:integer

Tendrá:
ticketId, productoId, cantidad

📊 VentaTotal
Es como un resumen diario o histórico de todos los productos vendidos agrupados.

Campos:
producto, cantidad, total_targeta, total_efectivo, total, fecha, hora
npx sequelize-cli model:generate --name VentaTotal --attributes fecha:date,total_tarjeta:float,total_efectivo:float,total_general:float


Esto parece una tabla agregada (tipo report). 
No requiere relaciones directas, ya que normalmente se genera a partir de Ticket + TicketProducto.