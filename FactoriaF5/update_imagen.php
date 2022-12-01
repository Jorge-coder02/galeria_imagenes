<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: text/html; charset=utf-8');

// Creo un puntero de la conexión (ip, user, pass, bbdd)
$conexion = mysqli_connect("localhost", "root", "root", "factoriaf5") or 
	die("No se puede");

// Recojo datos de js
$datos = $_POST['cadena'];
$array = explode(',', $datos);
$id = $array[0];
$titulo_nuevo = $array[1];

// Consulto la información de la tabla imágenes (bbdd)
$consulta = mysqli_query($conexion, "UPDATE imagenes SET titulo='$titulo_nuevo' WHERE idImagen=$id") 
    or die ("Error: ".mysqli_error($conexion));

if (!$consulta) {
    echo ("Error en la consulta" . $consulta);
} 

mysqli_close($conexion);
?>