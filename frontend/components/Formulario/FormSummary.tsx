import React from 'react';
import { useFormContext, FormData } from './FormContext';

const FormSummary = () => {
  const { formData } = useFormContext();

  // Función para formatear fechas
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No especificado';
    return new Date(date).toLocaleDateString('es-GT');
  };

  // Función para formatear montos
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'No especificado';
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Resumen de tu solicitud</h3>
      <p className="text-sm text-gray-600 mb-4">
        Por favor revisa la información antes de continuar. Si necesitas corregir algo, 
        puedes regresar a los pasos anteriores.
      </p>

      {/* Paso 1: Monto y Propósito */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Monto y Propósito</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Monto solicitado</p>
            <p className="font-medium">{formatCurrency(formData.monto_solicitado)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Propósito</p>
            <p className="font-medium">{formData.proposito || 'No especificado'}</p>
          </div>
        </div>
      </div>

      {/* Paso 2: Datos Personales */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Datos Personales</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nombre completo</p>
            <p className="font-medium">{`${formData.nombre || ''} ${formData.apellido || ''}`}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">DPI</p>
            <p className="font-medium">{formData.dpi || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha de nacimiento</p>
            <p className="font-medium">{formatDate(formData.fecha_nacimiento)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Correo electrónico</p>
            <p className="font-medium">{formData.correo || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-medium">{formData.telefono || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ubicación</p>
            <p className="font-medium">{`${formData.municipio || ''}, ${formData.departamento || ''}`}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Dirección</p>
            <p className="font-medium">{formData.direccion || 'No especificado'}</p>
          </div>
        </div>
      </div>

      {/* Paso 3: Vivienda */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Vivienda</h4>
        <div>
          <p className="text-sm text-gray-500">Tipo de vivienda</p>
          <p className="font-medium">{formData.tipo_vivienda || 'No especificado'}</p>
        </div>
      </div>

      {/* Paso 4: Educación */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Educación</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nivel educativo</p>
            <p className="font-medium">{formData.nivel_educativo || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Institución</p>
            <p className="font-medium">{formData.institucion || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">País de estudios</p>
            <p className="font-medium">{formData.pais_estudios || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Año de graduación</p>
            <p className="font-medium">{formData.ano_graduacion || 'No especificado'}</p>
          </div>
        </div>
      </div>

      {/* Paso 5: Ingresos y Empleo */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Ingresos y Empleo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Estado laboral</p>
            <p className="font-medium">{formData.estado_laboral || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Empresa</p>
            <p className="font-medium">{formData.empresa || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cargo</p>
            <p className="font-medium">{formData.cargo || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Antigüedad (años)</p>
            <p className="font-medium">{formData.antiguedad || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ingreso mensual</p>
            <p className="font-medium">{formatCurrency(formData.ingreso_mensual)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Otros ingresos</p>
            <p className="font-medium">{formatCurrency(formData.otros_ingresos)}</p>
          </div>
        </div>
      </div>

      {/* Paso 6: Vehículo */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Vehículo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Posee vehículo</p>
            <p className="font-medium">{formData.posee_vehiculo || 'No especificado'}</p>
          </div>
          {formData.posee_vehiculo && formData.posee_vehiculo !== 'No' && (
            <div>
              <p className="text-sm text-gray-500">Kilometraje</p>
              <p className="font-medium">
                {formData.kilometraje ? `${formData.kilometraje} km` : 'No especificado'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Paso 7: Situación Financiera */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Situación Financiera</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Ahorros</p>
            <p className="font-medium">{formatCurrency(formData.ahorros)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cuentas de inversión</p>
            <p className="font-medium">{formatCurrency(formData.cuentas_inversion)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nuevos préstamos en los últimos 3 meses</p>
            <p className="font-medium">{formData.nuevos_prestamos_3meses ? 'Sí' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Otras deudas</p>
            <p className="font-medium">{formData.otras_deudas ? 'Sí' : 'No'}</p>
          </div>
          {formData.otras_deudas && (
            <>
              <div>
                <p className="text-sm text-gray-500">Monto de deuda</p>
                <p className="font-medium">{formatCurrency(formData.monto_deuda)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entidad</p>
                <p className="font-medium">{formData.entidad || 'No especificado'}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Paso 8: Documentación */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Documentación</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm text-gray-500">DPI</p>
            <p className="font-medium">
              {formData.dpi_documento ? 'Documento cargado' : 'Pendiente'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Comprobante de ingresos</p>
            <p className="font-medium">
              {formData.comprobante_ingresos ? 'Documento cargado' : 'Pendiente'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Recibo de servicios</p>
            <p className="font-medium">
              {formData.recibo_servicios ? 'Documento cargado' : 'Pendiente'}
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default FormSummary;
