window.onload = function() {
    iniciar();
}

const iniciar = () => {
    conectar_bbdd();
}

// Variables
let album = document.getElementById('album');           // recoge el div que contiene las imágenes
let cont = 0;                                           // para crear un id distinto por cada input (casillas) / no usado
let img_editar = '';                                    // recogerá el id del contenedor de la imagen a editar

// Consultar imágenes con la bbdd
function inicializa_xhr() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}
function conectar_bbdd(){
    peticion_http = inicializa_xhr();
    peticion_http.onreadystatechange = obtener_info_imagenes;
    peticion_http.open("POST", "./conectar_bbdd.php", true);
    peticion_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    peticion_http.send();
}
function obtener_info_imagenes(){
    if(peticion_http.readyState == 4){
        if(peticion_http.status == 200){
            let cadena_respuesta = peticion_http.responseText;
            let imagenes = cadena_respuesta.split(';');
            for (let i = 0; i < imagenes.length-1; i++) {
                let info_imagenes = imagenes[i].split(',');
                const imagen = {
                    id: info_imagenes[0],
                    titulo: info_imagenes[1],
                    url: info_imagenes[2]
                }
                mostrar_imagenes(imagen);
            }
        }
    }
    // Eventos
    document.getElementById('eliminar').addEventListener('click', recoger_inputs_eliminar, true);
    document.getElementById('anadir').addEventListener('click', mostrar_url, true);
    document.getElementById('editar').addEventListener('click', recoger_input_editar, true);
}

// Crear dinámicamente un div (título, imagen, input check) por cada imagen de la bbdd
const mostrar_imagenes = (imagen) => {
    // Div contenedor
    let contenedor = document.createElement('div');
    contenedor.className = 'contenedor_imagen';
    contenedor.id = imagen.id;
    album.appendChild(contenedor);
    // Span título
    let div_span = document.createElement('div');
    div_span.id = 'div_span';
    let titulo = document.createElement('span');
    titulo.textContent = imagen.titulo;
    div_span.appendChild(titulo);
    contenedor.appendChild(div_span);
    // Img url
    let url = document.createElement('img');
    url.src = imagen.url;
    url.alt = 'altern';
    contenedor.appendChild(url);
    // Input check
    let input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.id = cont;
    input.className = 'casilla';
    contenedor.appendChild(input);
    cont++;
}

// ELIMINAR IMAGEN/ES
// Recoger inputs
const recoger_inputs_eliminar = () => {
    let array_borrar = [];
    let inputs = album.getElementsByTagName('input');
    // Recoger id del padre
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked){
            let id_imagen = inputs[i].parentNode.id;
            array_borrar.push(id_imagen);
        }
    }
    eliminar_interfaz(array_borrar);
    eliminar_imagenes_bbdd(array_borrar);
}
function inicializa_xhr2() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}
function eliminar_imagenes_bbdd(array){
    let cadena_ids = '';
    for (let i = 0; i < array.length; i++) {
        cadena_ids += array[i] + ',';
    }
    cadena_ids = cadena_ids.substring(0,cadena_ids.length-1);
    peticion_http = inicializa_xhr2();
    peticion_http.onreadystatechange = mensaje_eliminar;
    peticion_http.open("POST", "./eliminar_imagenes.php", true);
    peticion_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let datos = "cadena_ids=" + encodeURIComponent(cadena_ids) + "&nocache=";
    peticion_http.send(datos);
    console.log(datos);
}
function mensaje_eliminar(){
    if(peticion_http.readyState == 4){
        if(peticion_http.status == 200){
            // Mensaje confirmacíon
            let respuesta = peticion_http.responseText;
        }
    }
}
const eliminar_interfaz = (array_borrar) => {
    // Eliminar visualmente
    for (let i = 0; i < array_borrar.length; i++) {
        let div = document.getElementById(array_borrar[i]);
        div.style = 'display: none';
    }
    array_borrar = [];
}

// Mostrar formulario de 'Añadir imagen'
const mostrar_url = () => {
    let div_url = document.getElementById('div_input');
    div_url.style = 'display: flex';                        // mostrar el div oculto para introducir info imagen

    // EVENTOS
    document.getElementById('aceptar').addEventListener('click', anadir_imagen, true);
}

// AÑADIR IMAGEN
function inicializa_xhr2() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}
function anadir_imagen(){
    // Recojo datos nueva imagen
    let titulo = document.getElementById('titulo').value;
    let url = document.getElementById('url').value;
    let cadena = titulo + ',' + url;
    // Conexión php
    peticion_http = inicializa_xhr2();
    peticion_http.onreadystatechange = recargar_pagina;
    peticion_http.open("POST", "./anadir_imagen.php", true);
    peticion_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let datos = "cadena=" + encodeURIComponent(cadena) + "&nocache=";
    peticion_http.send(datos);
}
function recargar_pagina(){
    if(peticion_http.readyState == 4){
        if(peticion_http.status == 200){
            location.reload();                          // refrescar la página
        }
    }
}

// EDITAR IMAGEN
function inicializa_xhr2() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}
const recoger_input_editar = () => {
    let inputs = album.getElementsByTagName('input');
    // Recorrer inputs y recoger id del padre
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked){
            img_editar = inputs[i].parentNode.id;
            document.getElementById('confirmar_editar').style = 'display: flex';
            break;                                                                  // en cuanto encuentro un input marcado, paro de buscar
        }
    }
    // Ocultar título actual y añadir input
    let contenedor = document.getElementById(img_editar);
    let div_span = contenedor.firstElementChild;
    let span = div_span.getElementsByTagName('span');
    let valor = span[0].textContent;                                // recoger valor actual del span (título)
    span[0].style = 'display: none';                                // ocultar span
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('value', valor);                             // introducir en el input text el título actual de la imagen
    input.setAttribute('class', 'input_cambiar');
    input.setAttribute('id', 'input_editar');
    div_span.appendChild(input);
    // Evento
    document.getElementById('confirmar').addEventListener('click', editar_imagen, true);
}

function editar_imagen(){
    // Recojo datos id y nuevo título
    let id = img_editar;
    let titulo = document.getElementById('input_editar').value;
    let cadena = id + ',' + titulo;
    // Conexión php
    peticion_http = inicializa_xhr2();
    peticion_http.onreadystatechange = refrescar_pagina;
    peticion_http.open("POST", "./update_imagen.php", true);
    peticion_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let datos = "cadena=" + encodeURIComponent(cadena) + "&nocache=";
    console.log(datos);
    peticion_http.send(datos);
}
function refrescar_pagina(){
    if(peticion_http.readyState == 4){
        if(peticion_http.status == 200){
            img_editar = '';                    // reseteo la variable que contiene el id a editar
            location.reload();                  // refrescar la página
        }
    }
}
