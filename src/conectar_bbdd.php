<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: text/html; charset=utf-8');

// Creo un puntero de la conexión (ip, user, pass, bbdd)
$conexion = mysqli_connect("localhost", "root", "root", "factoriaf5") or 
	die("No se puede");

// Consulto la información de la tabla imágenes (bbdd)
$consulta = mysqli_query($conexion, "SELECT * FROM imagenes") 
        or die ("Error: ".mysqli_error($conexion));

$respuesta = "";

if (!$consulta) {
    echo ("Error en la consulta" . $consulta);
} 
else {
    while ($valor = mysqli_fetch_array($consulta)){
		$id = $valor['idImagen'];
        $titulo = $valor['titulo'];
		$url = $valor['url'];	
		$respuesta .= $id . "," . $titulo . "," . $url . ";";
	}
    echo $respuesta;
}

mysqli_close($conexion);
?>