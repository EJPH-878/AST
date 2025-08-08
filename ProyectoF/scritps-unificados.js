// Scripts unificados para todas las vistas
class AsisTechApp {
    constructor() {
        this.currentRole = '';
        this.studentData = {
            nombre: '',
            carrera: '',
            matricula: ''
        };
        this.isDataLoaded = false;
        this.init();
    }

    init() {
        // Detectar qué vista está activa y ejecutar la lógica correspondiente
        if (document.getElementById('screen1')) {
            this.initRoleSelection();
        }
        if (document.getElementById('screen2')) {
            this.initRegistration();
        }
        if (document.querySelector('.docente-container') && document.getElementById('carrera')) {
            this.initDocenteView();
        }
        if (document.querySelector('.alumno-container')) {
            this.initAlumnoView();
        }
        if (document.getElementById('hijo-select')) {
            this.initPadresView();
        }
        if (document.getElementById('reporte-tipo')) {
            this.initDirectivoView();
        }
    }

    // LÓGICA PARA SELECCIÓN DE ROL
    initRoleSelection() {
        const roleButtons = document.querySelectorAll('.role-button');
        const nextButton = document.querySelector('.next-button');

        roleButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remover selección anterior
                roleButtons.forEach(btn => btn.classList.remove('selected'));
                // Añadir selección al botón actual
                button.classList.add('selected');
                this.currentRole = button.dataset.role;
                
                // Habilitar botón siguiente
                nextButton.disabled = false;
                nextButton.style.opacity = '1';
            });
        });

        nextButton.addEventListener('click', () => {
            if (this.currentRole) {
                // Guardar rol en localStorage (si estuviera disponible, usaríamos sessionStorage)
                this.saveToMemory('selectedRole', this.currentRole);
                // Redirigir a la página de registro
                this.navigateToRegistration();
            }
        });

        // Inicialmente deshabilitar el botón siguiente
        nextButton.disabled = true;
        nextButton.style.opacity = '0.6';
    }

    // LÓGICA PARA REGISTRO DE DATOS
    initRegistration() {
        // Mostrar el rol seleccionado
        const selectedRole = this.getFromMemory('selectedRole');
        if (selectedRole) {
            this.currentRole = selectedRole;
            const roleInfo = document.getElementById('selected-role-info');
            if (roleInfo) {
                roleInfo.textContent = `Registro como: ${this.getRoleDisplayName(selectedRole)}`;
            }
        }

        // Configurar validación del formulario
        this.setupFormValidation();

        // Configurar envío del formulario
        const submitButton = document.querySelector('.submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitRegistration();
            });
        }
    }

    setupFormValidation() {
        const form = document.querySelector('form') || document.querySelector('.container');
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Validaciones específicas por tipo
        switch(input.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor ingresa un correo electrónico válido';
                }
                break;
            case 'password':
                if (value.length < 8) {
                    isValid = false;
                    errorMessage = 'La contraseña debe tener al menos 8 caracteres';
                }
                break;
            case 'text':
                if (input.id === 'matricula') {
                    const matriculaRegex = /^\d{10}$/;
                    if (!matriculaRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'La matrícula debe tener 10 dígitos';
                    }
                }
                break;
        }

        // Mostrar/ocultar error
        if (!isValid) {
            this.showFieldError(input, errorMessage);
        } else {
            this.clearFieldError(input);
        }

        return isValid;
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        
        input.classList.add('error');
        input.style.borderColor = '#ef4444';
        
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('field-error');
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }

    clearFieldError(input) {
        input.classList.remove('error');
        input.style.borderColor = '';
        
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    submitRegistration() {
        const formData = this.getFormData();
        
        // Validar todos los campos
        let isFormValid = true;
        const requiredInputs = document.querySelectorAll('input[required]');
        
        requiredInputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showModal('Por favor corrige los errores en el formulario');
            return;
        }

        // Mostrar loading
        this.showLoading('Registrando usuario...');

        // Simular envío a servidor
        setTimeout(() => {
            this.hideLoading();
            
            // Simular respuesta exitosa
            const success = Math.random() > 0.1; // 90% de éxito
            
            if (success) {
                this.saveToMemory('userData', formData);
                this.showModal('¡Registro completado exitosamente!', () => {
                    this.navigateToUserView(this.currentRole);
                });
            } else {
                this.showModal('Error al registrar. Por favor intenta nuevamente.');
            }
        }, 2000);
    }

    getFormData() {
        return {
            role: this.currentRole,
            nombre: document.getElementById('nombre')?.value || '',
            email: document.getElementById('email')?.value || '',
            password: document.getElementById('password')?.value || '',
            matricula: document.getElementById('matricula')?.value || '',
            timestamp: new Date().toISOString()
        };
    }

    // LÓGICA PARA VISTA DOCENTE
    initDocenteView() {
        const carreraSelect = document.getElementById('carrera');
        const btnModificacion = document.getElementById('btn-modificacion');
        const btnGuardar = document.getElementById('btn-guardar');
        const btnDirectivo = document.getElementById('btn-directivo');

        // Manejar cambio de carrera
        if (carreraSelect) {
            carreraSelect.addEventListener('change', (e) => {
                this.showCareerTable(e.target.value);
            });
        }

        // Botón de modificación
        if (btnModificacion) {
            btnModificacion.addEventListener('click', () => {
                this.toggleEditMode();
            });
        }

        // Botón de guardar
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                this.saveAttendanceChanges();
            });
        }

        // Botón directivo (redirigir)
        if (btnDirectivo) {
            btnDirectivo.addEventListener('click', () => {
                this.showModal('Función no implementada aún');
            });
        }

        // Inicializar datos de ejemplo
        this.loadAttendanceData();
    }

    showCareerTable(career) {
        // Ocultar todas las tablas
        const tables = document.querySelectorAll('.table-container');
        tables.forEach(table => table.classList.add('hidden'));

        // Mostrar la tabla correspondiente
        const targetTable = document.getElementById(`table-${career}`);
        if (targetTable) {
            targetTable.classList.remove('hidden');
        }
    }

    toggleEditMode() {
        const tables = document.querySelectorAll('.styled-table');
        const btnModificacion = document.getElementById('btn-modificacion');
        const btnGuardar = document.getElementById('btn-guardar');
        const isEditing = btnModificacion.textContent.includes('Cancelar');

        tables.forEach(table => {
            const cells = table.querySelectorAll('td:nth-child(2), td:nth-child(3), td:nth-child(4)'); // Asistencia, Ausencia, Retardo
            
            cells.forEach(cell => {
                if (!isEditing) {
                    // Entrar en modo edición
                    const currentValue = cell.textContent.trim();
                    const select = document.createElement('select');
                    select.style.width = '100%';
                    select.style.padding = '0.5rem';
                    select.style.borderRadius = '0.5rem';
                    select.style.border = '2px solid var(--gray-300)';
                    
                    const options = [
                        { value: '-', text: '-' },
                        { value: '✓', text: '✓' }
                    ];
                    
                    options.forEach(option => {
                        const optionEl = document.createElement('option');
                        optionEl.value = option.value;
                        optionEl.textContent = option.text;
                        if (option.value === currentValue) {
                            optionEl.selected = true;
                        }
                        select.appendChild(optionEl);
                    });
                    
                    cell.innerHTML = '';
                    cell.appendChild(select);
                } else {
                    // Salir del modo edición
                    const select = cell.querySelector('select');
                    if (select) {
                        cell.textContent = select.value;
                    }
                }
            });
        });

        if (!isEditing) {
            btnModificacion.innerHTML = '<i class="fas fa-times"></i> Cancelar';
            btnGuardar.style.display = 'block';
        } else {
            btnModificacion.innerHTML = '<i class="fas fa-edit"></i> Modificación';
            btnGuardar.style.display = 'none';
        }
    }

    saveAttendanceChanges() {
        this.showLoading('Guardando cambios...');
        
        // Simular guardado en servidor
        setTimeout(() => {
            this.hideLoading();
            this.showModal('Cambios guardados exitosamente');
            
            // Salir del modo edición
            const btnModificacion = document.getElementById('btn-modificacion');
            if (btnModificacion.textContent.includes('Cancelar')) {
                this.toggleEditMode();
            }
        }, 1500);
    }

    // LÓGICA PARA VISTA PADRES DE FAMILIA
    initPadresView() {
        const hijoSelect = document.getElementById('hijo-select');
        const periodoSelect = document.getElementById('periodo-select');
        const btnConsultar = document.getElementById('btn-consultar');
        const btnReporte = document.getElementById('btn-reporte');

        // Manejar consulta de asistencia
        if (btnConsultar) {
            btnConsultar.addEventListener('click', () => {
                const hijoSeleccionado = hijoSelect?.value;
                const periodo = periodoSelect?.value;
                
                if (!hijoSeleccionado) {
                    this.showModal('Por favor selecciona un estudiante');
                    return;
                }
                
                this.consultarAsistenciaHijo(hijoSeleccionado, periodo);
            });
        }

        // Manejar generación de reporte
        if (btnReporte) {
            btnReporte.addEventListener('click', () => {
                const hijoSeleccionado = hijoSelect?.value;
                
                if (!hijoSeleccionado) {
                    this.showModal('Por favor selecciona un estudiante para generar el reporte');
                    return;
                }
                
                this.generarReportePadres(hijoSeleccionado);
            });
        }

        // Auto-consultar si hay un hijo seleccionado por defecto
        if (hijoSelect?.value) {
            this.consultarAsistenciaHijo(hijoSelect.value, periodoSelect?.value || 'semana');
        }
    }

    consultarAsistenciaHijo(hijoId, periodo) {
        this.showLoading('Consultando asistencia...');

        // Simular consulta a la API
        setTimeout(() => {
            const datosEjemplo = this.generarDatosAsistenciaEjemplo(hijoId, periodo);
            
            this.hideLoading();
            this.mostrarEstadisticasHijo(datosEjemplo);
            this.mostrarRegistrosHijo(datosEjemplo.registros);
            
            // Mostrar secciones de estadísticas y registros
            document.getElementById('estadisticas-section')?.classList.remove('hidden');
            document.getElementById('registros-section')?.classList.remove('hidden');
        }, 1500);
    }

    generarDatosAsistenciaEjemplo(hijoId, periodo) {
        // Datos simulados basados en el período
        const multiplicador = {
            'semana': 1,
            'mes': 4,
            'bimestre': 8,
            'semestre': 16
        }[periodo] || 1;

        const asistencias = Math.floor(Math.random() * 10 + 15) * multiplicador;
        const ausencias = Math.floor(Math.random() * 3 + 1) * multiplicador;
        const retardos = Math.floor(Math.random() * 2 + 1) * multiplicador;
        const total = asistencias + ausencias + retardos;
        const porcentaje = Math.round((asistencias / total) * 100);

        return {
            asistencias,
            ausencias,
            retardos,
            porcentaje,
            registros: this.generarRegistrosEjemplo(total)
        };
    }

    generarRegistrosEjemplo(cantidad) {
        const materias = ['Programación Orientada a Objetos', 'Base de Datos', 'Desarrollo Web', 'Matemáticas', 'Inglés'];
        const docentes = ['Prof. Juan Martínez', 'Prof. Ana López', 'Prof. Carlos García', 'Prof. María Rodríguez'];
        const estados = [
            { estado: 'Presente', clase: 'presente', icono: 'fas fa-check-circle' },
            { estado: 'Ausente', clase: 'ausente', icono: 'fas fa-times-circle' },
            { estado: 'Retardo', clase: 'retardo', icono: 'fas fa-clock' }
        ];

        const registros = [];
        for (let i = 0; i < Math.min(cantidad, 20); i++) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - i);
            
            const estadoRandom = estados[Math.floor(Math.random() * estados.length)];
            
            registros.push({
                fecha: fecha.toISOString().split('T')[0],
                hora: `${Math.floor(Math.random() * 4 + 7).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                materia: materias[Math.floor(Math.random() * materias.length)],
                docente: docentes[Math.floor(Math.random() * docentes.length)],
                estado: estadoRandom
            });
        }

        return registros;
    }

    mostrarEstadisticasHijo(datos) {
        document.getElementById('asistencias-count').textContent = datos.asistencias;
        document.getElementById('ausencias-count').textContent = datos.ausencias;
        document.getElementById('retardos-count').textContent = datos.retardos;
        document.getElementById('porcentaje-asistencia').textContent = `${datos.porcentaje}%`;
    }

    mostrarRegistrosHijo(registros) {
        const tbody = document.getElementById('registros-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        registros.forEach(registro => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${registro.fecha}</td>
                <td>${registro.hora}</td>
                <td>${registro.materia}</td>
                <td>${registro.docente}</td>
                <td>
                    <span style="color: ${this.getEstadoColor(registro.estado.estado)};">
                        <i class="${registro.estado.icono}"></i>
                        ${registro.estado.estado}
                    </span>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getEstadoColor(estado) {
        const colores = {
            'Presente': 'var(--accent-color)',
            'Ausente': '#ef4444',
            'Retardo': '#f59e0b'
        };
        return colores[estado] || 'var(--gray-700)';
    }

    generarReportePadres(hijoId) {
        this.showLoading('Generando reporte PDF...');
        
        setTimeout(() => {
            this.hideLoading();
            this.showModal('Reporte generado exitosamente. Se descargará automáticamente.');
            
            // Aquí se implementaría la descarga real del PDF
            console.log(`Generando reporte para estudiante: ${hijoId}`);
        }, 2000);
    }

    // LÓGICA PARA VISTA DIRECTIVO
    initDirectivoView() {
        const reporteTipoSelect = document.getElementById('reporte-tipo');
        const btnGenerarReporte = document.getElementById('btn-generar-reporte');
        const btnExportarExcel = document.getElementById('btn-exportar-excel');
        const btnExportarPdf = document.getElementById('btn-exportar-pdf');
        const btnConfiguracion = document.getElementById('btn-configuracion');

        // Manejar cambio de tipo de reporte
        if (reporteTipoSelect) {
            reporteTipoSelect.addEventListener('change', (e) => {
                this.toggleFiltrosDirectivo(e.target.value);
            });
        }

        // Botones de acción
        if (btnGenerarReporte) {
            btnGenerarReporte.addEventListener('click', () => {
                this.generarReporteDirectivo();
            });
        }

        if (btnExportarExcel) {
            btnExportarExcel.addEventListener('click', () => {
                this.exportarReporte('excel');
            });
        }

        if (btnExportarPdf) {
            btnExportarPdf.addEventListener('click', () => {
                this.exportarReporte('pdf');
            });
        }

        if (btnConfiguracion) {
            btnConfiguracion.addEventListener('click', () => {
                this.mostrarConfiguracion();
            });
        }

        // Cargar datos iniciales
        this.actualizarMetricasDirectivo();
    }

    toggleFiltrosDirectivo(tipoReporte) {
        // Ocultar todos los filtros
        document.getElementById('filtro-carrera').style.display = 'none';
        document.getElementById('filtro-docente').style.display = 'none';
        document.getElementById('filtro-periodo').style.display = 'none';

        // Mostrar filtros según el tipo de reporte
        switch(tipoReporte) {
            case 'carrera':
                document.getElementById('filtro-carrera').style.display = 'block';
                break;
            case 'docente':
                document.getElementById('filtro-docente').style.display = 'block';
                break;
            case 'periodo':
                document.getElementById('filtro-periodo').style.display = 'block';
                break;
        }
    }

    generarReporteDirectivo() {
        const tipoReporte = document.getElementById('reporte-tipo')?.value;
        
        this.showLoading(`Generando reporte ${tipoReporte}...`);
        
        setTimeout(() => {
            this.hideLoading();
            
            // Simular actualización de datos basada en filtros
            this.actualizarTablaReportes(tipoReporte);
            this.showModal('Reporte actualizado exitosamente');
        }, 2000);
    }

    actualizarTablaReportes(tipoReporte) {
        console.log(`Actualizando tabla con reporte tipo: ${tipoReporte}`);
        
        // Aquí se implementaría la lógica para actualizar la tabla
        // con datos filtrados según el tipo de reporte seleccionado
    }

    exportarReporte(formato) {
        this.showLoading(`Exportando a ${formato.toUpperCase()}...`);
        
        setTimeout(() => {
            this.hideLoading();
            this.showModal(`Archivo ${formato.toUpperCase()} exportado exitosamente`);
            
            // Aquí se implementaría la descarga real del archivo
            console.log(`Exportando reporte a formato: ${formato}`);
        }, 2500);
    }

    mostrarConfiguracion() {
        this.showModal('Panel de configuración en desarrollo. Próximamente disponible.');
    }

    actualizarMetricasDirectivo() {
        // Simular carga de métricas desde la base de datos
        const metricas = {
            totalEstudiantes: 245,
            totalDocentes: 28,
            totalCarreras: 4,
            totalAsistencias: 1847,
            totalAusencias: 203,
            totalRetardos: 127,
            promedioAsistencia: 84.8
        };

        // Actualizar elementos en el DOM (ya están pre-cargados en el HTML)
        // En una implementación real, estos valores se cargarían dinámicamente
        console.log('Métricas cargadas:', metricas);
    }

    loadAttendanceData() {
        // Datos de ejemplo - en una app real vendrían de una API
        const attendanceData = {
            tidsm: [
                { nombre: 'Eddel Jonathan Perez', asistencia: '-', ausencia: '-', retardo: '-', fecha: '2024-01-15' },
                { nombre: 'Karen Yanitzey Hernandez', asistencia: '✓', ausencia: '-', retardo: '-', fecha: '2024-01-15' },
                { nombre: 'Adilene Monserrat', asistencia: '-', ausencia: '✓', retardo: '-', fecha: '2024-01-15' },
                { nombre: 'Fidel Alexis Gonzalez Mazon', asistencia: '-', ausencia: '-', retardo: '✓', fecha: '2024-01-15' }
            ],
            sistemas: [
                { nombre: 'María González López', asistencia: '✓', ausencia: '-', retardo: '-', fecha: '2024-01-15' },
                { nombre: 'Carlos Rodríguez Pérez', asistencia: '✓', ausencia: '-', retardo: '-', fecha: '2024-01-15' },
                { nombre: 'Ana Martínez Silva', asistencia: '-', ausencia: '✓', retardo: '-', fecha: '2024-01-15' },
                { nombre: 'Luis Fernando Torres', asistencia: '✓', ausencia: '-', retardo: '-', fecha: '2024-01-15' }
            ],
            web: [
                { nombre: 'Pedro Ramírez Vega', asistencia: '-', ausencia: '-', retardo: '✓', fecha: '2024-01-15' },
                { nombre: 'Sofía Hernández Cruz', asistencia: '✓', ausencia: '-', retardo: '-', fecha: '2024-01-15' },
                { nombre: 'Diego Morales Castro', asistencia: '✓', ausencia: '-', retardo: '-', fecha: '2024-01-15' },
                { nombre: 'Isabella Ruiz Mendoza', asistencia: '-', ausencia: '✓', retardo: '-', fecha: '2024-01-15' }
            ],
            otra: [
                { nombre: 'Alejandro Jiménez Flores', asistencia: '✓', ausencia: '-', retardo: '-', fecha: '2024-01-15' },
                { nombre: 'Valeria Sánchez Ortega', asistencia: '-', ausencia: '✓', retardo: '-', fecha: '2024-01-15' },
                { nombre: 'Roberto García Díaz', asistencia: '✓', ausencia: '-', retardo: '-', fecha: '2024-01-15' }
            ]
        };

        // Actualizar las tablas con los datos
        Object.keys(attendanceData).forEach(career => {
            const table = document.getElementById(`table-${career}`);
            if (table) {
                const tbody = table.querySelector('tbody');
                if (tbody) {
                    tbody.innerHTML = '';
                    attendanceData[career].forEach(student => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${student.nombre}</td>
                            <td>${student.asistencia}</td>
                            <td>${student.ausencia}</td>
                            <td>${student.retardo}</td>
                            <td>${student.fecha}</td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            }
        });
    }

    // LÓGICA PARA VISTA ALUMNO
    initAlumnoView() {
        // Cargar datos del estudiante al iniciar
        this.loadStudentData();

        // Configurar fecha y hora actuales
        this.setCurrentDateTime();

        // Configurar botón de guardar
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.guardarRegistro();
            });
        }

        // Configurar validación en tiempo real
        const requiredInputs = document.querySelectorAll('#docente, #materia');
        requiredInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateAlumnoForm();
            });
        });
    }

    loadStudentData() {
        return new Promise((resolve) => {
            // Mostrar overlay de carga
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('show');
            }

            // Simular carga desde base de datos/API
            setTimeout(() => {
                // Intentar obtener datos guardados o usar datos de ejemplo
                const savedData = this.getFromMemory('userData');
                
                if (savedData && savedData.nombre) {
                    this.studentData = {
                        nombre: savedData.nombre,
                        carrera: this.getCareerFromRole(savedData.role),
                        matricula: savedData.matricula || '2023040156'
                    };
                } else {
                    // Datos de ejemplo
                    this.studentData = {
                        nombre: 'María González Hernández',
                        carrera: 'Ingeniería en Sistemas Computacionales',
                        matricula: '2023040156'
                    };
                }

                // Llenar los campos con los datos cargados
                const nombreEl = document.getElementById('nombreUsuario');
                const carreraEl = document.getElementById('carrera');
                const matriculaEl = document.getElementById('matricula');

                if (nombreEl) nombreEl.textContent = this.studentData.nombre;
                if (carreraEl) carreraEl.textContent = this.studentData.carrera;
                if (matriculaEl) matriculaEl.textContent = this.studentData.matricula;

                this.isDataLoaded = true;

                // Ocultar overlay de carga
                if (loadingOverlay) {
                    loadingOverlay.classList.remove('show');
                }

                resolve(this.studentData);
            }, 2000);
        });
    }

    setCurrentDateTime() {
        const now = new Date();
        const fechaInput = document.getElementById('fecha');
        const horaInput = document.getElementById('hora');

        if (fechaInput) {
            fechaInput.value = now.toISOString().split('T')[0];
        }

        if (horaInput) {
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            horaInput.value = `${hours}:${minutes}`;
        }
    }

    validateAlumnoForm() {
        const docente = document.getElementById('docente')?.value.trim();
        const materia = document.getElementById('materia')?.value.trim();
        const saveBtn = document.getElementById('saveBtn');

        const isValid = docente && materia && this.isDataLoaded;

        if (saveBtn) {
            saveBtn.disabled = !isValid;
            saveBtn.style.opacity = isValid ? '1' : '0.6';
        }

        return isValid;
    }

    guardarRegistro() {
        if (!this.validateAlumnoForm()) {
            this.showModal('Por favor completa todos los campos requeridos');
            return;
        }

        const registroData = {
            estudiante: this.studentData,
            fecha: document.getElementById('fecha')?.value,
            hora: document.getElementById('hora')?.value,
            docente: document.getElementById('docente')?.value.trim(),
            materia: document.getElementById('materia')?.value.trim(),
            timestamp: new Date().toISOString()
        };

        // Mostrar loading
        this.showLoading('Guardando registro de asistencia...');

        // Simular envío a servidor
        setTimeout(() => {
            this.hideLoading();
            
            // Simular respuesta exitosa
            const success = Math.random() > 0.05; // 95% de éxito
            
            if (success) {
                // Guardar en memoria
                const registros = this.getFromMemory('registrosAsistencia') || [];
                registros.push(registroData);
                this.saveToMemory('registrosAsistencia', registros);
                
                this.showModal('¡Registro de asistencia guardado exitosamente!', () => {
                    // Limpiar formulario
                    document.getElementById('docente').value = '';
                    document.getElementById('materia').value = '';
                    this.setCurrentDateTime();
                });
            } else {
                this.showModal('Error al guardar el registro. Por favor intenta nuevamente.');
            }
        }, 1500);
    }

    // UTILIDADES GENERALES
    saveToMemory(key, data) {
        // Como no podemos usar localStorage, guardamos en una variable global
        if (!window.asisTechMemory) {
            window.asisTechMemory = {};
        }
        window.asisTechMemory[key] = data;
    }

    getFromMemory(key) {
        if (!window.asisTechMemory) {
            window.asisTechMemory = {};
        }
        return window.asisTechMemory[key];
    }

    getRoleDisplayName(role) {
        const roleNames = {
            'estudiante': 'Estudiante',
            'docente': 'Docente',
            'padres': 'Padres de Familia',
            'directivo': 'Directivo'
        };
        return roleNames[role] || role;
    }

    getCareerFromRole(role) {
        // Mapeo simple de rol a carrera (en una app real esto vendría de la DB)
        const careerMap = {
            'estudiante': 'Tecnologías de la Información DSM',
            'docente': 'Docente',
            'padres': 'N/A',
            'directivo': 'Administración'
        };
        return careerMap[role] || 'Carrera no especificada';
    }

    showModal(message, callback = null) {
        // Crear o mostrar modal personalizado
        let modal = document.getElementById('customModal');
        
        if (!modal) {
            // Crear modal si no existe
            modal = document.createElement('div');
            modal.id = 'customModal';
            modal.className = 'custom-modal';
            modal.innerHTML = `
                <div class="custom-modal-content">
                    <p id="modalMessage"></p>
                    <button onclick="window.asisTech.closeModal()">Cerrar</button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const messageEl = document.getElementById('modalMessage');
        if (messageEl) {
            messageEl.textContent = message;
        }

        modal.classList.add('show');
        
        // Guardar callback para ejecutar al cerrar
        this.modalCallback = callback;
    }

    closeModal() {
        const modal = document.getElementById('customModal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        // Ejecutar callback si existe
        if (this.modalCallback) {
            this.modalCallback();
            this.modalCallback = null;
        }
    }

    showLoading(message = 'Cargando...') {
        let overlay = document.getElementById('loadingOverlay');
        
        if (!overlay) {
            // Crear overlay si no existe
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="spinner"></div>
                    <p id="loadingMessage">${message}</p>
                </div>
            `;
            document.body.appendChild(overlay);
        } else {
            const messageEl = document.getElementById('loadingMessage');
            if (messageEl) {
                messageEl.textContent = message;
            }
        }

        overlay.classList.add('show');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    navigateToRegistration() {
        // En una SPA real, cambiaríamos de vista
        // Por ahora, simularemos con un mensaje
        this.showModal('Navegando a registro...', () => {
            window.location.href = 'registro.html';
        });
    }

    navigateToUserView(role) {
        const urls = {
            'estudiante': 'alumno.html',
            'docente': 'docente.html',
            'padres': 'padres.html',
            'directivo': 'directivo.html'
        };
        
        const url = urls[role] || 'index.html';
        window.location.href = url;
    }
}

// Funciones globales para compatibilidad
function closeModal() {
    if (window.asisTech) {
        window.asisTech.closeModal();
    }
}

function guardarRegistro() {
    if (window.asisTech) {
        window.asisTech.guardarRegistro();
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.asisTech = new AsisTechApp();
});

// Exportar para uso en otros scripts si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AsisTechApp;
}