
// Instrucciones de munciipios y localidades

//const { response } = require("express");

// Capturar el evento de cambio del select de municipios
    document.getElementById('municipios_admin').addEventListener('change', function () {
    const municipioId = this.value; // Obtener el valor seleccionado (campo MUNICIPIO)
    console.log('Municipio seleccionado:', municipioId);

    // Enviar una solicitud para obtener las localidades correspondientes al municipio seleccionado
    fetch(`/localidades/${encodeURIComponent(municipioId)}`)
        .then(response => response.json())
        .then(localidades => {
            // Actualizar el select de localidades con las opciones recibidas
            const localidadSelect = document.getElementById('localidad_admin');
            localidadSelect.innerHTML = '';
            localidades.forEach(localidad => {
                const option = document.createElement('option');
                option.value = localidad.LOCALIDAD;
                option.textContent = localidad.LOCALIDAD;
                localidadSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al obtener las localidades:', error);
        });
});

document.getElementById('localidad_admin').addEventListener('change', function () {
const localidadId = this.value; // Obtener el valor seleccionado (campo MUNICIPIO)
console.log(localidadId);

// Enviar una solicitud para obtener las localidades correspondientes al municipio seleccionado
fetch(`/CP/${encodeURIComponent(localidadId)}`)
    .then(response => response.json())
    .then(data => {
        if (data && data.CP){

            console.log(data.CP);
            
            const cpSelect = document.getElementById('cp_admin');
            cpSelect.innerHTML = '';

            const option = document.createElement('option');
            option.value = data.CP;
            option.textContent = data.CP;
            cpSelect.appendChild(option);
        }else{
            console.error('Error: Codigo postal no encontrado en la respuesta del servidor');
        }
    })
    .catch(error => {
        console.error('Error al obtener el codigo postal:', error);
    });
});

document.getElementById('municipios_admin_act').addEventListener('change', function () {
    const municipioId = this.value; // Obtener el valor seleccionado (campo MUNICIPIO)
    console.log('Municipio seleccionado:', municipioId);

    // Enviar una solicitud para obtener las localidades correspondientes al municipio seleccionado
    fetch(`/localidades/${encodeURIComponent(municipioId)}`)
        .then(response => response.json())
        .then(localidades => {
            // Actualizar el select de localidades con las opciones recibidas
            const localidadSelect = document.getElementById('localidad_admin_act');
            localidadSelect.innerHTML = '';
            localidades.forEach(localidad => {
                const option = document.createElement('option');
                option.value = localidad.LOCALIDAD;
                option.textContent = localidad.LOCALIDAD;
                localidadSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al obtener las localidades:', error);
        });
});

document.getElementById('localidad_admin_act').addEventListener('change', function () {
const localidadId = this.value; // Obtener el valor seleccionado (campo MUNICIPIO)
console.log(localidadId);

// Enviar una solicitud para obtener las localidades correspondientes al municipio seleccionado
fetch(`/CP/${encodeURIComponent(localidadId)}`)
    .then(response => response.json())
    .then(data => {
        if (data && data.CP){

            console.log(data.CP);
            
            const cpSelect = document.getElementById('cp_admin_act');
            cpSelect.innerHTML = '';

            const option = document.createElement('option');
            option.value = data.CP;
            option.textContent = data.CP;
            cpSelect.appendChild(option);
        }else{
            console.error('Error: Codigo postal no encontrado en la respuesta del servidor');
        }
    })
    .catch(error => {
        console.error('Error al obtener el codigo postal:', error);
    });
});


// Instrucciones para el formulario multipasos de los administradores
const modal_admin = new bootstrap.Modal(document.getElementById('administradores'));


function onCancel() {
    // Reset wizard
    $('#smartwizard_admin').smartWizard("reset");

    // Reset form
    document.getElementById("form-admin-1").reset();
    document.getElementById("form-admin-2").reset();
    document.getElementById("form-admin-3").reset();
    window.location = "/admin";
}


function closeModal() {
    // Reset wizard
    $('#smartwizard_admin').smartWizard("reset");
    // Reset form
    document.getElementById("form-admin-1").reset();
    document.getElementById("form-admin-2").reset();
    document.getElementById("form-admin-3").reset();
    modal_admin.hide();
}
function registrarUsuario() {
    // Obtén los datos de todos los formularios utilizando jQuery
    const form1Data = $("#form-admin-1").serialize();
    const form2Data = $("#form-admin-2").serialize();
    const form3Data = new FormData($("#form-admin-3")[0]); // Utiliza FormData para incluir la fotografía

    // Combina los datos de todos los formularios en un solo objeto FormData
    const userData = new FormData();
    userData.append('nombre_admin', $("#nombre_admin").val());
    userData.append('ap_admin', $("#ap_admin").val());
    userData.append('am_admin', $("#am_admin").val());
    userData.append('Fecha_Nacimiento_admin', $("#Fecha_Nacimiento_admin").val());
    userData.append('telefono_admin', $("#telefono_admin").val());
    userData.append('CURP_admin', $("#CURP_admin").val());
    userData.append('municipios_admin', $("#municipios_admin").val());
    userData.append('cp_admin', $("#cp_admin").val());
    userData.append('localidad_admin', $("#localidad_admin").val());
    userData.append('colonia_admin', $("#colonia_admin").val());
    userData.append('calle_admin', $("#calle_admin").val());
    userData.append('NI_admin', $("#NI_admin").val());
    userData.append('NE_admin', $("#NE_admin").val());
    userData.append('correo_admin', $("#correo_admin").val());
    userData.append('pwd_admin', $("#pwd_admin").val());
    userData.append('privilegios', $("#privilegios").val());
    userData.append('foto_admin', $("#foto_admin")[0].files[0]); // Agrega la fotografía al FormData

    // Envía la solicitud Ajax para registrar el usuario
    $.ajax({
        url: "/registro", // La URL a la que enviarás la solicitud POST
        type: "POST",
        data: userData, // Utiliza el objeto FormData que contiene todos los datos, incluida la fotografía
        processData: false, // No proceses los datos
        contentType: false, // No configures automáticamente el tipo de contenido
        success: function (response) {
            // Si el registro fue exitoso, muestra una confirmación o redirige al usuario
            alert(response.message);
            window.location = "/admin";
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON && xhr.responseJSON.error) {
                alert(xhr.responseJSON.error); // Muestra el mensaje de error en una alerta
            } else {
                alert("Error al registrar el usuario. Inténtalo de nuevo.");
            }
        }
    });
}



$(function () {
    // Leave step event is used for validating the forms
    $("#smartwizard_admin").on("leaveStep", function (e, anchorObject, currentStepIdx, nextStepIdx, stepDirection) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 4;
        const progressPercentage = (nextStepIdx / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        // Validate only on forward movement
        if (stepDirection == 'forward') {
            let form = document.getElementById('form-admin-' + (currentStepIdx + 1));
            if (form) {
                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    $('#smartwizard_admin').smartWizard("setState", [currentStepIdx], 'error');
                    $("#smartwizard_admin").smartWizard('fixHeight');
                    return false;
                }
                $('#smartwizard_admin').smartWizard("unsetState", [currentStepIdx], 'error');
            }
        }
    });

    // Step show event
    $("#smartwizard_admin").on("showStep", function (e, anchorObject, stepIndex, stepDirection, stepPosition) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 4;
        const progressPercentage = (stepIndex / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        $("#prev-btn-admin").removeClass('disabled').prop('disabled', false);
        $("#next-btn-admin").removeClass('disabled').prop('disabled', false);
        if (stepPosition === 'first') {
            $("#prev-btn-admin").addClass('disabled').prop('disabled', true);
        } else if (stepPosition === 'last') {
            $("#next-btn-admin").addClass('disabled').prop('disabled', true);
        } else {
            $("#prev-btn-admin").removeClass('disabled').prop('disabled', false);
            $("#next-btn-admin").removeClass('disabled').prop('disabled', false);
        }


    });

    // Smart Wizard
    $('#smartwizard_admin').smartWizard({
        selected: 0,
        enableURLhash: false,
        // autoAdjustHeight: false,
        theme: 'dots', // basic, arrows, square, round, dots
        transition: {
            animation: 'zoom'
        },
        toolbar: {
            showNextButton: false, // show/hide a Next button
            showPreviousButton: false, // show/hide a Previous button
            position: 'bottom', // none/ top/ both bottom

        },
        anchor: {
            enableNavigation: true, // Enable/Disable anchor navigation
            enableNavigationAlways: false, // Activates all anchors clickable always
            enableDoneState: true, // Add done state on visited steps
            markPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
            unDoneOnBackNavigation: true, // While navigate back, done state will be cleared
            enableDoneStateNavigation: true // Enable/Disable the done state navigation
        },
    });
    $("#prev-btn-admin").on("click", function () {
        // Navigate previous
        $('#smartwizard_admin').smartWizard("prev");
        return true;
    });

    $("#next-btn-admin").on("click", function () {
        // Navigate next
        $('#smartwizard_admin').smartWizard("next");
        return true;
    });

    $("#state_selector").on("change", function () {
        $('#smartwizard_admin').smartWizard("setState", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

    $("#style_selector").on("change", function () {
        $('#smartwizard_admin').smartWizard("setStyle", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

});

// Funcion para cerrar la sesion automaticamente
function logoutAfterInactivity() {
    let timer;

    //Reinicia el temporizador cada vez que haya una interaccion del usuario
    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(logout, 500000); // NOta: 60000 milisegundos = 1 minuto
    }

    function logout() {
        axios.post('/logout')
            .then(response => {
                // Redirige a la pagina de inicio de sesion despues de cerrar sesion
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error al cerrar sesion:', error);
            });
    }

    // Reiniciar el temporizador cuando haya una interaccion del usuario
    document.addEventListener('click', resetTimer);
    document.addEventListener('keypress', resetTimer);
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('scroll', resetTimer);

    resetTimer();
}
// Llama a la funcion para cerrar la sesion automaticamente
logoutAfterInactivity();

function cargarUsuarios() {
    //Realizar la solicitud AJAX para obtener los usuarios
    fetch('/getUsuarios')
    .then((response)=> response.text())//Obtener el contenido de admin-reg.ejs como texto
    .then((html)=>{
        //Actualizar la seccion 'actualizable' con el contenido de admin-reg.ejs
        document.getElementById('actualizable').innerHTML = html;
        
        document.getElementById('actualizable').style.display = 'block';
        $('#tabla_admin').DataTable({
            "language": {
                "lengthMenu": "<p id='leg'>ORDEN</p>_MENU_",
                "zeroRecords": "Lo sentimos. No se encontraron registros que coincidan. <p align='center'></p>",
                "info": "PÁGINA _PAGE_ DE _PAGES_",
                "infoEmpty": "No hay registros aún.",
                "infoFiltered": "(Mostrando _TOTAL_ coincidencias de un total de _MAX_ registros)",
                "search": "<p id='leg'>CRITERIOS DE BÚSQUEDA</p>",
                "LoadingRecords": "Cargando...",
                "Processing": "Procesando...",
                "SearchPlaceholder": "Comience a teclear...",
                "paginate": {
                    "previous": "Anterior",
                    "next": "Siguiente"
                }
            },
           "pageLength": 4,
           "drawCallback": function (settings){
            const btnEliminarArray = document.querySelectorAll('.btn-eliminar')

                //Elimina los eventos anteriores para evitar duplicados
                btnEliminarArray.forEach((btnEliminar) => {
                btnEliminar.removeEventListener('click', eliminarUsuario)
            })
           }
        })

        function eliminarUsuario(event){
            event.preventDefault()

            const  userId = this.getAttribute('data-id');
            const usuarioEnSesionId = document.getElementById('usuarioEnSesion').getAttribute('data-id')


            if (userId === usuarioEnSesionId){
                alert("No puedes borrar tu propio registro");
                return
            }

            if(confirm('¿Estas seguro de que deseas eliminar este usuario?')){
                fetch(`/eliminar_admin/${userId}`, {
                    method: 'DELETE',
                })
                .then((response) =>{
                    if (!response.ok){
                        throw new Error('Error al eliminar el usuario');
                    }
                    return response.json();
                })
                .then((data) => {
                    alert(data.message);
                    cargarUsuarios()
                })
                .catch((error) => {
                    alert(error.message);
                })
            }
        }

        const btnEliminarArray = document.querySelectorAll('.btn-eliminar');
        btnEliminarArray.forEach((btnEliminar) => {
            btnEliminar.addEventListener('click', eliminarUsuario)
        })
    })
    .catch(error=> console.error('Error al cargar los usuarios:', error));
}

    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('btnCargarUsuarios').addEventListener('click', function () {
            cargarUsuarios()
        })
    })


//formulario de actualización
const modal_admin_act = new bootstrap.Modal(document.getElementById('administradores_act'));


function onCancel_act() {
    // Reset wizard
    $('#smartwizard_admin_act').smartWizard("reset");

    // Reset form
    document.getElementById("form-admin-act-1").reset();
    document.getElementById("form-admin-act-2").reset();
    document.getElementById("form-admin-act-3").reset();
    window.location = "/admin";
}


function closeModal_act() {
    // Reset wizard
    $('#smartwizard_admin_act').smartWizard("reset");
    // Reset form
    document.getElementById("form-admin-act-1").reset();
    document.getElementById("form-admin-act-2").reset();
    document.getElementById("form-admin-act-3").reset();
    modal_admin_act.hide();
}
function llenar_modal(usuarioId){
    const postData ={
        usuarioId
    };
    $.ajax({
        type: 'POST',
        url:'/postUsuarioById',
        data: { userId: usuarioId},
        success : function(response){
            try {
                modal_admin_act.show();
                llenarCamposModal(response)
                llenarLocalidades(response)

                //abrir el modal
                //$("#administradores_act").modal("show");
            } catch (error) {
                console.error('Error al procesar la respuesta:', error);
            }
        },
        error: function(error){
            console.log('Error al obtener los detalles del usuario:', error);
        }
    });
}

function llenarCamposModal(usuario){
    $('#usuarioId_act').val(usuario._id);
    $("#nombre_admin_act").val(usuario.Nombre_usuario);
    $("#ap_admin_act").val(usuario.Apellido_Paterno);
    $("#am_admin_act").val(usuario.Apellido_Materno);
    const fechaNacimiento = new Date(usuario.Fecha_Nacimiento);
    const FechaFormateada = fechaNacimiento.toISOString().split('T')[0];
    $("#Fecha_Nacimiento_admin_act").val(FechaFormateada);
    $("#correo_admin_act").val(usuario.Correo);
    $("#pwd_admin_act").val(usuario.Password);
    $("#telefono_admin_act").val(usuario.Telefono);
    $("#privilegios_act").val(usuario.Privilegios);
    $("#CURP_admin_act").val(usuario.CURP);
    
    const direccion = usuario.Direccion;
    if (direccion.Municipio && direccion.Localidad){
        $('#municipios_admin_act').val(direccion.Municipio).prop('disabled', false);
        llenarLocalidades(direccion.Municipio, direccion.Localidad, direccion.CP);
        $('#localidad_admin_act').val(usuario.Direccion.Localidad);
        $('#colonia_admin_act').val(direccion.Colonia);
        $('#calle_admin_act').val(direccion.Calle);
        $('#NI_admin_act').val(direccion.NI);
        $('#NE_admin_act').val(direccion.NE);

        $('#localidad_admin_act').trigger('change');
        $('#cp_admin_act').trigger('change');
    }

    $('#correo_admin_act').val(usuario.Correo)
    $('#pwd_admin_act').val(usuario.Password).prop('disabled', true);
    $('#privilegios_act').val(usuario.Privilegios);
    const rutaFoto = 'usuarios/' +usuario.Foto;
    $('#imagen_preview').attr('src', rutaFoto);
    $('#foto_admin_ac').val(usuario.Foto)
}

function llenarLocalidades(municipioId, localidadNombre){
    $.ajax({
        type: 'GET',
        url: `/localidades/${municipioId}`,
        success: function(localidades){
            const localidadSelect= $('#localidad_admin_act');
            localidadSelect.empty();

            localidades.forEach(localidad => {
                const option = new Option(localidad.LOCALIDAD, localidad.LOCALIDAD);
                if (localidad.LOCALIDAD === localidadNombre){
                    option.setAttribute('selected', 'selected');
                    obtenerCP(localidad.LOCALIDAD);
                }
                localidadSelect.append(option);
            });
        },
        error: function(error){
            console.log('Error al obtener las localidades:', error);
        }
    });
}

function obtenerCP(localidadId){
    $.ajax({
        type: 'GET',
        url: `/CP/${localidadId}`,
        success: function(cpResponse){
            const cpSelect = $('#cp_admin_act');
            cpSelect.empty();
            if (cpResponse && cpResponse.CP){
                const option = new Option(cpResponse.CP, cpResponse.CP);
                cpSelect.append(option);
            }
        },
        error: function(error){
            console.log('Error al obtener el CP:', error);
        }
    });
}

$('#foto_admin_act').on('change', function (){
    const selectedFile = this.files[0];
    if (selectedFile){
        const imagenURL = URL.createObjectURL(selectedFile);
        $('#imagen_preview').attr('src', imagenURL);
    }
});

$('#actualizar-btn-admin-act').on('click', function(){
    const foto = $('#foto_admin_act')[0].files[0];
    const id = $('#usuarioId_act').val()
    const nombre = $('#nombre_admin_act').val()
    const ap = $('#ap_admin_act').val()
    const am = $('#am_admin_act').val()
    const fechaNacimientoStr = $('#Fecha_Nacimiento_admin_act').val()
    const fechaNacimiento = new Date(fechaNacimientoStr);
    console.log(fechaNacimiento)
    const telefono = $('#telefono_admin_act').val()
    const curp = $('#CURP_admin_act').val()
    const municio = $('#municipios_admin_act').val()
    const cp = $('#cp_admin_act').val()
    const localidad = $('#localidad_admin_act').val()
    const colonia = $('#colonia_admin_act').val()
    const calle = $('#calle_admin_act').val()
    const ni = $('#NI_admin_act').val()
    const ne = $('#NE_admin_act').val()
    const correo = $('#correo_admin_act').val()
    const privilegios = $('#privilegios_act').val()

    const formData = new FormData();
    formData.append('usuarioId_act', id);
    formData.append('nombre_admin_act', nombre);
    formData.append('ap_admin_act', ap);
    formData.append('am_admin_act', am);
    formData.append('Fecha_Nacimiento_admin_act', fechaNacimiento);
    formData.append('telefono_admin_act', telefono);
    formData.append('CURP_admin_act', curp);
    formData.append('municipios_admin_act', municio);
    formData.append('cp_admin_act', cp);
    formData.append('localidad_admin_act', localidad);
    formData.append('colonia_admin_act', colonia);
    formData.append('calle_admin_act', calle);
    formData.append('NI_admin_act', ni);
    formData.append('NE_admin_act', ne);
    formData.append('correo_admin_act', correo);
    formData.append('privilegios_act', privilegios);

    if (foto){
        formData.append('foto_admin_act', foto);
    }

    $.ajax({
        type: 'POST',
        url: '/actualizarUsuario',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response){
            console.log('Usuario actualizado:', response);
            closeModal_act();
            cargarUsuarios();
        },
        error: function (error){
            console.log('Error al actualizar el usuario:', error);
        }
    });
});

$(function () {
    // Leave step event is used for validating the forms
    $("#smartwizard_admin_act").on("leaveStep", function (e, anchorObject, currentStepIdx, nextStepIdx, stepDirection) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 4;
        const progressPercentage = (nextStepIdx / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        // Validate only on forward movement
        if (stepDirection == 'forward') {
            let form = document.getElementById('form-admin-act-' + (currentStepIdx + 1));
            if (form) {
                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    $('#smartwizard_admin_act').smartWizard("setState", [currentStepIdx], 'error');
                    $("#smartwizard_admin_act").smartWizard('fixHeight');
                    return false;
                }
                $('#smartwizard_admin_act').smartWizard("unsetState", [currentStepIdx], 'error');
            }
        }
    });

    // Step show event
    $("#smartwizard_admin_act").on("showStep", function (e, anchorObject, stepIndex, stepDirection, stepPosition) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 4;
        const progressPercentage = (stepIndex / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        $("#prev-btn-admin-act").removeClass('disabled').prop('disabled', false);
        $("#next-btn-admin-act").removeClass('disabled').prop('disabled', false);
        if (stepPosition === 'first') {
            $("#prev-btn-admin-act").addClass('disabled').prop('disabled', true);
        } else if (stepPosition === 'last') {
            $("#next-btn-admin-act").addClass('disabled').prop('disabled', true);
        } else {
            $("#prev-btn-admin-act").removeClass('disabled').prop('disabled', false);
            $("#next-btn-admin-act").removeClass('disabled').prop('disabled', false);
        }


    });

    // Smart Wizard
    $('#smartwizard_admin_act').smartWizard({
        selected: 0,
        enableURLhash: false,
        // autoAdjustHeight: false,
        theme: 'dots', // basic, arrows, square, round, dots
        transition: {
            animation: 'zoom'
        },
        toolbar: {
            showNextButton: false, // show/hide a Next button
            showPreviousButton: false, // show/hide a Previous button
            position: 'bottom', // none/ top/ both bottom

        },
        anchor: {
            enableNavigation: true, // Enable/Disable anchor navigation
            enableNavigationAlways: false, // Activates all anchors clickable always
            enableDoneState: true, // Add done state on visited steps
            markPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
            unDoneOnBackNavigation: true, // While navigate back, done state will be cleared
            enableDoneStateNavigation: true // Enable/Disable the done state navigation
        },
    });
    $("#prev-btn-admin-act").on("click", function () {
        // Navigate previous
        $('#smartwizard_admin_act').smartWizard("prev");
        return true;
    });

    $("#next-btn-admin-act").on("click", function () {
        // Navigate next
        $('#smartwizard_admin_act').smartWizard("next");
        return true;
    });

    $("#state_selector").on("change", function () {
        $('#smartwizard_admin_act').smartWizard("setState", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

    $("#style_selector").on("change", function () {
        $('#smartwizard_admin_act').smartWizard("setStyle", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

});