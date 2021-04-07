### SALES-REPORT

Proyecto de ejemplo que simula parte de la base de datos de un carro de compras y su
actividad durante un año.  
Para insertar datos se requiere de una base de datos MongoDB y correr todas las mutations
de GraphQL en el orden indicado en extras/mutations.  

GraphQL: localhost:3005/graphql  
Reporte: localhost:3005/api/reports/main  

Instalación:  
npm install  
sudo systemctl start mongod  
npm start  

Variables (por defecto):  
    PORT=3005  
    SALES=12000  
    YEAR=2020  
    HOST=localhost  
    CONNECT=mongodbsalesreport  

Reporte generado:  
    Total ingresos anuales  
    Total ventas  
    Total detalle de ventas  
    Total ítems vendidos  
    Productos únicos vendidos  
    Stock inicial  
    Stock final  
    Valorización total anual  
    Valorización de inventario  
    Ventas por mes y fluctuaciones  
    Ventas por ciudad  
    Ítems vendidos por categoría  
    Producto más vendido por mes  
    Producto más vendido en el año  
    Diferencia mayor en relación a stock inicial  
    Diferencia menor en relación a stock inicial  
    Producto con mayor precio  
    Producto con menor precio