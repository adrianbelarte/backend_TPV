⚙️ 1. Crear el modelo User
npx sequelize-cli model:generate --name User --attributes nombre:string,email:string,password:string,rol:string
🔐 Campos:

nombre: Nombre del usuario
email: Email de acceso
password: Hasheada con bcrypt
rol: 'admin' o 'vendedor'

🗃️ 2. Crear modelo Categoria
npx sequelize-cli model:generate --name Categoria --attributes nombre:string,imagen:string


🛒 3. Crear modelo Producto
npx sequelize-cli model:generate --name Producto --attributes nombre:string,precio:float,imagen:string,categoriaId:integer
Relación: Un producto pertenece a una categoría

🧩 NUEVO MODELO: ProductoExtra
npx sequelize-cli model:generate --name ProductoExtra --attributes productoId:integer,extraId:integer
Cada fila significa: "el producto productoId permite añadirse el producto extraId"

🎟️ 5. Crear modelo Ticket
npx sequelize-cli model:generate --name Ticket --attributes producto:string,cantidad:integer,fecha:date,hora:string,tipo_pago:string,total:float

📊 6. Crear modelo VentaTotal
npx sequelize-cli model:generate --name VentaTotal --attributes producto:string,cantidad:integer,total_targeta:float,total_efectivo:float,fecha:date,hora:string,total:float
