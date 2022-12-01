<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: text/html; charset=utf-8');

// Creo un puntero de la conexión (ip, user, pass, bbdd)
$conexion = mysqli_connect("localhost", "root", "root", "factoriaf5") or 
	die("No se puede");

// Recojo datos de js
$datos = $_POST['cadena'];
$array = explode(',', $datos);
$titulo = $array[0];
$url = $array[1];

// Consulto la información de la tabla imágenes (bbdd)
$consulta = mysqli_query($conexion, "INSERT INTO imagenes VALUES (NULL, '$titulo', '$url')") 
    or die ("Error: ".mysqli_error($conexion));

$respuesta = "1";

if (!$consulta) {
    echo ("Error en la consulta" . $consulta);
} 
else {
    echo $respuesta;
}

mysqli_close($conexion);
?>