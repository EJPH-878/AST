// Esperamos a que el DOM cargue completamente antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    
    // Seleccionamos el formulario
    const loginForm = document.getElementById("loginForm");

    // Escuchamos el evento de envío del formulario
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que la página se recargue automáticamente

        // Obtenemos los valores ingresados por el usuario
        const usuario = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value.trim();

        // Validaciones según usuario y contraseña
        if (usuario === "Karen" && password === "123abc") {
            // Redirige a vista de estudiante
            window.location.href = "index-alumno.html";
        } 
        if (usuario === "Eddel" && password === "123abc") {
            // Redirige a vista de estudiante
            window.location.href = "index-alumno.html";
        } 
        if (usuario === "Ezequiel" && password === "12345abc") {
            // Redirige a vista de estudiante
            window.location.href = "index-alumno.html";
        } 
        else if (usuario === "Saul Campos" && password === "5587tb") {
            // Redirige a vista de docente
            window.location.href = "index-docente.html";
        } 
         else if (usuario === "Yadira Zamudio" && password === "5587tb") {
            // Redirige a vista de docente
            window.location.href = "index-docente.html";
        } 
         else if (usuario === "Nayeli Lopez Ponce" && password === "5587tb") {
            // Redirige a vista de docente
            window.location.href = "index-docente.html";
        } 
         else if (usuario === "Marco Antonio" && password === "5587tb") {
            // Redirige a vista de docente
            window.location.href = "index-docente.html";
        } 
        else if (usuario === "Lucero Manilla Muñoz" && password === "qw764") {
            // Redirige a vista de director
            window.location.href = "index-directivo.html";
        } 
         else if (usuario === "Maria Guadalupe" && password === "qw764") {
            // Redirige a vista de director
            window.location.href = "index-padre_familia.html";
        } 
         else if (usuario === "Sergio" && password === "qw764") {
            // Redirige a vista de director
            window.location.href = "index-padre_familia.html";
        } 
        else {
            // Si los datos no coinciden con ninguno, mostramos error
            alert("Usuario o contraseña incorrectos");
        }
    });
});