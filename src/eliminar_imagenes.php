<?php
header('Content-Type: text/html;charset=ISO-8859-1');
header("Access-Control-Allow-Origin: *");

// Recojo el/los valores de los ids seleccionados
$cadena_ids = $_POST['cadena_ids'];
$array_ids = explode(',', $cadena_ids);
$mensaje = 'bien';
// Creo un puntero de la conexión (ip, user, pass, bbdd)
$conexion = mysqli_connect("localhost", "root", "root", "factoriaf5") or 
    die("No se puede");

for ($i=0; $i<$array_ids; $i++) { 
    $consulta=mysqli_query(
        $conexion,          
        "DELETE FROM imagenes WHERE idImagen LIKE $array_ids[$i]") 
            or die ("Error: ".mysqli_error($conexion));
}

mysqli_close($conexion);

?>