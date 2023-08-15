
// Instrucciones de munciipios y localidades
// Capturar el evento de cambio del select de municipios
document.getElementById('municipios_alumno').addEventListener('change', function () {
    const municipioId = this.value; // Obtener el valor seleccionado (campo MUNICIPIO)
    console.log('Municipio seleccionado:', municipioId);

    // Enviar una solicitud para obtener las localidades correspondientes al municipio seleccionado
    fetch(`/localidades/${encodeURIComponent(municipioId)}`)
        .then(response => response.json())
        .then(localidades => {
            // Actualizar el select de localidades con las opciones recibidas
            const localidadSelect = document.getElementById('localidad_alumno');
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

document.getElementById('localidad_alumno').addEventListener('change', function () {
const localidadId = this.value; // Obtener el valor seleccionado (campo MUNICIPIO)
console.log(localidadId);

// Enviar una solicitud para obtener las localidades correspondientes al municipio seleccionado
fetch(`/CP/${encodeURIComponent(localidadId)}`)
    .then(response => response.json())
    .then(data => {
        if (data && data.CP){

            console.log(data.CP);
            
            const cpSelect = document.getElementById('cp_alumno');
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
const modal_alumno = new bootstrap.Modal(document.getElementById('alumnos'));


function onCancel() {
    // Reset wizard
    $('#smartwizard_alumno').smartWizard("reset");

    // Reset form
    document.getElementById("form-alumno-1").reset();
    document.getElementById("form-alumno-2").reset();
    document.getElementById("form-alumno-3").reset();
    document.getElementById("form-alumno-4").reset();
    window.location = "/admin";
}


function closeModal() {
    // Reset wizard
    $('#smartwizard_alumno').smartWizard("reset");
    // Reset form
    document.getElementById("form-alumno-1").reset();
    document.getElementById("form-alumno-2").reset();
    document.getElementById("form-alumno-3").reset();
    document.getElementById("form-alumno-4").reset();
    modal_alumno.hide();
}
function registrarAlumno() {
    // Obtén los datos de todos los formularios utilizando jQuery
    alert('hola');
    const form1Data = $("#form-alumno-1").serialize();
    const form2Data = $("#form-alumno-2").serialize();
    const form3Data = new FormData($("#form-alumno-3")[0]); // Utiliza FormData para incluir la fotografía
    const form4Data = new FormData($("#form-alumno-4")[1]);

    // Combina los datos de todos los formularios en un solo objeto FormData
    const userData = new FormData();
    userData.append('nombre_alumno', $("#nombre_alumno").val());
    userData.append('ap_alumno', $("#ap_alumno").val());
    userData.append('am_alumno', $("#am_alumno").val());
    userData.append('Fecha_Nacimiento_alumno', $("#Fecha_Nacimiento_alumno").val());
    userData.append('telefono_alumno', $("#telefono_alumno").val());
    userData.append('CURP_alumno', $("#CURP_alumno").val());
    userData.append('municipios_alumno', $("#municipios_alumno").val());
    userData.append('cp_alumno', $("#cp_alumno").val());
    userData.append('localidad_alumno', $("#localidad_alumno").val());
    userData.append('colonia_alumno', $("#colonia_alumno").val());
    userData.append('calle_alumno', $("#calle_alumno").val());
    userData.append('NI_alumno', $("#NI_alumno").val());
    userData.append('NE_alumno', $("#NE_alumno").val());
    userData.append('correo_alumno', $("#correo_alumno").val());
    userData.append('pwd_alumno', $("#pwd_alumno").val());
    userData.append('privilegios', $("#privilegios").val());
    userData.append('foto_alumno', $("#foto_alumno")[0].files[0]); // Agrega la fotografía al FormData
    userData.append('curp_alumno', $("#curp_alumno")[0].files[0]);
    userData.append('acta_alumno', $("#acta_alumno")[0].files[0]);
    userData.append('solicitud_alumno', $("#solicitud_alumno")[0].files[0]);
    userData.append('historial_alumno', $("#historial_alumno")[0].files[0]);

    // Envía la solicitud Ajax para registrar el usuario
    $.ajax({
        url: "/registroAlumno", // La URL a la que enviarás la solicitud POST
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
    $("#smartwizard_alumno").on("leaveStep", function (e, anchorObject, currentStepIdx, nextStepIdx, stepDirection) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 4;
        const progressPercentage = (nextStepIdx / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        // Validate only on forward movement
        if (stepDirection == 'forward') {
            let form = document.getElementById('form-alumno-' + (currentStepIdx + 1));
            if (form) {
                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    $('#smartwizard_alumno').smartWizard("setState", [currentStepIdx], 'error');
                    $("#smartwizard_alumno").smartWizard('fixHeight');
                    return false;
                }
                $('#smartwizard_alumno').smartWizard("unsetState", [currentStepIdx], 'error');
            }
        }
    });

    // Step show event
    $("#smartwizard_alumno").on("showStep", function (e, anchorObject, stepIndex, stepDirection, stepPosition) {
        // Calcular el porcentaje de progreso (paso actual dividido por el total de pasos)
        const totalSteps = 4;
        const progressPercentage = (stepIndex / (totalSteps - 1)) * 100;

        // Actualizar el estilo de la barra de progreso con el porcentaje calculado
        $("#progress-bar").css("width", progressPercentage + "%");
        $("#prev-btn-alumno").removeClass('disabled').prop('disabled', false);
        $("#next-btn-alumno").removeClass('disabled').prop('disabled', false);
        if (stepPosition === 'first') {
            $("#prev-btn-alumno").addClass('disabled').prop('disabled', true);
        } else if (stepPosition === 'last') {
            $("#next-btn-alumno").addClass('disabled').prop('disabled', true);
        } else {
            $("#prev-btn-alumno").removeClass('disabled').prop('disabled', false);
            $("#next-btn-alumno").removeClass('disabled').prop('disabled', false);
        }


    });

    // Smart Wizard
    $('#smartwizard_alumno').smartWizard({
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
    $("#prev-btn-alumno").on("click", function () {
        // Navigate previous
        $('#smartwizard_alumno').smartWizard("prev");
        return true;
    });

    $("#next-btn-alumno").on("click", function () {
        // Navigate next
        $('#smartwizard_alumno').smartWizard("next");
        return true;
    });

    $("#state_selector").on("change", function () {
        $('#smartwizard_alumno').smartWizard("setState", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

    $("#style_selector").on("change", function () {
        $('#smartwizard_alumno').smartWizard("setStyle", [$('#step_to_style').val()], $(this).val(), !$('#is_reset').prop("checked"));
        return true;
    });

});
