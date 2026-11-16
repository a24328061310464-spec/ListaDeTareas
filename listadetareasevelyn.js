const tareasIniciales = [
    "Escribir los apuntes de matemáticas",
    "Terminar las actividades",
    "Hacer el podcast",
    "Repasar los apuntes",
    "Estudiar para el examen",
    "Organizar mi escritorio",
    "Leer un poco",
    "Preparar mis materiales",
    "Revisar mis pendientes",
    "Tomarme un descanso"
];

let tareas = JSON.parse(localStorage.getItem("misTareas")) ||
    tareasIniciales.map((texto, id) => ({
        id, texto, completada: false
    }));

let filtroActual = "todas";
const lista = document.getElementById("listaTareas");

// MOSTRAR TAREAS
function mostrarTareas() {
    lista.innerHTML = "";

    const filtradas = tareas.filter(t => {
        if (filtroActual === "pendientes") return !t.completada;
        if (filtroActual === "completadas") return t.completada;
        return true;
    });

    filtradas.forEach(tarea => {
        const li = document.createElement("li");
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        const texto = document.createElement("span");
        const eliminar = document.createElement("button");

        li.className = tarea.completada ? "completada" : "";
        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;
        texto.textContent = tarea.texto;

        checkbox.addEventListener("change", () => {
            tarea.completada = checkbox.checked;
            guardarTareas();
        });

        label.append(checkbox, texto);

        eliminar.className = "eliminar";
        eliminar.textContent = "🗑";
        eliminar.title = "Eliminar tarea";

        eliminar.addEventListener("click", () => {
            tareas = tareas.filter(t => t.id !== tarea.id);
            guardarTareas();
        });

        li.append(label, eliminar);
        lista.appendChild(li);
    });

    actualizarProgreso();
}

// GUARDAR TAREAS
function guardarTareas() {
    localStorage.setItem("misTareas", JSON.stringify(tareas));
    mostrarTareas();
}

// ACTUALIZAR ESTADÍSTICAS
function actualizarProgreso() {
    const total = tareas.length;
    const hechas = tareas.filter(t => t.completada).length;
    const porcentaje = total ? Math.round(hechas / total * 100) : 0;

    document.getElementById("total").textContent = hechas + "/" + total;
    document.getElementById("completadas").textContent = hechas;
    document.getElementById("porcentaje").textContent = porcentaje + "%";
    document.getElementById("progresoNumero").textContent = porcentaje + "%";
    document.getElementById("resumen").textContent =
        hechas + " of " + total + " tasks completed";

    document.getElementById("circulo").style.background =
        `conic-gradient(#8650c5 ${porcentaje}%, #d8baf1 ${porcentaje}%)`;
}

// AGREGAR TAREA
document.getElementById("agregar").addEventListener("click", () => {
    const texto = prompt("Escribe tu nueva tarea:");

    if (texto && texto.trim()) {
        tareas.push({
            id: Date.now(),
            texto: texto.trim(),
            completada: false
        });

        filtroActual = "todas";

        document.querySelectorAll(".filtros button").forEach(b => {
            b.classList.toggle("activo", b.dataset.filtro === "todas");
        });

        guardarTareas();
    }
});

// FILTROS
document.querySelectorAll(".filtros button").forEach(boton => {
    boton.addEventListener("click", () => {
        filtroActual = boton.dataset.filtro;

        document.querySelectorAll(".filtros button").forEach(b => {
            b.classList.toggle("activo", b === boton);
        });

        mostrarTareas();
    });
});

// CALENDARIO
const nombresMeses = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

let fecha = new Date();
let mes = fecha.getMonth();
let anio = fecha.getFullYear();

function mostrarCalendario() {
    const numeros = document.getElementById("numeros");
    numeros.innerHTML = "";

    document.getElementById("mesAnio").textContent =
        nombresMeses[mes] + " " + anio;

    const primerDia = new Date(anio, mes, 1).getDay();
    const diasMes = new Date(anio, mes + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) {
        numeros.appendChild(document.createElement("span"));
    }

    for (let dia = 1; dia <= diasMes; dia++) {
        const boton = document.createElement("button");
        boton.textContent = dia;

        if (
            dia === fecha.getDate() &&
            mes === fecha.getMonth() &&
            anio === fecha.getFullYear()
        ) {
            boton.classList.add("hoy");
        }

        boton.addEventListener("click", () => {
            document.querySelectorAll(".numeros button").forEach(b => {
                b.classList.remove("seleccionado");
            });

            boton.classList.add("seleccionado");
        });

        numeros.appendChild(boton);
    }
}

document.getElementById("anterior").addEventListener("click", () => {
    mes--;
    if (mes < 0) {
        mes = 11;
        anio--;
    }
    mostrarCalendario();
});

document.getElementById("siguiente").addEventListener("click", () => {
    mes++;
    if (mes > 11) {
        mes = 0;
        anio++;
    }
    mostrarCalendario();
});

// INICIAR
mostrarTareas();
mostrarCalendario();